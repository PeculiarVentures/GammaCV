const uuid = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) => // eslint-disable-line
  s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));

export default uuid;
