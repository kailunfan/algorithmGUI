import { Base } from './Base'

export class InsertSort extends Base {
  constructor(props) {
    super(props);
    this.list = [1, 4, 3, 5, 9, 8, 0, 6, 2, 7];
    this.state = { list: this.list, cur: [-1, -1] };
  }

  async start() {
    const len = this.list.length;
    for (let i = 1; i < len; i++) {
      for (let j = i; j >= 0; j--) {
        await this.stop({ cur: [j, j - 1] })
        if (this.list[j] < this.list[j - 1]) {
          [this.list[j], this.list[j - 1]] = [
            this.list[j - 1],
            this.list[j]
          ];
          await this.stop({ result: this.list });
        } else {
          break
        }
      }
    }
  }

  renderPointer() {
    const shell = Array(this.list.length).fill("");
    for (const cur of this.state.cur) {
      if (cur >= 0) {
        shell[cur] = "↑";
      }
    }
    return this.renderPointerRow(shell)
  }
}
