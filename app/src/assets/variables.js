export default `
  $mobile_sizes: "(max-width: 768px), (max-width: 812px) and (max-height: 375px)";
  $tablet_sizes: "(max-width: 1200px) and (min-width: 769px) and (min-height: 376px)";
`.replace(/\s/g, '').replace(/:/g, ': ');
