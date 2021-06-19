import React, { Component } from "react";
//import "bootstrap/dist/css/bootstrap.min.css";
import { Groups } from "./File";
import FileContainer from "./FileContainer"


type FileManagerProps = {
  files: Groups;
};

// manejo de contenedores de archivos
class FileManager extends Component<FileManagerProps> {
  
  _render_file_containers = () => {
    if (this.props.files === undefined) return <></>;
    return (
      <div>
        {Object.keys(this.props.files).map(
          (name) => (
            <FileContainer
              key={name}
              name={name}
              files={this.props.files[name]}
            />
        ))}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this._render_file_containers()}
      </React.Fragment>
    );
  }
}

export default FileManager;
