import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faAngleDoubleUp,
  faAngleDoubleDown,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "react-bootstrap";
import { File } from "./File";
import "./style.css";
import { SRM_API_URL } from "../../../Constantes";

type FileProps = {
  files: Array<File>;
  name: string;
};

// Pagina inicial de manejo de nodos:
class FileContainer extends Component<FileProps> {
  /* Configuración de la página: */
  state = {
    open: false,
  };

  _download_file = (name) => {
    let url = SRM_API_URL + "/files/file/s_remoto_excel/" + name;
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
      });
    });
  };

  _render_file = (name, date) => {
    let date_f = String(date).split(".")[0];
    return (
      <div
        key={"file-" + name}
        className="sc-file"
        onClick={() => this._download_file(name)}
      >
        <FontAwesomeIcon className="file-icon" icon={faFileExcel} size="3x" />
        <div className="sc-file-description">
          <div>{name}</div>
          <div className="sc-file-date">{date_f}</div>
        </div>
      </div>
    );
  };

  _render_files = () => {
    if (this.props.files === undefined) return <></>;
    return (
      <div className="file-container">
        {this.props.files.map((file) =>
          this._render_file(file.name, file.datetime)
        )}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Card >
          <Card.Header
            onClick={(e) => {
              if (e.target.className === "header-big card-header") {
                this.setState({ open: !this.state.open });
              }
            }}
            className={"header-big"}
          >
            <div
              onClick={() => {
                this.setState({ open: !this.state.open });
              }}
            >
              <FontAwesomeIcon
                icon={this.state.open ? faAngleDoubleUp : faAngleDoubleDown}
                size="sm"
                className="ir-toggle-btn"
              />
              {this.props.name}
            </div>
          </Card.Header>
          <Card.Body
            className={
              this.state.open ? "collapse show small-padding" : "collapse"
            }
          >
            {this._render_files()}
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default FileContainer;
