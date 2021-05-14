// reference for this component: https://malcoded.com/posts/react-file-upload/
import React, { Component } from "react";
import "./Upload.css";
import { Button} from "react-bootstrap";
import Dropzone from "./DropZone";
import Progress from "./Progress";

export interface UploadProps {
	uploadButton?: boolean;
  path?: string;
}

class Upload<P> extends Component<P & UploadProps, {}> {
  uploadButton: boolean;
  state = {
    files: [], // for having all the files
    uploading: false, // to know if is uploading
    uploadProgress: {}, // track the uploading process
    successfullUploaded: false, // to know if the process was successful
    errorUploading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      files: [], 
      uploading: false, 
      uploadProgress: {}, 
      successfullUploaded: false, 
      errorUploading: false,
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.uploadButton = (this.props.uploadButton === undefined)

  }

  // To handle new files added via the dropzone
  onFilesAdded(files) {
    this.setState({ files: files });
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
    this.setState({
      uploadProgress: {},
      uploading: true,
      errorUploading: false,
      successfullUploaded: false,
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
            check = check && value[1].status === 200;
          });
        })
        .catch(() => { check = false; })
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

  control = () => {}

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

        req.upload.addEventListener("load", () => {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = { state: "done", percentage: 100 };
          this.setState({ uploadProgress: copy });
        });

        req.upload.addEventListener("error", () => {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = { state: "error", percentage: 0 };
          this.setState({ uploadProgress: copy, errorUploading: true });
          reject([file.name, req]);
        });


        const formData = new FormData();
        formData.append("file", file, file.name);

        // sending a file each time
        req.open("POST", this.props.path);
        req.send(formData);
        req.onload = () => { resolve([file.name, req]); }
        req.onerror = () => { reject([file.name, req]); }

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
      return <div>Proceso existoso</div>;
    }
    if (this.state.errorUploading) {
      return <div>Error al subir los archivos</div>;
    }
    if (this.state.files.length > 0 && !this.state.uploading) { 
      return <div>Archivos listos a subir </div>;
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
        <div style={{ width: "100%" }}>
          { this.uploadButton ?
          <Button
            variant="outline-light"
            className="btn-def"
            disabled={
              this.state.files.length <= 0 ||
              this.state.uploading ||
              this.state.successfullUploaded
            }
            onClick={this.uploadFiles}
          >
              Subir
          </Button>: <></>
          }
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
          {this.control()}
        </div>
        {this.status_message()}
      </div>
    );
  }
}
// <div className="Actions">{this.renderActions()}</div>
export default Upload;
