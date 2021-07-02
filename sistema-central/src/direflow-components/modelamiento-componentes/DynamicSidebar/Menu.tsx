import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faPen,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Card, ListGroup } from "react-bootstrap";
import { bloque_leaf, menu, submenu } from "../types";

interface pros {
  menu: menu; // menu structure
  // Hoocks:
  handle_edited_menu?: Function;
  handle_click_menu_button: Function;
  // Modals:
  edit_menu_modal?: Function;
  add_submenu_modal?: Function;
  edit_submenu_modal?: Function;
  delete_submenu_modal?: Function;
  // to keep track of changes
  modal_show?: boolean;
  selected_menu_id: string | undefined;
  // selected_block: block | undefined;
}

interface state {
  // muestra el modal de acuerdo a lo seleccionado
  show_modal_id: string | undefined;
  // selected_static_menu: static_menu | undefined;
  // selected_block: block | undefined;
  selected_object: Object;
}

class Menu extends Component<pros, state> {
  constructor(props) {
    super(props);
    this.state = {
      show_modal_id: undefined,
      selected_object: {},
      // selected_static_menu: this.props.selected_static_menu,
      // selected_block: this.props.selected_static_menu,
    };
  }

  /*static getDerivedStateFromProps(state) {
    // Permite manejar el cierre y apertura de la modal
    let show = state.show;
    return { show: show };
  }*/

  on_click_show = (modal_id: string, object: Object) => {
    // permite renderizar el componente modal de acuerdo a lo seleccionado:
    this.setState({
      selected_object: object,
      show_modal_id: modal_id,
    });
  };

  check_if_is_active = (current_selection_id) => {
    // let to highlight the selected buton in the menu
    if (current_selection_id === this.props.selected_menu_id) {
      return "active-menu";
    }
    return "";
  };

  // static_menu: la estructura estática de menu
  // block: bloque seleccionado
  on_click_menu_button = (e, menu: menu | submenu) => {
    console.log("on_click_menu_button", menu);
    if (e.target.tagName !== "DIV" && e.target.tagName !== "SPAN") return;
    let classname = "" + e.target.className;
    if (classname.includes("card-header") && menu.level > 0) {
      return;
    }
    let new_menu = this.modify_menu(menu);
    let selected_menu_id = menu.public_id;
    this.props.handle_click_menu_button(new_menu, selected_menu_id);
  };

  shouldBeInMenu = (block_object) => {
    console.log("shouldBeInMenu", block_object);
    let isBloqueLeaf = block_object.document === "BloqueLeaf";
    let isComponenteLeaf = block_object.document === "ComponenteLeaf";
    let notParallelOperation = block_object.calculation_type !== "PARALELO";
    let notMixOperation = block_object.calculation_type !== "MIXTO";
    return (
      (isBloqueLeaf || isComponenteLeaf) &&
      notParallelOperation &&
      notMixOperation
    );
  };

  _handle_close = () => {
    this.setState({ show_modal_id: undefined });
  };

  // TO CHANGE IF NEEDED:
  modify_menu = (selected_menu: menu | submenu) => {
    let document = selected_menu.document;
    console.log(document, selected_menu);
    switch (document) {
      case "BloqueRoot":
        return selected_menu;
      case "BloqueLeaf":
        let bloqueleaf = selected_menu["object"] as bloque_leaf;
        let sub_menu = [] as Array<submenu>;
        if (bloqueleaf.comp_root !== null) {
          // using a root component:
          console.log("continue", bloqueleaf.comp_root);
          for (const leaf of bloqueleaf.comp_root.leafs) {
            let sub = {
              document: leaf.document,
              level: selected_menu.level + 1,
              name: leaf.name,
              parent_id: leaf.parent_id,
              public_id: leaf.public_id,
              object: leaf,
            } as submenu;
            sub_menu.push(sub);
          }
        }
        let new_menu = {
          level: selected_menu.level + 1,
          document: document,
          name: selected_menu.name,
          public_id: selected_menu.public_id,
          parent_id: selected_menu.parent_id,
          object: selected_menu.object,
          submenu: sub_menu,
        } as menu;
        return new_menu;
    }
  };

  // show Modal according with the menu
  show_modal = () => {
    // Llamando modal para añadir elementos internos
    switch (this.state.show_modal_id) {
      case "add_submenu_modal":
        return this.props.add_submenu_modal(
          this.state.selected_object,
          this._handle_close,
          this.props.handle_edited_menu
        );
      case "edit_submenu_modal":
        return this.props.edit_submenu_modal(
          this.state.selected_object,
          this._handle_close,
          this.props.handle_edited_menu
        );
      case "delete_submenu_modal":
        return this.props.delete_submenu_modal(
          this.state.selected_object,
          this._handle_close,
          this.props.handle_edited_menu
        );
      case "edit_menu_modal":
        return this.props.edit_menu_modal(
          this.state.selected_object,
          this._handle_close,
          this.props.handle_edited_menu
        );
    }

    return <></>;
  };

  // menu extendido
  toggled_menu = (menu: menu) => {
    // si el submenú no esta definido totalmente, entonces no se presenta
    if (menu === undefined) {
      return <></>;
    }
    // caso contrario se presenta el menú
    return (
      <ul>
        {/*<div className="header-menu">
          <span>{menu.name}</span>
        </div> */}
        <div className="sidebar-submenu ">
          {
            /* MENU PRINCIPAL */
            <Card className="container_menu">
              <Card.Header
                key={menu.public_id}
                className={
                  "static_menu " + this.check_if_is_active(menu.public_id)
                }
                onClick={(e) => this.on_click_menu_button(e, menu)}
              >
                <span>
                  <FontAwesomeIcon
                    icon={faCog}
                    style={{ marginRight: "9px" }}
                  />
                </span>
                <span className="menu-text">{menu.name}</span>

                <span className="right-button-section">
                  {/* Botón para añadir*/}
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    size="1x"
                    className="add_button"
                    onClick={() =>
                      this.on_click_show("add_submenu_modal", menu.object)
                    }
                  />
                  {/* Botón de edición*/}
                  <FontAwesomeIcon
                    icon={faPen}
                    size="1x"
                    className="edit_block_button"
                    onClick={() =>
                      this.on_click_show("edit_menu_modal", menu.object)
                    }
                  />
                </span>
              </Card.Header>

              {/* MENU SECUNDARIO */}

              {this.props.menu.submenu.length === 0 ? (
                <></>
              ) : (
                <Card.Body className="submenu-container">
                  <ListGroup variant="flush">
                    {/* Creando los sub-menus */}
                    {this.props.menu.submenu.map((sub_menu) => {
                      if (this.shouldBeInMenu(sub_menu.object)) {
                        return (
                          <ListGroup.Item
                            key={sub_menu.public_id}
                            className={`submenu-item ${this.check_if_is_active(
                              sub_menu.public_id
                            )}`}
                            onClick={(e) =>
                              this.on_click_menu_button(e, sub_menu)
                            }
                          >
                            <span style={{ marginRight: "15px" }}>
                              &middot;
                            </span>
                            <span>
                              {sub_menu.name.length > 30
                                ? sub_menu.name.substring(0, 20) +
                                  "..." +
                                  sub_menu.name.substring(
                                    sub_menu.name.length - 5,
                                    sub_menu.name.length
                                  )
                                : sub_menu.name}
                            </span>
                            <span className="right-button-section">
                              {/* Open edit modal */}
                              <FontAwesomeIcon
                                icon={faPen}
                                size="1x"
                                className="edit_button"
                                onClick={() =>
                                  this.on_click_show(
                                    "edit_submenu_modal",
                                    sub_menu.object
                                  )
                                }
                              />
                              {/* Open delete modal */}
                              <FontAwesomeIcon
                                icon={faTrash}
                                size="1x"
                                className="delete_button"
                                onClick={() =>
                                  this.on_click_show(
                                    "delete_submenu_modal",
                                    sub_menu.object
                                  )
                                }
                              />
                            </span>
                          </ListGroup.Item>
                        );
                      }
                    })}
                  </ListGroup>
                </Card.Body>
              )}
            </Card>
          }
        </div>
        {this.show_modal()}
      </ul>
    );
  };

  render() {
    const { menu } = this.props;
    return this.toggled_menu(menu);
  }
}
export default Menu;
