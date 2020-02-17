import "antd/dist/antd.css";
import React from "react";
import { Menu, Layout } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as Pages from "./Pages";

const { Header, Content } = Layout;

export class Navigation extends React.Component {
  state = {
    current: "eightqueens"
  };

  cmps = Object.values(Pages);

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  render() {
    const menuItems = this.cmps.map(cmp => {
      const name = cmp.name.toLowerCase();
      return (
        <Menu.Item key={name}>
          <Link to={name}>{name}</Link>
        </Menu.Item>
      );
    });
    
    const routes = this.cmps.map(cmp => {
      const name = cmp.name.toLowerCase();
      return <Route path={`/${name}`} component={cmp}></Route>;
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
