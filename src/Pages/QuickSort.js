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
    if(lc >= 0 && lc === rc){
      shell[lc] = '⇈'
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
      </div>
    );
  }
}

export class QuickSort extends React.Component {
  constructor(props) {
    super(props);
    this.nextStepFunc = () => {};
    this.nextStepPromise = undefined;
    this.result = [5, 4, 3, 1, 9, 8, 0, 6, 2, 7];
    this.state = {
      result: this.result,
      cur: [-1, -1],
      pivotIndex: -1,
      lc: -1,
      rc: -1
    };
  }

  nextStepPromiseFactory() {
    return new Promise(resolve => (this.nextStepFunc = () => resolve()));
  }

  async quickSort(li, startIndex, endIndex) {
    if (startIndex === undefined) {
      startIndex = 0;
    }
    if (endIndex === undefined) {
      endIndex = li.length - 1;
    }
    if (startIndex >= endIndex) {
      return;
    }
    await this.nextStepPromiseFactory();
    let pivot = li[startIndex];
    let lc = startIndex;
    let rc = endIndex;
    this.setState({ lc, rc, pivotIndex: startIndex });
    this.setState({});
    while (lc < rc) {
      while (lc < rc && li[rc] >= pivot) {
        await this.nextStepPromiseFactory();
        rc--;
        this.setState({ rc });
      }
      while (lc < rc && li[lc] <= pivot) {
        await this.nextStepPromiseFactory();
        lc++;
        this.setState({ lc });
      }
      if (lc < rc) {
        await this.nextStepPromiseFactory();
        [li[lc], li[rc]] = [li[rc], li[lc]];
        this.setState({ result: li });
      }
    }
    await this.nextStepPromiseFactory();
    [li[startIndex], li[lc]] = [li[lc], li[startIndex]];
    this.setState({ result: li });
    await this.quickSort(li, startIndex, lc - 1);
    await this.quickSort(li, lc + 1, endIndex);
  }

  async start() {
    this.quickSort(this.result);
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
            pivotIndex={this.state.pivotIndex}
          />
        </div>

        <div className="result-list"></div>
      </div>
    );
  }
}
