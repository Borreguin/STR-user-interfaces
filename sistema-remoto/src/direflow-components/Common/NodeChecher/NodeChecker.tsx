import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import { v2Node } from "../V2GeneralTypes";
import { getDescriptionNode } from "../common-util";

type nodeCheckerProps = {
  nodes: any;
  onSelection: Function;
};
export const NodeChecker = (props: nodeCheckerProps) => {
  const { nodes, onSelection } = props;
  const [selectedNodes, setSelectedNodes] = React.useState({});

  useEffect(() => {
    let nodesArray = Object.values(selectedNodes);
    nodesArray = nodesArray.filter((node) => node !== undefined);
    onSelection(nodesArray);
  }, [selectedNodes]);

  const onSelectionChange = (node: v2Node) => {
    const isSelected = selectedNodes[node.document_id] !== undefined;
    if (isSelected) {
      setSelectedNodes({
        ...selectedNodes,
        [node.document_id]: undefined,
      });
    } else {
      setSelectedNodes({
        ...selectedNodes,
        [node.document_id]: node,
      });
    }
  };
  if (nodes === undefined || nodes?.length === 0) {
    return <></>;
  }

  return (
    <Form className="overflow-auto nodes-container">
      {nodes
        .sort(
          (a, b) =>
            parseFloat(getDescriptionNode(a)) -
            parseFloat(getDescriptionNode(b)),
        )
        .map((node) => (
          <Form.Check
            type="checkbox"
            label={getDescriptionNode(node)}
            name={getDescriptionNode(node)}
            //defaultValue={node}
            checked={selectedNodes[node.document_id] !== undefined}
            onChange={() => onSelectionChange(node)}
            id={node?.document_id}
            key={node?.document_id}
          />
        ))}
    </Form>
  );
};
