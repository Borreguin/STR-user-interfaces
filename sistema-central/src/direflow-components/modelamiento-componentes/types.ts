

export type bloque_leaf = {
  parent_id: string;
  public_id: string;
  name: string;
  document: string;
  calculation_type: string;
  comp_root: comp_root | null;
  position_x_y: Array<number>;
  topology?: Object;
};

export type bloque_root = {
  public_id: string;
  document: string;
  name: string;
  leafs: Array<bloque_leaf>;
  position_x_y: Array<number>;
  topology?: Object;
};

export type root_block_form = {
  name: string;
};

export type leaf_block_form = {
  name: string;
};

export type root_component_form = {
  name: string;
};

export type menu = {
  level: number,
  public_id: string,
  parent_id?: string,
  name: string,
  document: string,
  submenu: Array<submenu>,
  object: Object
}

export type submenu = {
  level: number,
  public_id: string,
  parent_id?: string,
  name: string,
  document: string,
  object: Object
}


export type properties = {
  parent_id?: string,
  public_id: string,
  document: string,
  name: string,
  position_x_y: Array<Number>,
  block_leafs?: Array<block_leaf>,
  operations: Array<operation>
  topology: Object,
}

export type source = {
  type: string,
  parameters: Object
}

export type leaf_component = {
  parent_id: string,
  public_id: string,
  calculation_type: string,
  document: string,
  name: string,
  position_x_y: Array<Number>,
  topology: Object,
  comp_root: comp_root | null,
  sources: Array<source>
}

export type comp_root = {
  bloque: string,
  document: string,
  leafs: Array<leaf_component>,
  name: string,
  position_x_y: Array<Number>,
  public_id: string,
  parent_id: string,
  topology?: Object
}

export type block_leaf = {
  parent_id: string,
  public_id: string,
  calculation_type: string,
  document: string,
  name: string,
  position_x_y: Array<Number>,
  topology?: Object, 
  comp_root: comp_root
}

export type operation = {
  public_id: string,
  name: string,
  type: string,
  operator_ids: Array<string>,
  position_x_y: Array<Number>,
  operation: operation,
}

export type block = {
  name: string,
  parent_id: string,
  public_id: string,
  object?: properties
}

export type selectedBlock = {
  name: string,
  parent_id: string,
  public_id: string,
  object?: block_leaf
}

