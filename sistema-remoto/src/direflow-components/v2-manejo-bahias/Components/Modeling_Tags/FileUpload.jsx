import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { SRM_API_URL } from "../../../../Constantes";

function FileUpload({ id_node, id_entity, id_utr, handle_msg }) {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    var url = `${SRM_API_URL}/admin-sRemoto/tags/${id_node}/${id_entity}/${id_utr}/from-excel`;
    fetch(url, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        handle_msg(result);
      })
      .catch((error) => {
        handle_msg({
          success: false,
          msg: "Error al subir el archivo " + error,
        });
      });
    setIsFilePicked(false);
  };

  return (
    <div>
      {!isFilePicked ? (
        <Form.Control type="file" onChange={changeHandler} />
      ) : (
        <div
          style={{ marginTop: "4px", height: "30px" }}
          onClick={handleSubmission}
        >
          Subir archivo: {selectedFile.name}{" "}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
