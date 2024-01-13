import React, { Component } from "react";
// import * as _ from "lodash";
//import { Accordion, Card, Button, Collapse, CardBody } from "react-bootstrap";
import { Node } from "../Types";
import SRCardV2 from "./SRCardV2";

type NodePanelProps = {
  nodes: Array<Node>;
};

class NodePanelV2 extends Component<NodePanelProps> {

  render() {
    return (
      <div>
        {this.props.nodes.length>0?
          this.props.nodes.map((node) => (
          <SRCardV2 node={node} key={node.id_node} />
          )) :
          <></>
        }
      </div>
    );
  }
}
export default NodePanelV2;