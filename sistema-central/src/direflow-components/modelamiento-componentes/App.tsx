import React, { Component } from "react";
import { withStyles } from "direflow-component";
import styles from "./App.css";
import { Modal_new_root_block } from "./Modals/blocks/modal_new_root_block";
import { SCT_API_URL } from "../../Constantes";
import { bloque_leaf, bloque_root, comp_root, leaf_component, menu, submenu } from "./types";
import DynamicSidebar from "./DynamicSidebar/DynamicSidebar";
import { modal_edit_submenu_function } from "./Modals/modal_edit_submenu_function";
import { modal_delete_submenu_function } from "./Modals/modal_delete_submenu_function";
import { modal_edit_menu_function } from "./Modals/modal_edit_menu_function";
import { modal_add_submenu_function } from "./Modals/modal_add_submenu_function";
import ReactJson from "react-json-view";
import BlockRootGrid from "./ModelingGrids/ModelingBlocks/BlockRootGrid";
import ComponentRootGrid from "./ModelingGrids/ModelingComponents/ComponentRootGrid";
import SubComponentGrid from "./ModelingGrids/ModelingSubComponents/SubComponentGrid";
import * as _ from "lodash";

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
      log: { msg: "Conectado con API-SCT" },
      bloqueroot: undefined,
      menu: [],
      selected_menu_id: undefined,
      selected_menu: undefined,
    };
    // identify the public_id of this modeling process
    this.root_public_id =
      this.props.root_public_id !== undefined
        ? this.props.root_public_id
        : "disponibilidad_ems";
  }

  componentDidMount = async () => {
    this._search_root_block().then((bloqueroot) =>
      this._create_initial_menu(bloqueroot)
    );
  };

  // manejar el cierre de los modales:
  handle_modal_close = (update: boolean) => {
    // let update_modal_show_state = this.state.modal_show;
    console.log("handle_modal_close", update);
    this.setState({ modal_show: update });
  };

  // maneja cambios en la estructura:
  handle_changes_in_structure = (
    public_id: string,
    document: string,
    value: Object
  ) => {
    console.log("handle_changes_in_structure", public_id, document, value);
  };

  handle_messages = (msg) => {
    console.log("handle_messages", msg);
    if (msg !== undefined) {
      this.setState({ log: msg });
    }
  };

  handle_edited_menu = (object) => {
    console.log("handle_edited_menu", object);
    if (object === undefined) return;
    if (object["document"] === "BloqueRoot") {
      this._create_initial_menu(object as bloque_root);
    } else {
      this._update_menu(object);
    }
  };

  handle_reload = (menu: menu) => {
    console.log("handle_reload", menu);
    if (menu === undefined) return;
    let document = menu.document;
    let level = menu.level;
    let new_menu = this.state.menu;
    console.log("handle_reload document",document);
    switch (document) {
      case "BloqueRoot":
        this._search_root_block().then((bloqueroot) =>
          this._create_initial_menu(bloqueroot)
        );
        break;
      case "BloqueLeaf":
        new_menu[level] = menu;
        this.setState({menu: new_menu, selected_menu:menu});
        break;
      case "ComponenteRoot":
        new_menu[level] = menu;
        this.setState({menu: new_menu, selected_menu:menu});
        break;
    }
  };
  // actualiza el menú de acuerdo al objeto enviado:
  _update_menu = (json) => {
    let bloqueroot = json.bloqueroot as bloque_root;
    let bloqueleaf = json.bloqueleaf as bloque_leaf;

    let componente_root = json.component_root as comp_root;
    let componente_leaf = json.component_leaf as leaf_component;
    // construyendo nuevo menu:
    let new_menus = this.state.menu;
    // let's change the menu:
    let new_object = null;
    if (bloqueleaf !== undefined) new_object = bloqueleaf as bloque_leaf;
    if (componente_root !== undefined) new_object = componente_root as comp_root;
    console.log("update menu", json, new_menus, new_object);
    
    // Se compara de esta manera ya que bloqueleaf es padre de ComponenteRoot
    for (const menu of new_menus) {
      // actualizar menu principal:
      if (bloqueroot &&  menu.public_id === bloqueroot.public_id) {
        menu.object = bloqueroot;
      }

      // Actualizar objetos del submenu si se necesita
      for (const submenu of menu.submenu) {
        // si es un bloque de tipo leaf
        if ( bloqueleaf && submenu.public_id === new_object.public_id) {
          submenu.object = new_object;
          console.log("done", submenu, bloqueleaf);
        }
        // si es un componente leaf
        if (componente_leaf && submenu.public_id === new_object.public_id) {
          console.log("update?", submenu);
        }
      }
      // Si el objeto se encuentra dentro del menu:
      if (menu.public_id === new_object.public_id) {
        console.log("need to check", menu, new_object)
        let submenus = [];
        let leafs = [];
        if (new_object.document === "BloqueLeaf") leafs = new_object.comp_root.leafs;
        if (new_object.document === "ComponenteRoot") leafs = new_object.leafs;
        for (const leaf of leafs) {
          let submenu = {
            level: menu.level,
            parent_id: leaf.parent_id,
            public_id: leaf.public_id,
            document: leaf.document,
            name: leaf.name,
            object: leaf,
          } as submenu;
          submenus.push(submenu);
        }
        menu.name = new_object.name;
        menu.document = new_object.document;
        menu.submenu = submenus;
        menu.object = new_object;
        let old_menu = _.cloneDeep(this.state.menu);
        console.log("menu anterior", old_menu);
        console.log("menu nuevo", new_menus);
        this.setState({ menu: new_menus });
        
      }
    }
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
    console.log("render grid", document);
    switch (document) {
      case "BloqueRoot":
        return (
          <BlockRootGrid
            menu={this.state.selected_menu}
            handle_messages={this.handle_messages}
            handle_reload={this.handle_reload}
          />
        );
      case "ComponenteRoot":
        console.log("aqui", this.state.selected_menu);
        return (
          <ComponentRootGrid
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
        <div className="page-wrapper">
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
