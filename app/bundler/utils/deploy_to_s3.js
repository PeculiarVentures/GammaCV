import fs from 'fs';
import path from 'path';
import glob from 'glob'; // eslint-disable-line
import async from 'async'; // eslint-disable-line
import mime from 'mime'; // eslint-disable-line
import AWS from 'aws-sdk';

const debug = require('./debug')('deploy:aws-s3');

/** These are network requests */
const MAX_PARALLEL = 25;
/*
* Upload Strategy:
* 1. Glob FS of output dir
* 2. FS stat to build creation plan
* 3. Prioritize work
* 4. For Each Task Execute Async
* */
const TASK_TYPES = {
  FILE: 'file',
  DIR: 'dir',
};

const FILES_WITH_NO_CACHE_HEADER = [
  /^index.html$/,
  /sw.js/,
];

const getTaskCacheControlHeader = (remotePath) => {
  const results = FILES_WITH_NO_CACHE_HEADER.map(reg => reg.test(remotePath));
  if (results.indexOf(true) === -1) {
    return 'public, max-age=1339200';
  }

  return 'no-cache';
};

const makeTask = (rootPath, localPath, done) => {
  fs.lstat(localPath, (err, stat) => { // eslint-disable-line
    const remotePath = path.relative(rootPath, localPath);
    const info = {
      localPath,
      remotePath,
      CacheControl: getTaskCacheControlHeader(remotePath),
    };
    if (stat.isFile()) info.type = TASK_TYPES.FILE;
    if (stat.isDirectory()) info.type = TASK_TYPES.DIR;
    if (info.type) return done(null, info);
    done(null, undefined);
  });
};

const buildExecutionPlan = (rootPath, search, done) => {
  const globPath = path.format({ dir: rootPath, base: search || '**' });
  debug('Discovering files...');
  glob(globPath, (err, paths) => { // eslint-disable-line
    if (err) return done(err);
    // Enumerate all files and create tasks
    async.mapLimit(paths, MAX_PARALLEL, makeTask.bind(null, rootPath), done);
  });
};

const createAWSglobalBucketReadPolicy = bucketName => ({
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'AddPerm',
      Effect: 'Allow',
      Principal: '*',
      Action: [
        's3:GetObject',
      ],
      Resource: [
        `arn:aws:s3:::${bucketName}/*`,
        `arn:aws:s3:::${bucketName}/**/*`,
      ],
    },
  ],
});

const makeBucketReadable = (s3, bucketName, done) => {
  const policy = {
    Bucket: bucketName,
    Policy: JSON.stringify(createAWSglobalBucketReadPolicy(bucketName)),
  };
  s3.putBucketPolicy(policy, done);
};

const executeTaskOnS3 = (s3, bucketName, task, done) => { // eslint-disable-line
  // Ignore root
  if (task.remotePath === '' || task.type === TASK_TYPES.DIR) return done();

  // Upload the file to S3
  s3.upload({
    Bucket: bucketName,
    Key: task.remotePath,
    ACL: 'public-read',
    CacheControl: task.CacheControl,
    ContentType: mime.lookup(task.localPath),
    Body: fs.createReadStream(task.localPath),
  }, (err) => { // eslint-disable-line
    if (err) return done(err);
    debug(`Uploading '${task.localPath}' to '${bucketName}' at '${task.remotePath}'`);
    done();
  });
};

// TODO: Delete old files that don't match the delta
const uploadDirectoryToS3 = (rootPath, search, opts) => { // eslint-disable-line
  return new Promise((resolve, reject) => {
    buildExecutionPlan(rootPath, search, (err, tasks) => { // eslint-disable-line
      if (err) return reject(err);

      debug(`Discovered ${tasks.length} entries...`);

      makeBucketReadable(opts.s3, opts.bucketName, (err) => { // eslint-disable-line
        if (err) return reject(err);

        debug(`Made Bucket '${opts.bucketName}' readable`);
        debug(`Uploading files Bucket '${opts.bucketName}'`);

        async.eachLimit(tasks, MAX_PARALLEL, executeTaskOnS3.bind(null, opts.s3, opts.bucketName), () => { // eslint-disable-line
          debug('> SUCCESS: Finished Uploading files...');
          resolve();
        });
      });
    });
  });
};

export default function deployToAWS(dstPath, bucketName, bucketRegion) {
  debug('> START');

  return new Promise((resolve, reject) => { // eslint-disable-line
    if (!bucketName) {
      reject();
      return debug('> FAILED: must provide a bucket name in `AWS_DEPLOY_BUCKET_NAME`!');
    }

    if (!bucketRegion) {
      reject();
      return debug('> FAILED: must provide a region name in `AWS_DEPLOY_REGION`!');
    }

    let s3;

    try {
      AWS.config.update({ region: bucketRegion });
      s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: bucketName },
      });
    } catch (e) {
      reject(e);
      return debug(`> FAILED: ${e}`);
    }

    // Upload the newly built files to S3
    uploadDirectoryToS3(path.join(__dirname, `../../${dstPath}`), '**/!(*.js.map)', { s3, bucketName })
      .then(res => resolve(res))
      .catch((err) => {
        reject(err);
        debug(`> FAILED: ${err}`);
      });
  });
}

