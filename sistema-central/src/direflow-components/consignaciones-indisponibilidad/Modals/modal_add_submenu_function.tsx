import React from "react";
import { bloque_root, leaf_component } from "../types";
import { Modal_add_subcomponent } from "./subcomponents/modal_add_subcomponent";

// Permite desplegar los modales de edición a nivel de submenu:
export const modal_add_submenu_function = (
  object: Object,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  console.log("modal_add_submenu_function!", object["document"]);

  let document = object["document"];
  console.log(object);
  switch (document) {

    case "ComponenteLeaf":
      // pemmite añadir componentes root dentro de BloqueLeaf
      return (
        <Modal_add_subcomponent
          object={object as leaf_component}
          handle_close={handle_close}
          handle_edited_root_block={handle_changes_in_root}
        />
      );
    
  }

  return <></>;
};
