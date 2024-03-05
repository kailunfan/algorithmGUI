import React from "react";
import { Button } from "antd";

class Board extends React.Component {
  renderSquare(i) {
    if (i !== "") {
      return (
        <button className="square" style={{ background: "#67C23A" }}></button>
      );
    }
    return <button className="square"></button>
  }

  renderRow(value) {
    const list = Array(8).fill("");
    if (value >= 0) {
      list[value] = "O";
    }
    return (
      <div className="board-row">{list.map((x) => this.renderSquare(x))}</div>
    );
  }

  render() {
    return <div>{this.props.result.map((x) => this.renderRow(x))}</div>;
  }
}

export class EightQueens extends React.Component {
  constructor(props) {
    super(props);
    this.nextResultFunc = () => {};
    this.nextResultPromise = undefined;
    this.nextStepFunc = () => {};
    this.nextStepPromise = undefined;
    this.result = Array(8).fill(-1);
    this.state = { result: this.result, resultList: [] };
  }

  nextResultPromiseFactory() {
    return new Promise((resolve) => (this.nextResultFunc = () => resolve()));
  }

  nextStepPromiseFactory() {
    return;
  }

  check(index, value) {
    for (let i = index + 1; i < this.result.length; i++) {
      this.result[i] = -1;
    }
    for (let i = index - 1; i >= 0; i--) {
      if (
        this.result[i] === value ||
        index - i === Math.abs(value - this.result[i])
      ) {
        return false;
      }
    }
    this.result[index] = value;
    return true;
  }

  async search(n) {
    for (let i = 0; i < this.result.length; i++) {
      if (this.check(n, i)) {
        this.nextStepPromise = this.nextStepPromiseFactory();
        this.setState({ result: this.result });
        await this.nextStepPromise;
        if (n === this.result.length - 1) {
          // 等待用户交互
          this.nextResultPromise = this.nextResultPromiseFactory();
          this.state.resultList.push(JSON.parse(JSON.stringify(this.result)));
          this.setState({ result: this.result });
          await this.nextResultPromise;
        }
        await this.search(n + 1);
      }
    }
  }

  nextResult() {
    this.nextStepFunc();
    this.nextStepPromiseFactory = () => {};
    this.nextResultPromiseFactory = () =>
      new Promise((resolve) => (this.nextResultFunc = () => resolve()));
    this.nextResultFunc();
  }

  nextStep() {
    this.nextResultFunc();
    this.nextResultPromiseFactory = () => {};
    this.nextStepPromiseFactory = () =>
      new Promise((resolve) => (this.nextStepFunc = () => resolve()));
    this.nextStepFunc();
  }

  componentDidMount() {
    this.search(0);
  }

  render() {
    return (
      <div>
        <Button.Group className="button-group">
          <Button type="primary" onClick={(e) => this.nextStep(e)}>
            NextStep
          </Button>
          <Button type="primary" onClick={(e) => this.nextResult(e)}>
            NextResult
          </Button>
        </Button.Group>
        <div className="game-board">
          <Board result={this.state.result} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "20em",
            flexWrap: "wrap",
            alignContent: "flex-start",
          }}
        >
          {this.state.resultList.map((x) => (
            <div style={{ margin: "0.2em 1em" }}>{x}</div>
          ))}
        </div>
      </div>
    );
  }
}
