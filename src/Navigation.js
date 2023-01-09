import "antd/dist/antd.css";
import React from "react";
import { Menu, Layout } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as Pages from "./Pages";

const { Header, Content } = Layout;

export class Navigation extends React.Component {
  state = {
    current: "eightqueens",
  };

  // cmps = Object.values(Pages);
  cmps = [
    { name: "EightQueens", value: Pages.EightQueens },
    { name: "BubbleSort", value: Pages.BubbleSort },
    { name: "SelectSort", value: Pages.SelectSort },
    { name: "InsertSort", value: Pages.InsertSort },
    { name: "QuickSort", value: Pages.QuickSort },
    { name: "MergeSortedList", value: Pages.MergeSortedList },
    { name: "Insort", value: Pages.Insort },
    { name: "LinkReverse", value: Pages.LinkReverse },
  ];

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };

  render() {
    const menuItems = this.cmps.map((cmp) => {
      const name = cmp.name.toLowerCase();
      return (
        <Menu.Item key={name}>
          <Link to={name}>{name}</Link>
        </Menu.Item>
      );
    });

    const routes = this.cmps.map((cmp) => {
      const name = cmp.name.toLowerCase();
      return <Route key={name} path={`/${name}`} component={cmp.value}></Route>;
    });

    return (
      <Layout>
        <Router>
          <Header style={{ background: "#fff" }}>
            <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
              style={{ lineHeight: "64px" }}
            >
              {menuItems}
            </Menu>
          </Header>
          <Content>
            <div style={{ padding: "20px" }}>{routes}</div>
          </Content>
        </Router>
      </Layout>
    );
  }
}
