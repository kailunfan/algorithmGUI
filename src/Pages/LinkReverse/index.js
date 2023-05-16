import React, { Fragment } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { Button } from "antd";

import popper from "cytoscape-popper";
import cytoscape from "cytoscape";
cytoscape.use(popper);

class LinkNode {
  constructor(id, label, visibility = true) {
    this.id = id;
    this.label = label;
    this.visibility = visibility;
    this.nextNode = undefined;
    this.classes = [];
    this.tooltip = "";
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
    this.tooltip = "";
  }
  setCur() {
    this.classes = [...this.classes, "cur-node"];
    this.tooltip = "cur";
    return this;
  }
  setPrev() {
    this.classes = [...this.classes, "prev-node"];
    this.tooltip = "prev";
    return this;
  }
  setAns() {
    this.classes = [...this.classes, "ans"];
    return this;
  }
}

export class LinkReverse extends React.Component {
  myCyRef = undefined;
  poppers = [];
  constructor(props) {
    super(props);

    const n0 = new LinkNode("0", `null`, false);
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
          tooltip: n.tooltip,
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

  componentDidUpdate() {
    for (const p of this.poppers) {
      p.destroy();
    }
    for (const x of this.myCyRef.nodes()) {
      const p = x.popper({
        content: () => {
          let div = document.createElement("div");
          div.innerHTML = x.data().tooltip;
          document.body.appendChild(div);
          return div;
        },
        popper: {}, // my popper options here
      });
      this.poppers.push(p);
      let update = () => {
        p.update();
      };
      x.on("position", update);
      this.myCyRef.on("pan zoom resize", update);
    }
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

    while (cur) {
      yield;
      // move edge
      const nxt = cur.getNext();
      cur.setNext(prv);
      this.refresh();
      yield;
      // set prv cur
      prv.setNormal();
      prv = cur.setPrev();
      cur = nxt && nxt.setCur();
      this.refresh();
    }
    // set ans
    yield;
    prv.setAns();
    this.refresh();
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
          "text-valign": "top",
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
        </Button.Group>
        <CytoscapeComponent
          cy={(cy) => {
            this.myCyRef = cy;
          }}
          elements={this.elements}
          layout={layout}
          style={{ height: "300px" }}
          stylesheet={stylesheet}
        />
      </Fragment>
    );
  }
}
