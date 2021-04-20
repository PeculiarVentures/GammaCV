interface IDoc {
  name: string;
  path: string;
}

interface IDocGroup {
  name: string;
  children: IDoc[];
}

type DocDataType = any;
