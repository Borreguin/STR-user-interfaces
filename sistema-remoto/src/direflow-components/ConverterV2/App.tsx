import React, { FC, useRef, useState } from 'react';
import './style.css'
import { SRM_API_URL } from '../../Constantes';


interface ConverterV2Props { }
const UPLOAD_ENDPOINT = `${SRM_API_URL}/admin-sRemoto/v2/upgrade/from-excel`;

const ConverterV2: FC<ConverterV2Props> = () => {
  const inputRef : any = useRef();
  const [file, setFile] = useState(null);

  const handleSubmit = async (event: any) => {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      event.preventDefault();
      const formData = new FormData();
      formData.append("excel_file", file);
      req.open("POST", UPLOAD_ENDPOINT);
      req.send(formData);
      req.responseType = 'blob'
      req.onload = () => {
        const blob = req.response;
        const contentDispo = req.getResponseHeader('Content-Disposition');
        const fileName = contentDispo.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1];
        saveBlob(blob, fileName);
        if(inputRef){
          inputRef.current.value = null;
        }
        resolve([file.name, req]);
      };

      req.onerror = () => {
        reject([file.name, req]);
      };
    })
  };

  function saveBlob(blob: Blob, fileName: string) {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.dispatchEvent(new MouseEvent('click'));
  }

  return (
    <div className="w-50">
      <form onSubmit={handleSubmit}>
        <div className="custom-file">
          <input className="form-control" ref={inputRef} onChange={(e) => setFile(e.target.files[0])} type="file" id="formFile" />
        </div>
        <br/>
        <br/>
        <button type='submit' className="btn btn-primary" disabled={!(file)}>
          Convertir
        </button>
      </form>
    </div>
  )
}


export default ConverterV2;
