import React, { Fragment } from "react";
import { Base } from './Base';

export class QuickSort extends Base {
  constructor(props) {
    super(props);
    this.list = [5, 4, 3, 1, 9, 8, 0, 6, 2, 7];
    this.state = {
      list: this.list,
      cur: [-1, -1],
      pivotIndex: -1,
      lc: -1,
      rc: -1
    };
  }

  async quickSort(list, startIndex, endIndex) {
    if (startIndex === undefined) {
      startIndex = 0;
    }
    if (endIndex === undefined) {
      endIndex = list.length - 1;
    }
    if (startIndex >= endIndex) {
      return;
    }
    await this.stop();
    let pivot = list[startIndex];
    let lc = startIndex;
    let rc = endIndex;
    this.setState({ lc, rc, pivotIndex: startIndex });
    while (lc < rc) {
      while (lc < rc && list[rc] >= pivot) {
        rc--;
        await this.stop({ rc });
      }
      while (lc < rc && list[lc] <= pivot) {
        lc++;
        await this.stop({ lc });
      }
      if (lc < rc) {
        [list[lc], list[rc]] = [list[rc], list[lc]];
        await this.stop({ list });
      }
    }
    [list[startIndex], list[lc]] = [list[lc], list[startIndex]];
    await this.stop({ list });
    await this.quickSort(list, startIndex, lc - 1);
    await this.quickSort(list, lc + 1, endIndex);
  }

  async start() {
    this.quickSort(this.list);
  }

  renderPointer() {
    const lc = this.state.lc;
    const rc = this.state.rc;
    const shell = Array(this.list.length).fill("");
    if (lc >= 0) {
      shell[lc] = "↑";
    }
    if (rc >= 0) {
      shell[rc] = "↑";
    }
    if (lc >= 0 && lc === rc) {
      shell[lc] = '⇈'
    }
    const shell1 = Array(this.list.length).fill("");
    const pivot = this.state.pivotIndex;
    if (pivot >= 0) {
      shell1[pivot] = "★";
    }
    return <Fragment>
      {this.renderPointerRow(shell)}
      {this.renderPointerRow(shell1)}
    </Fragment>
  }
}
