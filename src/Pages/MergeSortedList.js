import React from "react";
import { Base } from './Base'

export class MergeSortedList extends Base {
  constructor(props) {
    super(props);
    this.list = [0, 1, 2, 6, 7, 8, 12, 13, 14, 3, 4, 5, 9, 10, 11, 15, 16, 17, 18];
    this.state = {
      list: this.list,
      bp: -1,
      lc: -1,
      rc: -1,
      swaplc: -1,
      swaprc: -1
    };
  }

  async mergeTwoStepList(li, start, bp, end) {
    this.setState({ bp });
    if (bp >= end) {
      return;
    }
    let [i, j] = [start, bp];
    await this.stop({ lc: i, rc: j });
    while (li[i] < li[j]) {
      i++;
      await this.stop({ lc: i });
      if (i >= j) {
        return;
      }
    }
    let tmp = 0;
    while (i < j && li[j] < li[i]) {
      j++;
      await this.stop({ rc: j });
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
      await this.stop({ swaplc: i, swaprc: j });
      [li[i], li[j]] = [li[j], li[i]];
      await this.stop({ result: this.list });
      i++;
      j--;
    }
  }

  async start() {
    this.mergeTwoStepList(this.list, 0, 9, this.list.length - 1);
  }

  renderCur() {
    const lc = this.state.lc;
    const rc = this.state.rc;
    const shell = Array(this.list.length).fill("");
    if (lc >= 0) {
      shell[lc] = "↑";
    }
    if (rc >= 0) {
      shell[rc] = "↑";
    }
    return this.renderPointerRow(shell);
  }

  renderSwapCur() {
    const lc = this.state.swaplc;
    const rc = this.state.swaprc;
    const shell = Array(this.list.length).fill("");
    if (lc >= 0) {
      shell[lc] = "↑";
    }
    if (rc >= 0) {
      shell[rc] = "↑";
    }
    if (lc >= 0 && lc === rc) {
      shell[lc] = "⇈";
    }
    return this.renderPointerRow(shell);
  }

  renderPivot() {
    const shell = Array(this.list.length).fill("");
    const pivot = this.state.bp;
    if (pivot >= 0) {
      shell[pivot] = "★";
    }
    return this.renderPointerRow(shell);
  }

  renderPointer() {
    return <>
      {this.renderCur()}
      {this.renderPivot()}
      {this.renderSwapCur()}
    </>
  }
}
