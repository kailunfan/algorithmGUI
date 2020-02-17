import React from "react";
import { Button } from "antd";

class Board extends React.Component {
  renderSquare(i) {
    return <button className="square">{i}</button>;
  }

  renderCur() {
    const lc = this.props.lc;
    const rc = this.props.rc;
    const shell = Array(this.props.result.length).fill("");
    if (lc >= 0) {
      shell[lc] = "↑";
    }
    if (rc >= 0) {
      shell[rc] = "↑";
    }
    return (
      <div className="board-row">{shell.map(x => this.renderSquare(x))}</div>
    );
  }

  renderSwapCur() {
    const lc = this.props.swaplc;
    const rc = this.props.swaprc;
    const shell = Array(this.props.result.length).fill("");
    if (lc >= 0) {
      shell[lc] = "↑";
    }
    if (rc >= 0) {
      shell[rc] = "↑";
    }
    if (lc >= 0 && lc === rc) {
      shell[lc] = "⇈";
    }
    return (
      <div className="board-row">{shell.map(x => this.renderSquare(x))}</div>
    );
  }

  renderPivot() {
    const shell = Array(this.props.result.length).fill("");
    const pivot = this.props.pivotIndex;
    if (pivot >= 0) {
      shell[pivot] = "★";
    }
    return (
      <div className="board-row">{shell.map(x => this.renderSquare(x))}</div>
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.props.result.map(x => this.renderSquare(x))}
        </div>
        {this.renderCur()}
        {this.renderPivot()}
        {this.renderSwapCur()}
      </div>
    );
  }
}

export class MergeList extends React.Component {
  constructor(props) {
    super(props);
    this.nextStepFunc = () => {};
    this.nextStepPromise = undefined;
    this.result = [
      0,
      1,
      2,
      6,
      7,
      8,
      12,
      13,
      14,
      3,
      4,
      5,
      9,
      10,
      11,
      15,
      16,
      17,
      18
    ];
    this.state = {
      result: this.result,
      bp: -1,
      lc: -1,
      rc: -1,
      swaplc: -1,
      swaprc: -1
    };
  }

  nextStepPromiseFactory() {
    return new Promise(resolve => (this.nextStepFunc = () => resolve()));
  }

  async mergeTwoStepList(li, start, bp, end) {
    this.setState({ bp });
    if (bp >= end) {
      return;
    }
    await this.nextStepPromiseFactory();
    let [i, j] = [start, bp];
    this.setState({ lc: i, rc: j });
    while (li[i] < li[j]) {
      await this.nextStepPromiseFactory();
      i++;
      this.setState({ lc: i });
      if (i >= j) {
        return;
      }
    }
    let tmp = 0;
    while (i < j && li[j] < li[i]) {
      await this.nextStepPromiseFactory();
      j++;
      this.setState({ rc: j });
      tmp++;
    }
    await this.swapTwoStep(li, i, bp, j - 1);
    await this.mergeTwoStepList(li, start, bp + tmp, end);
  }

  async swapTwoStep(li, start, bp, end) {
    await this.reverse(li, start, bp - 1);
    await this.reverse(li, bp, end);
    await this.reverse(li, start, end);
  }

  async reverse(li, start, end) {
    let [i, j] = [start, end];
    while (i <= j) {
      await this.nextStepPromiseFactory();
      this.setState({ swaplc: i, swaprc: j });
      await this.nextStepPromiseFactory();
      [li[i], li[j]] = [li[j], li[i]];
      this.setState({ result: this.result });
      i++;
      j--;
    }
  }
  async start() {
    this.mergeTwoStepList(this.result, 0, 9, this.result.length - 1);
  }

  nextStep() {
    this.nextStepFunc();
  }

  componentDidMount() {
    this.start();
  }

  render() {
    return (
      <div>
        <Button.Group className="button-group">
          <Button type="primary" onClick={e => this.nextStep(e)}>
            Next
          </Button>
        </Button.Group>
        <div className="game-board">
          <Board
            result={this.state.result}
            lc={this.state.lc}
            rc={this.state.rc}
            pivotIndex={this.state.bp}
            swaplc={this.state.swaplc}
            swaprc={this.state.swaprc}
          />
        </div>

        <div className="result-list"></div>
      </div>
    );
  }
}
