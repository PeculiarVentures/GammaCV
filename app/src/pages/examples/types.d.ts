interface IExample {
  type: string;
  name: string;
  path: string;
}

interface IGroup {
  key: string;
  name: string;
  examples: IExample[];
}
