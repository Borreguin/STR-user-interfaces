import { nameProperty, selection, typeProperty } from "./constants";

export const getNameProperty = (_type: string) => {
  switch (_type) {
    case selection.node:
      return nameProperty.node_name;
    case selection.entity:
      return nameProperty.entity_name;
    case selection.installation:
      return nameProperty.installation_name;
    case selection.bahia:
      return nameProperty.bahia_name;
    case selection.nodes:
      return nameProperty.nodes_name;
  }
};

export const getTypeProperty = (_type: string) => {
  switch (_type) {
    case selection.node:
      return typeProperty.node_type;
    case selection.entity:
      return typeProperty.entity_type;
    case selection.installation:
      return typeProperty.installation_type;
  }
};

export const getDescription = (values: any, _type: string) => {
  if (!values) return "";
  if (values[getTypeProperty(_type)] && values[getNameProperty(_type)]) {
    const type = values[getTypeProperty(_type)];
    const name = values[getNameProperty(_type)];
    return `${type} ${name}`;
  } else {
    return _type;
  }
};

export const getElementId = (element: any) => {
  return element?.document_id;
};
