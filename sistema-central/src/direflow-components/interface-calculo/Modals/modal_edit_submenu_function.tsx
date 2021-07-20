import React, {  } from "react";
import { leaf_component} from "../types";
import { Modal_add_consignment } from "./components/modal_add_consignment";

export const modal_add_consignment_submenu_function = (
  object: Object,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  console.log("edit_submenu_function!", object["document"], object);

  let document = object["document"];

  switch (document) {

    case "ComponenteLeaf":
      return (
        <Modal_add_consignment
        object={object as leaf_component}
        handle_close={handle_close}
        handle_edited_root_block={handle_changes_in_root}
        />
      )
  }

  return <></>;
};
