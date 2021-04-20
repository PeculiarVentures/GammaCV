type TDeviceType = 'desktop' | 'tablet' | 'mobile';

export interface IDeviceInfo {
  type: TDeviceType
  height: number;
  width: number;
}

export const getDeviceInfo = (): IDeviceInfo => {
  const { innerWidth, innerHeight } = window;
  let type: TDeviceType = 'desktop';

  if (innerWidth <= 1024 && innerWidth > 768 && innerHeight > 375) {
    type = 'tablet';
  } else if (innerWidth <= 768 || (innerWidth <= 812 && innerHeight <= 375)) {
    type = 'mobile';
  }

  return {
    type,
    width: innerWidth,
    height: innerHeight,
  };
};
