import React, {  } from "react";
import { bloque_leaf, bloque_root } from "../types";
import {
  Modal_add_block,
} from "./blocks/modal_add_block";
import { Modal_add_component } from "./components/modal_add_component";

export const modal_add_submenu_function = (
  object: Object,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  console.log("modal_add_submenu_function!", object["document"]);

  let document = object["document"];

  switch (document) {
    case "BloqueRoot":
      // pemmite añadir bloques leaf dentro de BloqueRoot
      return (
        <Modal_add_block
          object={object as bloque_root}
          handle_close={handle_close}
          handle_edited_root_block={handle_changes_in_root}
        />
      );
    case "BloqueLeaf":
      // pemmite añadir componentes root dentro de BloqueLeaf
      return (
        <Modal_add_component
          object={object as bloque_leaf}
          handle_close={handle_close}
          handle_edited_root_block={handle_changes_in_root}
        />
      );
  }

  return <></>;
};
