import React, { Component } from "react";
import { Styled } from "direflow-component";
import styles from "./App.css";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import FileManagementStyle from "../Common/FileManagement/style.css";
import { SRM_API_URL } from "../../Constantes";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import FileManager from "../Common/FileManagement/FileManager";

// Pagina inicial de manejo de archivos backup de configuraciones de nodos:
class SRBackupFiles extends Component {
  /* Configuración de la página: */
  state = {
    files: undefined,
    search: "",
    filtered_files: undefined,
    loading: true,
    error: false,
    pinned: false,
  };

  async componentDidMount() {
    this._search_files_now();
  }

  // permite manejar el sideBar pinned or toggle
  handle_onClickBtnPin = (btnPin) => {
    this.setState({ pinned: btnPin });
  };

  _search_files_now = async () => {
    this.setState({ files: undefined, loading: true, error: false });
    await fetch(
      SRM_API_URL + "/files/s_remoto_excel/agrupado/" + this.state.search,
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.result !== undefined) {
          if (json.result === {}) {
            this.setState({ files: undefined, filtered_files: undefined });
          } else {
            this.setState({ files: json.result, filtered_files: json.result });
          }
        }
      })
      .catch(() => {
        this.setState({ error: true });
      });
    this.setState({ loading: false });
  };

  _update_search = (e) => {
    this.setState({ search: e.target.value.trim() });
  };

  _filter = (e) => {
    let filtered_files = {};
    for (const group in this.state.files) {
      if (group.toLowerCase().includes(e.target.value.toLowerCase())) {
        filtered_files[group] = this.state.files[group];
      }
    }
    this.setState({ filtered_files: filtered_files });
  };

  _notification = () => {
    if (this.state.loading) {
      return this._loading();
    }
    if (
      this.state.files === undefined ||
      Object.keys(this.state.files).length === 0
    ) {
      return this._not_found();
    }
    if (this.state.error) {
      return this._error();
    }
  };

  _loading = () => {
    return (
      <div>
        <Spinner animation="border" role="status" size="sm" />
        <span> Espere por favor, cargando ...</span>
      </div>
    );
  };

  _not_found = () => {
    return (
      <div>
        <span> No hay resultados para la búsqueda...</span>
      </div>
    );
  };

  _error = () => {
    return (
      <div>
        <span> Error de conexión con la API...</span>
      </div>
    );
  };

  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };

    return (
      <Styled styles={[styles, FileManagementStyle, bootstrap]}>
        <div className="page-content">
          <Form.Group as={Row} className="sc-search">
            <Form.Label column sm="2" className="sc-btn-search">
              <Button
                variant="outline-dark"
                onClick={this._search_files_now}
                disabled={this.state.files === undefined}
                className="btn-search"
              >
                Actualizar
              </Button>
            </Form.Label>
            <Col sm="7" className="sc-search-input">
              <Form.Control
                type="text"
                onChange={this._filter}
                onBlur={this._update_search}
                placeholder="Archivos a buscar"
              />
            </Col>
            <Row className="lb-bck-version">
              Cada grupo de versionamiento contiene hasta 7 archivos que fueron
              subidos con el mismo nombre. Los archivos son renombrados con @1
              para la versión penúltima y con @6 la versión más antigua. Haga
              click sobre un grupo de versionamiento para ver más detalle:
            </Row>
          </Form.Group>
          <div style={{ marginLeft: "15px" }}>{this._notification()}</div>
          <div className="div-cards">
            <FileManager files={this.state.filtered_files} />
          </div>
        </div>
      </Styled>
    );
  }
}

export default SRBackupFiles;
