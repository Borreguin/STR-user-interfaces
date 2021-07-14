import React, { Component } from "react";
import { menu } from "../types";
import Menu from "./Menu";

export interface MenuProps {
    menu: Array<menu>;
    // Hoocks:
    handle_close?: Function;
    handle_edited_menu?: Function;
    handle_click_menu_button: Function;
    // Modals:
    edit_menu_modal?: Function;
    add_submenu_modal?: Function;
    edit_submenu_modal?: Function;
    indisponibilidad_submenu_modal?: Function;
    // To keep the current state
    modal_show?: boolean;
    // selected_level: number;
    // selected_menu?: string | undefined;
    selected_menu_id?: string | undefined;
  }

class DynamicSideBar extends Component<MenuProps> {
    render() {
      const div_space = { height: "15px" };
      const custom_style = { zIndex: 1000 };
      let _ = require("lodash");
      // pinned
      return (
        <React.Fragment>
          <nav id="sidebar" className="sidebar-wrapper" style={custom_style}>
            <div className="sidebar-content">
              <div style={div_space}></div>
              {this.props.menu === undefined || this.props.menu.length === 0 ? (
                <></>
              ) : (
                this.props.menu.map((menu) => (
                  // menú estático con capacidad de añadir bloques:
                  <div
                    key={_.uniqueId("father_menu")}
                    className="sidebar-item sidebar-menu pinned"
                  >
                    <Menu
                      menu={menu}
                      //Hoocks
                      handle_close={this.props.handle_close}
                      handle_edited_menu={this.props.handle_edited_menu}
                      handle_click_menu_button={this.props.handle_click_menu_button}
                      //Modals:
                      edit_menu_modal={this.props.edit_menu_modal}
                      add_submenu_modal={this.props.add_submenu_modal}
                      edit_submenu_modal={this.props.edit_submenu_modal}
                      indisponibilidad_submenu_modal={this.props.indisponibilidad_submenu_modal}
                      // to keep track of changes
                      modal_show={this.props.modal_show}
                      selected_menu_id={ this.props.selected_menu_id}
                      // selected_block={ this.props.selected_block}
                    />
                  </div>
                ))
              )}
            </div>
          </nav>
        </React.Fragment>
      );
    }
  }
  
 
  
  export default DynamicSideBar;