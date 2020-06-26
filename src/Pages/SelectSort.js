import { Base } from "./Base";

export class SelectSort extends Base {
  constructor(props) {
    super(props);
    this.list = [1, 4, 3, 5, 9, 8, 0, 6, 2, 7];
    this.state = { list: this.list, cur: [-1, -1] };
  }

  async start() {
    const len = this.list.length;
    for (let i = 0; i < len - 1; i++) {
      for (let j = i + 1; j < len; j++) {
        await this.stop({ cur: [i, j] })
        if (this.list[i] > this.list[j]) {
          [this.list[i], this.list[j]] = [
            this.list[j],
            this.list[i]
          ];
          await this.stop({ result: this.list });
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
