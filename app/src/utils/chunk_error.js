import appController from '../bootstrap';

export default function handleLoadingChunkError(err) {
  console.warn(err);

  return appController.vc.checkVersion()
    .then(() => null)
    .catch((checkVersionError) => {
      console.warn('Unable to check version', checkVersionError);

      return null;
    });
}
