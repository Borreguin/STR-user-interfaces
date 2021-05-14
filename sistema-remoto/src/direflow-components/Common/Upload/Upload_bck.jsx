// reference for this component: https://malcoded.com/posts/react-file-upload/
import React, { Component } from "react";
import "./Upload.css";
import { Button } from "react-bootstrap";
import Dropzone from "./DropZone";
import Progress from "./Progress";
import { SRM_API_URL } from "../../Pages/sRemoto/Constantes";


class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [], // for having all the files
      uploading: false, // to know if is uploading
      uploadProgress: {}, //
      successfullUploaded: false, // to know if the process was successful
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
  }

  // To handle new files added via the dropzone
  onFilesAdded(files) {
    this.setState((prevState) => ({
      files: prevState.files.concat(files),
    }));
  }

  // check whether the file is currently being uploaded or if the upload succeed
  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
        </div>
      );
    }
  }

  

  // Uploading Files:
  async uploadFiles() {
    // change state of the component
    // First of all, clear any uploadProgress that may be left from a previous upload
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    this.state.files.forEach((file) => {
      promises.push(this.sendRequest(file));
    });
    try {
      // wait for submit operation util all are done:
      await Promise.all(promises);
      // if all was successfully done:
      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      // TODO: Handler for this error
      this.setState({ successfullUploaded: false, uploading: false });
    }
  }

  // implement send request of the file:
  sendRequest(file) {
    return new Promise((resolve, reject) => {
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
        resolve(req.response);
      });

      req.upload.addEventListener("error", (event) => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(req.response);
      });

      const formData = new FormData();
      formData.append("file", file, file.name);

      // sending a file each time
      req.open("POST", SRM_API_URL + "/admin-sRemoto/upload");
      req.send(formData);
    });
  }

  // Report 
  status_message() { 

   if (this.state.files.length <=0) { 
      return <div> </div>
    }
    if (this.state.uploading) { 
      return <div>Cargando... </div>
    }
    if (this.state.successfullUploaded) { 
      return <div>Proceso existoso</div>
    }
  
  }

  render() {
    return (
      <div className="Upload">
        <div className="Content">
          <div>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={this.state.uploading || this.state.successfullUploaded}
            />
          </div>
          <div className="Files">
            {this.state.files.map((file) => {
              return (
                <div key={file.name} className="Row">
                  <span className="Filename">{file.name}</span>
                  {this.renderProgress(file)}
                </div>
              );
            })}
          </div>
          
        </div>
        <div style={{width:"100%"}}>
          <Button
            variant="outline-light"
            className="btn-def"
            disabled={this.state.files.length <= 0 || this.state.uploading || this.state.successfullUploaded}
            onClick={this.uploadFiles}
          >
            Subir
          </Button>
          <Button
            variant="outline-light"
            className="btn-def"
            disabled={this.state.files.length <= 0 || this.state.uploading}
            onClick={() =>
              this.setState({ files: [], successfullUploaded: false })
            }
          >
            Limpiar
          </Button>
        </div>
        {this.status_message()}
      </div>
    );
  }
}
// <div className="Actions">{this.renderActions()}</div>
export default Upload;


