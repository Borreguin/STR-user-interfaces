import React, {  } from "react";
import { bloque_leaf, leaf_component} from "../types";
import { Modal_indisponibilidad_component } from "./components/modal_indisponibilidad_componente";

// Permite desplegar los modales de eliminación a nivel de submenu:
export const modal_indisponibilidad_submenu_function = (
  object: Object,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  console.log("indisponibilidad_submenu_function!", object["document"], object);

  let document = object["document"];

  switch (document) {

    case "ComponenteLeaf":
      return (
        <Modal_indisponibilidad_component
          object={object as leaf_component}
          handle_close={handle_close}
          handle_edited_root_block={handle_changes_in_root}
        />
      );
  }

  return <></>;
};
