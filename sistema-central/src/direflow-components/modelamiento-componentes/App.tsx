import React, { Component } from "react";
import { withStyles } from "direflow-component";
import styles from "./App.css";
import { Modal_new_root_block } from "./Modals/blocks/modal_new_root_block";
import { SCT_API_URL } from "../../Constantes";
import { bloque_root, menu, submenu } from "./types";
import DynamicSidebar from "./DynamicSidebar/DynamicSidebar";
import { modal_edit_submenu_function } from "./Modals/modal_edit_submenu_function";
import { modal_delete_submenu_function } from "./Modals/modal_delete_submenu_function";
import { modal_edit_menu_function } from "./Modals/modal_edit_menu_function";
import { modal_add_submenu_function } from "./Modals/modal_add_submenu_function";
import ReactJson from "react-json-view";
import BlockRootGrid from "./ModelingGrids/ModelingBlocks/BlockRootGrid";
import BlockLeafGrid from "./ModelingGrids/ModelingComponents/BlockLeafGrid";
import SubComponentGrid from "./ModelingGrids/ModelingSubComponents/SubComponentGrid";

type props = {
  root_public_id: string;
};

type state = {
  new_root: boolean;
  modal_show: boolean;
  loading: boolean;
  error: boolean;
  log: Object;
  bloqueroot: bloque_root | undefined;
  menu: Array<menu>;
  selected_menu_id: string | undefined;
  selected_menu: menu | undefined;
};

// const root_public_id = "disponibilidad_ems";

// Tagname de publicación en index.tsx
class ComponentModeling extends Component<props, state> {
  root_public_id: string;
  constructor(props) {
    super(props);
    this.state = {
      // Detects whether a root structure is needed or not
      new_root: false,
      modal_show: false,
      loading: false,
      error: false,
      log: { msg: "Empezando... Conectando con API-SCT" },
      bloqueroot: undefined,
      menu: [],
      selected_menu_id: undefined,
      selected_menu: undefined,
    };
    // identify the public_id of this modeling process
    this.root_public_id =
      this.props.root_public_id !== undefined
        ? this.props.root_public_id
        : "no_definido";
  }

  componentDidMount = async () => {
    this._search_root_block().then((bloqueroot) =>
      this._create_initial_menu(bloqueroot)
    );
  };

  // manejar el cierre de los modales:
  handle_modal_close = (update: boolean) => {
    // let update_modal_show_state = this.state.modal_show;
    this.setState({ modal_show: update });
  };

  // maneja cambios en la estructura:
  handle_changes_in_structure = (
    public_id: string,
    document: string,
    value: Object
  ) => {
    console.log(public_id, document, value);
  };

  handle_messages = (msg) => {
    if (msg !== undefined) {
      this.setState({ log: msg });
    }
  };

  handle_edited_menu = (menu) => {
    console.log("handle_edited_menu", menu);
  };

  handle_reload = (menu: menu) => {
    if (menu === undefined) return;
    let document = menu.document;
    switch (document) {
      case "BloqueRoot":
        this._search_root_block().then((bloqueroot) =>
          this._create_initial_menu(bloqueroot)
        );
        break;
    }
    console.log("reload", menu);
  };

  // busca la estructura basada en bloques y componentes:
  _search_root_block = async () => {
    let bloqueroot = null;
    this.setState({ loading: true, error: false });
    let path = SCT_API_URL + "/block-root/" + this.root_public_id;
    await fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          bloqueroot = json.bloqueroot as bloque_root;
          this.setState({ bloqueroot: bloqueroot, new_root: false });
        } else {
          this.setState({
            new_root: true,
            log: {
              msg: "Es necesario crear un bloque principal para esta página",
            },
          });
        }
      })
      .catch((error) => {
        this.setState({
          error: true,
          log: {
            msg: "Ha fallado la conexión con la API de modelamiento (api-sct)",
          },
        });
        console.log(error, this.state.log);
      });
    this.setState({ loading: false });
    return bloqueroot;
  };

  _create_initial_menu = (bloqueroot: bloque_root) => {
    if (bloqueroot === null) {
      this.setState({ menu: [] });
      return;
    }
    // usando las hojas para realizar el submenú:
    let submenus = [];
    for (const leaf of bloqueroot.leafs) {
      let submenu = {
        level: 0,
        parent_id: leaf.parent_id,
        public_id: leaf.public_id,
        document: leaf.document,
        name: leaf.name,
        object: leaf,
      } as submenu;
      submenus.push(submenu);
    }
    // creando el menu inicial
    let menu = {
      level: 0,
      parent_id: undefined,
      public_id: bloqueroot.public_id,
      name: bloqueroot.name,
      document: bloqueroot.document,
      submenu: submenus,
      object: bloqueroot,
    } as menu;
    this.setState({
      menu: [menu],
      selected_menu_id: bloqueroot.public_id,
      selected_menu: menu,
    });
  };

  // Manejo de selección de menus:
  _on_click_menu = (new_menu: menu, selected_menu_id: string) => {
    console.log("new_menu", new_menu);
    if (new_menu === undefined) {
      return;
    }
    if (new_menu.level === 0) {
      this.setState({
        menu: [new_menu],
        selected_menu_id: selected_menu_id,
        selected_menu: new_menu,
      });
    } else {
      let new_array_menu = this.state.menu;
      // remove all items below new_menu.level
      new_array_menu.length = new_menu.level;
      new_array_menu.push(new_menu);
      this.setState({
        menu: new_array_menu,
        selected_menu_id: selected_menu_id,
        selected_menu: new_menu,
      });
    }
    console.log("new_menu", new_menu, selected_menu_id);
  };

  // show grid for each selection:
  show_grid = () => {
    if (this.state.selected_menu === undefined) {
      return <></>;
    }
    let document = this.state.selected_menu.document;
    console.log("grid", document);
    switch (document) {
      case "BloqueRoot":
        return (
          <BlockRootGrid
            menu={this.state.selected_menu}
            handle_messages={this.handle_messages}
            handle_reload={this.handle_reload}
          />
        );
      case "BloqueLeaf":
        return (
          <BlockLeafGrid
            menu={this.state.selected_menu}
            handle_messages={this.handle_messages}
            handle_reload={this.handle_reload}
          />
        );
      case "ComponenteLeaf":
        return (
          <SubComponentGrid
            menu={this.state.selected_menu}
            handle_messages={this.handle_messages}
            handle_reload={this.handle_reload}
          />
        );
    }

    return <></>;
  };

  // Permite desplegar la modal de inicio de modelación
  // Esto en el caso que aún no exista el root de modelado:
  is_needed_a_new_root = () => {
    if (this.state.new_root) {
      return (
        <Modal_new_root_block
          public_id={this.root_public_id}
          handle_close={this.handle_modal_close}
          handle_new_root_block={this.handle_changes_in_structure}
        />
      );
    }
    return <div></div>;
  };

  render() {
    // previene retroceder la página en caso de pulsar la tecla de retroceso (número 8)
    window.onkeydown = (e: KeyboardEvent) => {
      if (e.key === "backspace")
        if (e.target === document.body) {
          e.preventDefault();
        }
    };
    return (
      <>
        {
          // if there is need to create a new root structure:
          this.is_needed_a_new_root()
        }
        <div className="page-wrapper default-theme sidebar-bg bg1 toggled">
          <DynamicSidebar
            // to keep track
            menu={this.state.menu}
            selected_menu_id={this.state.selected_menu_id}
            // modales de adición, edición, eliminación:
            edit_menu_modal={modal_edit_menu_function}
            add_submenu_modal={modal_add_submenu_function}
            edit_submenu_modal={modal_edit_submenu_function}
            delete_submenu_modal={modal_delete_submenu_function}
            // manejo de selección de menus:
            handle_click_menu_button={this._on_click_menu}
            handle_edited_menu={this.handle_edited_menu}
          />
          <div className="page-content content-shift">
            {/* Grid de modelamiento*/}
            <div className="grid">{this.show_grid()}</div>
            <div className="logger">
              <ReactJson
                name={false}
                displayObjectSize={true}
                indentWidth={2}
                collapsed={false}
                iconStyle="circle"
                displayDataTypes={false}
                theme="monokai"
                src={this.state.log}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withStyles([styles])(ComponentModeling);
