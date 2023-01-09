import React, { Fragment } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { Button } from "antd";

class LinkNode {
  constructor(id, label, visibility = true) {
    this.id = id;
    this.label = label;
    this.visibility = visibility;
    this.link = undefined;
  }
}

export class LinkReverse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      nodes: [
        new LinkNode("0", `null`, false),
        new LinkNode("a", `a`, true),
        new LinkNode("b", `b`, true),
        new LinkNode("c", `c`, true),
        new LinkNode("d", `d`, true),
        new LinkNode("e", `e`, true),
      ],
    };
  }

  drawLink(n1, n2) {
    this.state.elements.push({
      data: {
        id: `${n1.id}${n2.id}`,
        source: n1.id,
        target: n2.id,
      },
    });
  }

  drawNode(n) {
    this.state.elements.push({
      data: {
        id: n.id,
        label: n.label,
        visibility: n.visibility ? "visible" : "hidden",
      },
    });
  }

  *actions() {
    this.setState((state, props) => {
      state.nodes[0].visibility = "visible";
      return {
        nodes: state.nodes,
      };
    });
    yield;
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
          "font-size": 10,
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
        selector: ".highlighted",
        style: {
          "background-color": "#61bffc",
          "line-color": "#61bffc",
          "target-arrow-color": "#61bffc",
          "transition-property":
            "background-color, line-color, target-arrow-color",
          "transition-duration": "0.5s",
        },
      },
    ];

    for (const n of this.state.nodes) {
      this.drawNode(n);
    }
    const actions = this.actions();

    return (
      <Fragment>
        <Button.Group className="button-group">
          <Button type="primary" onClick={(e) => actions.next()}>
            Next
          </Button>
        </Button.Group>
        <CytoscapeComponent
          elements={this.state.elements}
          layout={layout}
          style={{ height: "600px" }}
          stylesheet={stylesheet}
        />
      </Fragment>
    );
  }
}
