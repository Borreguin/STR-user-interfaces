import React, {  } from "react";
import { bloque_leaf, bloque_root} from "../types";
import { Modal_edit_root_block } from "./blocks/modal_edit_root_block";

export const modal_edit_menu_function = (
  object: Object,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  console.log("edit_menu_function!", object["document"]);

  let document = object["document"];

  switch (document) {
    case "BloqueRoot":
      return (
        <Modal_edit_root_block
          object={object as bloque_root}
          handle_close={handle_close}
          handle_edited_root_block={handle_changes_in_root}
        />
      );
  }

  return <></>;
};
