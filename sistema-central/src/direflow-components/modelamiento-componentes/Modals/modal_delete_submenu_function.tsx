import React, {  } from "react";
import { bloque_leaf, leaf_component} from "../types";
import { Modal_delete_block } from "./blocks/modal_delete_block";
import { Modal_delete_component } from "./components/modal_delete_componente";

// Permite desplegar los modales de eliminación a nivel de submenu:
export const modal_delete_submenu_function = (
  object: Object,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  console.log("delete_submenu_function!", object["document"]);

  let document = object["document"];

  switch (document) {
    case "BloqueLeaf":
      return (
        <Modal_delete_block
          object={object as bloque_leaf}
          handle_close={handle_close}
          handle_edited_root_block={handle_changes_in_root}
        />
      );
    case "ComponenteLeaf":
      return (
        <Modal_delete_component
          object={object as leaf_component}
          handle_close={handle_close}
          handle_edited_root_block={handle_changes_in_root}
        />
      );
  }

  return <></>;
};
