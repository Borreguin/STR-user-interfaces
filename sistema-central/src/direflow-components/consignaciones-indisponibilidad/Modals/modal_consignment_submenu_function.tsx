import React, {  } from "react";
import { leaf_component} from "../types";
import { Modal_consignment_componente } from "./components/modal_consigment_componente";

export const modal_consignment_submenu_function = (
  object: Object,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  console.log("add_consignment_submenu_function!", object["document"], object);

  let document = object["document"];

  switch (document) {

    case "ComponenteLeaf":
      return (
        <Modal_consignment_componente
        object={object as leaf_component}
        handle_close={handle_close}
        handle_edited_root_block={handle_changes_in_root}
        />
      )
  }

  return <></>;
};
