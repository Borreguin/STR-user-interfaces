export type bloque_leaf = {
  public_id: string;
  name: string;
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
