import {
  nameProperty,
  selection,
  typeProperty,
} from "../consignaciones-ingreso-v2/Constants/constants";

export const getNameProperty = (_type: string) => {
  switch (_type) {
    case selection.node:
      return nameProperty.node_name;
    case selection.entity:
      return nameProperty.entity_name;
    case selection.installation:
      return nameProperty.installation_name;
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
  const type = values[getTypeProperty(_type)];
  const name = values[getNameProperty(_type)];
  return `${type} ${name}`;
};

export const getElementId = (element: any) => {
  return element?.document_id;
};
