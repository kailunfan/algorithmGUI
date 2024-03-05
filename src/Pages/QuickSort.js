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

export class QuickSort extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      list: [5, 4, 3, 1, 9, 8, 0, 6, 2, 7],
      i: -1,
      j: -1,
      s: -1,
      toSwapIndex: [],
      toCompareIndex: [],
      done: false,
    };
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.process = this.start();
  }

  *start() {
    yield* this.quickSort(this.state.list, 0, this.state.list.length - 1);
    // done
    this.setState({
      done: true,
      i: -1,
      j: -1,
      s: -1,
      toSwapIndex: [],
      toCompareIndex: [],
    });
  }

  *quickSort(list, startIndex, endIndex) {
    if (startIndex >= endIndex) {
      return;
    }
    let pivot = list[startIndex];
    yield this.setState({ s: startIndex });
    let i = startIndex;
    let j = endIndex;
    yield this.setState({ i, j });

    while (i < j) {
      while (i < j && list[j] >= pivot) {
        // yield this.setState({ toCompareIndex: [j, startIndex] });
        j--;
        yield this.setState({ j });
      }
      while (i < j && list[i] <= pivot) {
        // yield this.setState({ toCompareIndex: [i, startIndex] });
        i++;
        yield this.setState({ i });
      }
      if (i < j) {
        yield this.setState({ toSwapIndex: [i, j] });
        [list[i], list[j]] = [list[j], list[i]];
        yield this.setState({ list });
      }
    }
    yield this.setState({ toSwapIndex: [i, startIndex] });
    [list[startIndex], list[i]] = [list[i], list[startIndex]];
    yield this.setState({ list });
    yield* this.quickSort(list, startIndex, i - 1);
    yield* this.quickSort(list, i + 1, endIndex);
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
          >
            {value}
          </Item>
          {ind === this.state.i ? (
            <div style={{ fontSize: "1.2em" }}>i</div>
          ) : undefined}
          {ind === this.state.j ? (
            <div style={{ fontSize: "1.2em" }}>j</div>
          ) : undefined}
          {ind === this.state.s ? (
            <div style={{ fontSize: "1.2em" }}>🚩</div>
          ) : undefined}
        </div>
      );
    }

    return (
      <>
        <div>
          <Button.Group className="button-group">
            <Button onClick={(e) => this.reset()}>Reset</Button>
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
