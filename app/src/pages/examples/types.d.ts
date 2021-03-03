interface IExample {
  type: string;
  name: string;
  path: string;
}

interface IExampleGroup {
  key: string;
  name: string;
  examples: IExample[];
}
