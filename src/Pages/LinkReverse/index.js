import React, { Fragment } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { Button } from "antd";

class LinkNode {
  constructor(id, label, visibility = true) {
    this.id = id;
    this.label = label;
    this.visibility = visibility;
    this.nextNode = undefined;
    this.classes = [];
  }
  setNext(node) {
    this.nextNode = node;
    return node;
  }
  getNext() {
    return this.nextNode;
  }
  setNormal() {
    this.classes = [];
  }
  setCur() {
    this.classes = [...this.classes, "cur-node"];
    return this;
  }
  setPrev() {
    this.classes = [...this.classes, "prev-node"];
    return this;
  }
  setAns() {
    this.classes = [...this.classes, "ans"];
    return this;
  }
}

export class LinkReverse extends React.Component {
  constructor(props) {
    super(props);

    const n0 = new LinkNode("0", `x`, false);
    const na = new LinkNode("a", `a`, true);
    const nb = new LinkNode("b", `b`, true);
    const nc = new LinkNode("c", `c`, true);
    const nd = new LinkNode("d", `d`, true);
    const ne = new LinkNode("e", `e`, true);
    na.setNext(nb).setNext(nc).setNext(nd).setNext(ne);

    this.nodes = [];

    this.state = {
      nodes: [n0, na, nb, nc, nd, ne],
    };

    this.run = this.actions();
  }

  get elements() {
    const ans = [];
    const nodes = this.state.nodes;
    for (const n of nodes) {
      ans.push({
        data: {
          id: n.id,
          label: n.label,
          visibility: n.visibility ? "visible" : "hidden",
        },
        classes: n.classes,
      });
    }
    for (const n of nodes) {
      if (n.nextNode) {
        ans.push({
          data: {
            id: `${n.id}${n.nextNode.id}`,
            source: n.id,
            target: n.nextNode.id,
          },
        });
      }
    }
    return ans;
  }

  refresh() {
    this.setState((state, props) => {
      return {
        nodes: state.nodes,
      };
    });
  }

  *actions() {
    // add sentry
    this.state.nodes[0].visibility = true;
    this.refresh();
    yield;

    // set pre, cur
    let prv = this.state.nodes[0].setPrev();
    let cur = this.state.nodes[1].setCur();
    this.refresh();

    while (true) {
      yield;
      // move edge
      const nxt = cur.getNext();
      cur.setNext(prv);
      this.refresh();
      if (!nxt) {
        break;
      }
      yield;
      // set prv cur
      prv.setNormal();
      prv = cur.setPrev();
      cur = nxt && nxt.setCur();
      this.refresh();
    }
    // set ans
    cur.setAns();
    this.setState((state, props) => {
      return {
        nodes: state.nodes,
      };
    });
  }

  render() {
    const layout = { name: "grid", rows: 1 };
    const stylesheet = [
      {
        selector: "node",
        style: {
          "background-color": "#090",
          label: "data(label)",
          visibility: "data(visibility)",
          "background-opacity": 0.8,
          width: 40,
          height: 40,
          "font-size": 30,
          "text-valign": "center",
          "text-halign": "center",
        },
      },
      {
        selector: "edge",
        style: {
          width: 6,
          "line-color": "#ccc",
          "target-arrow-color": "#ccc",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
        },
      },
      {
        selector: ".cur-node",
        style: {
          "background-color": "#61bffc",
        },
      },
      {
        selector: ".prev-node",
        style: {
          "background-color": "#f00",
        },
      },
      {
        selector: ".ans",
        style: {
          width: 80,
          height: 80,
        },
      },
    ];

    return (
      <Fragment>
        <Button.Group className="button-group">
          <Button type="primary" onClick={(e) => this.run.next()}>
            Next
          </Button>
          {/* <Button type="primary" onClick={(e) => this.run.next()}>
            Reset
          </Button> */}
        </Button.Group>
        <CytoscapeComponent
          elements={this.elements}
          layout={layout}
          style={{ height: "600px" }}
          stylesheet={stylesheet}
        />
      </Fragment>
    );
  }
}
