import Upload, { UploadProps } from "../../Upload/Upload";
import React from "react";
import { Form } from "react-bootstrap";
import { SRM_API_URL } from "../../../Pages/sRemoto/Constantes";

export interface UploadNodeProps extends UploadProps {
  tipo: String;
  node_name: String;
  onNodeUpload: Function;
}

class UploadNode extends Upload<UploadNodeProps> {
  state = {
    files: [], // for having all the files
    uploading: false, // to know if is uploading
    uploadProgress: {}, // track the uploading process
    successfullUploaded: false, // to know if the process was successful
    errorUploading: false,
    message: "", // to give a clue of what is happening
    option: "Añadir y actualizar"
  };


  // Permitir un solo archivo:
  // To handle new files added via the dropzone
  onFilesAdded(files) {
    const file = [files[0]];
    this.setState({ files: file });
  }

  // inform to the parent that a node was updated:
  _handleOnNodeUpload = (node) => { 
    this.props.onNodeUpload(node);
  }

  // Uploading Files:
  async uploadFiles() {
    // change state of the component
    // First of all, clear any uploadProgress that may be left from a previous upload
    this.setState({
      uploadProgress: {},
      uploading: true,
      errorUploading: false,
      successfullUploaded: false,
      message: "",
    });

    const promises = [];
    this.state.files.forEach((file) => {
      promises.push(this.sendRequest(file));
    });
    try {
      let check = true;
      // wait for submit operation until all are done:
      await Promise.all(promises)
        .then((values) => {
          values.forEach((value) => {
            let objResp = JSON.parse(value[1].response);
            if (value[1].status === 200) {
              this.setState({ message: objResp.msg });
              this._handleOnNodeUpload(objResp.nodo);
            } else {
              this.setState({ message: objResp.msg });
            }
            check = check && value[1].status === 200;
          });
        })
        .catch((e) => {
          check = false;
        });
      // update the state of the component
      this.setState({
        successfullUploaded: check,
        uploading: false,
        errorUploading: !check,
      });
    } catch (e) {
      // proceso fallido
      this.setState({
        successfullUploaded: false,
        uploading: false,
        errorUploading: true,
      });
    }
  }

  // implement send request of the file:
  sendRequest(file) {
    return new Promise((resolve, reject) => {
      try {
        const req = new XMLHttpRequest();

        req.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const copy = { ...this.state.uploadProgress };
            copy[file.name] = {
              state: "pending",
              percentage: (event.loaded / event.total) * 100,
            };
            this.setState({ uploadProgress: copy });
          }
        });

        req.upload.addEventListener("load", (event) => {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = { state: "done", percentage: 100 };
          this.setState({ uploadProgress: copy });
        });

        req.upload.addEventListener("error", (event) => {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = { state: "error", percentage: 0 };
          this.setState({ uploadProgress: copy, errorUploading: true });
          reject([file.name, req]);
        });

        const formData = new FormData();
        formData.append("excel_file", file, file.name);
        if (this.state.option === "Reemplazar") { 
          formData.append("option", "REEMPLAZAR");
          const confirm = window.confirm(
            "Esta opción eliminará el nodo antiguo y construirá uno nuevo, sustituyendo por completo el nodo antiguo. Desea continuar? " 
          );
          // Si no confirma el reemplazo, entonces no se continúa con la sustitución total
          if (!confirm) reject([file.name, req]);
        }

        // sending a file each time
        const route = `${SRM_API_URL}/admin-sRemoto/nodo/${this.props.tipo}/${this.props.node_name}/from-excel`;
        req.open("PUT", route);
        req.send(formData);
        req.onload = () => {
          resolve([file.name, req]);
        };
        req.onerror = () => {
          reject([file.name, req]);
        };
      } catch (e) {
        reject([file, null]);
      }
    });
  }

  // Report
  status_message() {
    if (this.state.files.length <= 0) {
      return <div> </div>;
    }

    if (this.state.uploading) {
      return <div>Enviando... </div>;
    }
    if (this.state.successfullUploaded) {
      return <div>Proceso exitoso</div>;
    }
    if (this.state.errorUploading) {
      let msg = "Error al subir los archivos";
      return (
        <div>
          <div>{msg}</div>
          <div>{this.state.message}</div>
        </div>
      );
    }
    if (this.state.files.length > 0 && !this.state.uploading) {
      return <div>Archivos listos a subir </div>;
    }
  }

  _update_option= (e) => { 
    this.setState({option:e.target.value})
  }

  // control:
  control = () => {
    return (
      <Form.Control as="select"
        onChange={this._update_option}
        className="sl-upload">
        <option>Añadir y actualizar</option>
        <option>Reemplazar</option>
      </Form.Control>
    );
  };
}

export default UploadNode;
