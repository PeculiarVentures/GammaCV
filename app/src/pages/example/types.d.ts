interface ISlideParamProps {
  name: string;
  type: 'constant' | 'uniform';
  min: number;
  max: number;
  step: number;
  default: number;
}

interface ISelectParamProps {
  name: string;
  type: 'constant' | 'uniform';
  values: {
    name: string;
    value: string;
  }[];
}

type TParamsElement = Record<string, ISlideParamProps | ISelectParamProps> & {
  name?: string;
}
type TParams = Record<string, TParamsElement>;
type TParamValueElement = Record<string, string | number>;
type TParamsValue = Record<string, TParamValueElement>;

interface IParamsWrapperProps {
  handleChangeState: (paramName: string, key: string, value: string | number) => void;
  onReset: () => void;
  params?: TParams,
  paramsValue: TParamsValue,
}
