/**
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

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
