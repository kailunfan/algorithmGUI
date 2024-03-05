import React, { Fragment, createRef } from "react";
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
  setVisible(v) {
    this.visibility = v;
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
  setCurFlag() {
    this.classes = [...this.classes, "cur-node"];
    this.tooltip = "Cur";
    return this;
  }
  setPrevFlag() {
    this.classes = [...this.classes, "prev-node"];
    this.tooltip = "Prev";
    return this;
  }
  setNextFlag() {
    this.classes = [...this.classes, "next-node"];
    this.tooltip = "Next";
    return this;
  }
  setAnsFlag() {
    this.classes = [...this.classes, "ans"];
    this.tooltip = "NewHead";
    return this;
  }
}

export default class LinkReverse extends React.Component {
  myCyRef = undefined;
  popperRef = createRef();
  poppers = [];
  constructor(props) {
    super(props);
    this.state = {
      nodes: this.initialNodes(),
    };
    this.run = this.actions();
  }

  initialNodes() {
    const n0 = new LinkNode("0", `null`, false);
    const na = new LinkNode("a", `a`, true);
    const nb = new LinkNode("b", `b`, true);
    const nc = new LinkNode("c", `c`, true);
    const nd = new LinkNode("d", `d`, true);
    const ne = new LinkNode("e", `e`, true);
    na.setNext(nb).setNext(nc).setNext(nd).setNext(ne);
    return [n0, na, nb, nc, nd, ne];
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
    document.querySelectorAll(".pop").forEach((x) => x.remove());
    for (const x of this.myCyRef.nodes()) {
      const p = x.popper({
        content: () => {
          let div = document.createElement("div");
          div.classList.add("pop");
          div.innerHTML = x.data().tooltip;
          this.popperRef.appendChild(div);
          return div;
        },
        popper: {
          removeOnDestroy: true,
        }, // my popper options here
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
    this.state.nodes[0].setVisible(true);
    this.refresh();
    yield;

    // set pre, cur
    let prv = this.state.nodes[0].setPrevFlag();
    this.refresh();
    yield;
    let cur = this.state.nodes[1].setCurFlag();
    this.refresh();

    while (cur) {
      yield;
      this.refresh();
      // move edge
      const nxt = cur.getNext();
      nxt && nxt.setNextFlag();
      yield;
      this.refresh();

      cur.setNext(prv);
      this.refresh();
      yield;
      // set prv cur
      prv.setNormal();
      prv = cur.setPrevFlag();
      this.refresh();
      yield;
      cur = nxt && nxt.setCurFlag();
      this.refresh();
    }
    // set ans
    yield;
    prv.setAnsFlag();
    this.refresh();
  }

  reset() {
    this.setState({ nodes: this.initialNodes() });
    this.run = this.actions();
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
        selector: ".next-node",
        style: {
          "background-color": "#E6A23C",
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
          <Button onClick={(e) => this.reset()}>Reset</Button>
          <Button type="primary" onClick={(e) => this.run.next()}>
            Next
          </Button>
        </Button.Group>
        <CytoscapeComponent
          cy={(cy) => {
            this.myCyRef = cy;
          }}
          zoomingEnabled={false}
          panningEnabled={false}
          elements={this.elements}
          layout={layout}
          style={{ height: "300px" }}
          stylesheet={stylesheet}
        />
        <div ref={(x) => (this.popperRef = x)}></div>
      </Fragment>
    );
  }
}
