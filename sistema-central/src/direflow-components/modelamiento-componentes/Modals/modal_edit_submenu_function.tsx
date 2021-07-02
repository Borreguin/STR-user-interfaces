import React, {  } from "react";
import { bloque_leaf, bloque_root, leaf_component} from "../types";
import { Modal_edit_block } from "./blocks/modal_edit_block";
import { Modal_edit_component } from "./components/modal_edit_component";

export const modal_edit_submenu_function = (
  object: Object,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  console.log("edit_submenu_function!", object["document"], object);

  let document = object["document"];

  switch (document) {
    case "BloqueLeaf":
      return (
        <Modal_edit_block
          object={object as bloque_leaf}
          handle_close={handle_close}
          handle_edited_root_block={handle_changes_in_root}
        />
      );
    case "ComponenteLeaf":
      return (
        <Modal_edit_component
        object={object as leaf_component}
        handle_close={handle_close}
        handle_edited_root_block={handle_changes_in_root}
        />
      )
  }

  return <></>;
};
