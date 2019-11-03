import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Navibar } from "./Navibar";

class Main extends React.Component {
  render() {
    return <Navibar />;
  }
}
ReactDOM.render(<Main />, document.getElementById("root"));
