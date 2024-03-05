import "antd/dist/reset.css";
import React from "react";
import * as Pages from "./Pages";
import { Tabs } from "antd";

export class Navigation extends React.Component {
  cmps = [
    { name: "LinkReverse", value: Pages.LinkReverse },
    { name: "BubbleSort", value: Pages.BubbleSort },
    { name: "SelectSort", value: Pages.SelectSort },
    { name: "InsertSort", value: Pages.InsertSort },
    { name: "QuickSort", value: Pages.QuickSort },
    { name: "EightQueens", value: Pages.EightQueens },
    // { name: "MergeSortedList", value: Pages.MergeSortedList },
    // { name: "Insort", value: Pages.Insort },
  ];
  render() {
    return (
      <div style={{ padding: "0 2em" }}>
        <Tabs
          defaultActiveKey="1"
          items={this.cmps.map((x) => ({
            label: x.name,
            key: x.name,
            children: <x.value />,
          }))}
        />
      </div>
    );
  }
}
