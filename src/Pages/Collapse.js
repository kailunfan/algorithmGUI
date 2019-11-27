import { Input } from "antd";
import "antd/dist/antd.css";
import React from "react";

import { Collapse } from "antd";

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

export class CollapseTest extends React.Component {
  render() {
    return (
      <Collapse defaultActiveKey={["1"]} onChange={callback}>
        <Panel header={<Input onClick={e => e.stopPropagation()}/>} key="1">
          <p>{text}</p>
        </Panel>
        <Panel header="This is panel header 2" key="2">
          <p>{text}</p>
        </Panel>
        <Panel header="This is panel header 3" key="3" disabled>
          <p>{text}</p>
        </Panel>
      </Collapse>
    );
  }
}
