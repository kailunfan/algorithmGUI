import { Menu, Layout } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { EditableTable } from "./Table";
import { CollapseTest } from "./Collapse";
import { Game } from "./Game";
const { Header, Content } = Layout;

export class Navibar extends React.Component {
  state = {
    current: "game"
  };

  cmps = [Game, CollapseTest, EditableTable];

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
          <Header style={{"background":"#fff"}}>
            <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
              style={{ lineHeight: '64px' }}
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
