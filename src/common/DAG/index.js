const Edge = (parent, child, value) => ({ parent, child, value });
const Node = name => ({ name, parentEdges: [], childEdges: [], value: 0 });

class DAG {
  constructor() {
    this.nodes = {};
    this.sortedNodes = null;
  }

  upsert = (name, value) => {
    if (!this.nodes[name]) { this.nodes[name] = Node(name); }
    if (value) { this.nodes[name].value = value; }

    return this.nodes[name];
  }

  connect = (parent, child, value) => {
    const parentNode = this.upsert(parent);
    const childNode = this.upsert(child);
    const edge = Edge(parentNode, childNode, value);
    parentNode.childEdges.push(edge);
    childNode.parentEdges.push(edge);
  }

  sort = () => {
    this.roots = Object.values(this.nodes).filter(node => !node.parentEdges.length);
    const available = [...this.roots];

    const resolved = {};
    const resolvedOrder = [];

    do {
      const current = available.shift();

      resolvedOrder.push(current);
      resolved[current.name] = true;

      current.childEdges.forEach((childEdge) => {
        if (childEdge.child.parentEdges.every(parentEdge => resolved[parentEdge.parent.name])) {
          available.push(childEdge.child);
        }
      });
    } while (available.length);

    this.sortedNodes = resolvedOrder;
    return resolvedOrder;
  }

  forEachInOrder = (cb, reverse) => {
    if (!this.sortedNodes) { this.sort(); }

    const [start, end, step] = (reverse)
      ? [this.sortedNodes.length - 1, -1, -1]
      : [0, this.sortedNodes.length, 1];

    for (let i = start; i !== end; i += step) {
      cb(this.sortedNodes[i]);
    }
  }
}

export default DAG;
