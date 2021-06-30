export type bloque_leaf = {
  parent_id: string;
  public_id: string;
  name: string;
  document: string;
  calculation_type: string;
  position_x_y: Array<number>;
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
  public_id: string,
  parent_id?: string,
  name: string,
  document: string,
  object: Object
}
