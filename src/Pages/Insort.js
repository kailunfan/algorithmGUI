import React, { Fragment } from "react";
import { Base } from './Base'

export class Insort extends Base {
  constructor(props) {
    super(props);
    this.list = [1, 2, 2, 3, 4, 5, 6, 7, 8, 9];
    this.target = 2;
    this.state = { lc: 0, hc: 0, message: '' };
  }

  async start() {
    let lc = 0
    let hc = this.list.length;
    this.setState({ lc, hc })

    while (lc < hc) {
      this.setState({ message: '' })
      const mid = parseInt((lc + hc) / 2)
      await this.stop({ mc: mid })
      if (this.list[mid] < this.target) {
        await this.stop({ message: 'nums[M]<target: set L=M+1' })
        lc = mid + 1
        await this.stop({ lc })
      } else {
        await this.stop({ message: 'nums[M]>=target:set H=M' })
        hc = mid
        await this.stop({ hc })
      }
    }
  }

  renderPointer() {
    const shell = Array(this.list.length + 1).fill("");
    const midShell = Array(this.list.length + 1).fill("");
    shell[this.state.lc] += 'L'
    shell[this.state.hc] += 'H'
    if (this.state.mc !== undefined) {
      midShell[this.state.mc] += 'M'
    }
    return (
      <div>
        {this.renderPointerRow(shell)}
        {this.renderPointerRow(midShell)}
      </div>
    );
  }

  content() {
    return (
      <Fragment>
        <h2>Target:2</h2>
        <h3 style={{ height: "40px" }}>{this.state.message}</h3>
        {this.renderList()}
        {this.renderPointer()}
      </Fragment>
    )
  }
}
