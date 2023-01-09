import React from "react";
import { Button } from "antd";

export class Base extends React.Component {
  constructor(props) {
    super(props);
    this.nextStepFunc = () => {};
    this.list = [];
  }

  nextStepPromiseFactory() {
    return new Promise((resolve) => (this.nextStepFunc = () => resolve()));
  }

  async stop(state) {
    await this.nextStepPromiseFactory();
    this.setState(state);
  }

  async start() {}

  nextStep() {
    this.nextStepFunc();
  }

  componentDidMount() {
    this.start();
  }

  actions() {
    return (
      <Button.Group className="button-group">
        <Button type="primary" onClick={(e) => this.nextStep(e)}>
          Next
        </Button>
      </Button.Group>
    );
  }

  content() {
    return (
      <>
        {this.renderList()}
        {this.renderPointer()}
      </>
    );
  }

  renderSquare(i) {
    return <button className="square">{i}</button>;
  }

  renderList() {
    return (
      <div className="board-row">
        {this.list.map((x) => this.renderSquare(x))}
      </div>
    );
  }

  renderPointer() {
    return <div></div>;
  }

  renderPointerRow(list) {
    return (
      <div className="board-row">{list.map((x) => this.renderSquare(x))}</div>
    );
  }

  render() {
    return (
      <div>
        {this.actions()}
        <div className="game-board">{this.content()}</div>
      </div>
    );
  }
}
