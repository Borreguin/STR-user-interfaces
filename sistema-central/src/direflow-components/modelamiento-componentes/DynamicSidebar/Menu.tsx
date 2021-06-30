import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faPen,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Card, ListGroup } from "react-bootstrap";
import { menu } from "../types";

interface pros {
  menu: menu; // menu structure
  // Hoocks:
  handle_edited_menu?: Function;
  handle_click_menu_button?: Function;
  // Modals:
  edit_menu_modal?: Function;
  add_submenu_modal?: Function;
  edit_submenu_modal?: Function;
  delete_submenu_modal?: Function;
  // to keep track of changes
  modal_show?: boolean;
  // selected_static_menu: static_menu | undefined;
  // selected_block: block | undefined;
}

interface state {
  // muestra el modal de acuerdo a lo seleccionado
  show_modal_id: string | undefined;
  // selected_static_menu: static_menu | undefined;
  // selected_block: block | undefined;
  selected_object: Object;
  current_selected_id: string | undefined;
}

class Menu extends Component<pros, state> {
  constructor(props) {
    super(props);
    this.state = {
      show_modal_id: undefined,
      current_selected_id: undefined,
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
    if (this.state.current_selected_id === undefined) {
      return "";
    }
    if (current_selection_id === this.props.menu.public_id) {
      return "active-menu";
    }
    for (const sub of this.props.menu.submenu) {
      if (current_selection_id === sub.public_id) {
        return "active-menu";
      }
    }
    return "";
  };

  // static_menu: la estructura estática de menu
  // block: bloque seleccionado
  on_click_menu_button = (e, selected_id) => {
    if (e.target.tagName !== "DIV" && e.target.tagName !== "SPAN") return;
    if (this.props.handle_click_menu_button !== undefined) {
      // console.log("check this out", static_menu, block);
      // this.props.handle_click_menu_button(static_menu, block);
    }
    this.setState({ current_selected_id: selected_id });
  };

  shouldBeInMenu = (block_object) => {
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
        )
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
                onClick={(e) => this.on_click_menu_button(e, menu.public_id)}
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
                              this.on_click_menu_button(e, sub_menu.public_id)
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
        {
          // Llamando modal para editar cabecera del menú
          /* this.state.show["edit_menu_modal"] !== undefined &&
          this.state.show["edit_menu_modal"] === true &&
          this.props.edit_menu_modal !== undefined ? (
            this.props.edit_menu_modal(
              menu.public_id,
              this.props.handle_close,
              this.props.handle_edited_menu
            )
          ) : (
            <></>
          )
        }

        {
          // Llamando modal para eliminar elementos internos
          this.state.show["delete_submenu_modal"] !== undefined &&
          this.state.show["delete_submenu_modal"] === true &&
          this.props.delete_submenu_modal !== undefined ? (
            this.props.delete_submenu_modal(
              this.state.current_selected_id,
              this.state.current_selected_id,
              this.props.handle_close,
              this.props.handle_edited_menu
            )
          ) : (
            <></>
          )
        }
        {
          // Llamando modal para editar elementos internos
          this.state.show["edit_submenu_modal"] !== undefined &&
          this.state.show["edit_submenu_modal"] === true &&
          this.props.edit_submenu_modal !== undefined ? (
            this.props.edit_submenu_modal(
              this.state.current_selected_id,
              this.state.current_selected_id,
              this.props.handle_close,
              this.props.handle_edited_menu
            )
          ) : (
            <></>
          )
          */
        }
      </ul>
    );
  };

  render() {
    const { menu } = this.props;
    return this.toggled_menu(menu);
  }
}
export default Menu;
