import React from "react";
import { Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

export const Item = ({ children, toCompare, toSwap, sorted }) => {
  let color = "inherit";
  if (toCompare) {
    color = "#67C23A";
  }
  if (toSwap) {
    color = "#F56C6C";
  }
  const background = sorted ? "#C0C4CC" : "inherit";

  return (
    <div className="square" style={{ float: "none", color, background }}>
      {children}
    </div>
  );
};

export class SelectSort extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      list: [3, 2, 1, 4, 6, 5],
      i: -1,
      j: -1,
      toSwapIndex: [],
      toCompareIndex: [],
      done: false,
    };
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.process = this.start();
  }

  *start() {
    const sl = this.state.list;
    const len = sl.length;
    for (let i = 0; i < len - 1; i++) {
      for (let j = i + 1; j < len; j++) {
        yield this.setState({ i: i, j: j });
        yield this.setState({ toCompareIndex: [i, j] });
        if (sl[i] > sl[j]) {
          yield this.setState({ toSwapIndex: [i, j] });
          [sl[i], sl[j]] = [sl[j], sl[i]];
          yield this.setState({ list: sl, toSwapIndex: [] });
        }
      }
    }
    yield;
    // done
    this.setState({
      done: true,
      i: -1,
      j: -1,
      toSwapIndex: [],
      toCompareIndex: [],
    });
  }

  reset() {
    this.setState(JSON.parse(JSON.stringify(this.initialState)));
    this.process = this.start();
  }

  render() {
    const items = [];
    for (const [i, value] of Object.entries(this.state.list)) {
      const ind = parseInt(i);
      items.push(
        <div
          key={ind}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Item
            toCompare={this.state.toCompareIndex.includes(ind)}
            toSwap={this.state.toSwapIndex.includes(ind)}
            sorted={ind < this.state.i}
          >
            {value}
          </Item>
          {ind === this.state.i ? (
            <div style={{ fontSize: "1.2em" }}>i</div>
          ) : undefined}
          {ind === this.state.j ? (
            <div style={{ fontSize: "1.2em" }}>j</div>
          ) : undefined}
        </div>
      );
    }

    return (
      <>
        <div>
          <Button.Group className="button-group">
            <Button type="primary" onClick={(e) => this.reset()}>
              Reset
            </Button>
            <Button
              type="primary"
              disabled={this.state.done}
              onClick={(e) => this.process.next()}
            >
              Next
            </Button>
          </Button.Group>
          {this.state.done ? (
            <CheckCircleOutlined
              type="success"
              style={{ color: "#67C23A", fontSize: "1.2em", marginLeft: "1em" }}
            />
          ) : undefined}
        </div>
        <div style={{ display: "flex" }}>{items}</div>
      </>
    );
  }
}
