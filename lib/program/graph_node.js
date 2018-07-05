export default class GraphNode {
  static GlobalCountIncrease() {
    GraphNode.GlobalNodesCount += 1;

    return GraphNode.GlobalNodesCount;
  }

  constructor(name) {
    this.id = GraphNode.GlobalCountIncrease();
    this.name = `${name}:${this.id}`;
  }
}

GraphNode.GlobalNodesCount = 0;
