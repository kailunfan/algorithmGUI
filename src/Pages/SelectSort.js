import React from "react";
import { Button } from "antd";

class Board extends React.Component {
  renderSquare(i) {
    return <button className="square">{i}</button>;
  }

  renderCur() {
    const shell = Array(this.props.result.length).fill("");
    for (const cur of this.props.cur) {
      if(cur>=0){
        shell[cur] = "↑";
      }
    }
    return (
      <div className="board-row">
        {shell.map(x => this.renderSquare(x))}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.props.result.map(x => this.renderSquare(x))}
        </div>
        {this.renderCur()}
      </div>
    );
  }
}

export class SelectSort extends React.Component {
  constructor(props) {
    super(props);
    this.nextStepFunc = () => {};
    this.nextStepPromise = undefined;
    this.result = [1, 4, 3, 5, 9, 8, 0, 6, 2, 7];
    this.state = { result: this.result, cur:[-1,-1] };
  }

  nextStepPromiseFactory() {
    return new Promise(resolve => (this.nextStepFunc = () => resolve()));
  }

  async start() {
    const len = this.result.length;
    for (let i = 0; i < len - 1; i++) {
      for (let j = i+1; j < len; j++) {
        await this.nextStepPromiseFactory();
        this.setState({cur:[i,j]})
        if (this.result[i] > this.result[j]) {
          await this.nextStepPromiseFactory();
          [this.result[i], this.result[j]] = [
            this.result[j],
            this.result[i]
          ];
          this.setState({ result: this.result });
        }
      }
    }
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
          <Board result={this.state.result} cur={this.state.cur} />
        </div>

        <div className="result-list"></div>
      </div>
    );
  }
}