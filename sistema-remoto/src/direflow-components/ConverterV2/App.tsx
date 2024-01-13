import React, {FC, useRef, useState} from 'react';
import {SRM_API_URL} from '../../Constantes';
import styles from './style.css'
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import {Styled} from "direflow-component";


interface ConverterV2Props {
}

const UPLOAD_ENDPOINT = `${SRM_API_URL}/admin-sRemoto/v2/upgrade/from-excel`;

const ConverterV2: FC<ConverterV2Props> = () => {
    const inputRef: any = useRef();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (event: any) => {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            setLoading(true);
            setMsg('')

            event.preventDefault();
            const formData = new FormData();
            formData.append("excel_file", file);
            req.open("POST", UPLOAD_ENDPOINT);
            req.send(formData);
            req.responseType = 'blob'
            req.onload = () => {
                const blob = req.response;
                const contentDispo = req.getResponseHeader('Content-Disposition');
                if (!contentDispo) {
                    setLoading(false);
                    setMsg('Error al convertir archivo, detalle en archivo error.txt');
                    saveBlob(blob, 'error.txt');
                    resolve();
                }else{
                    const fileName = contentDispo.match(/filename[\W|\w]*(v2_[\w|\W]*)/)[1];
                    setLoading(false);
                    saveBlob(blob, fileName);
                    if (inputRef) {
                        inputRef.current.value = null;
                    }
                    resolve([file.name, req]);
                }
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

    const renderForm = () => {
        if (loading) {
            return (
                <div className="src-loading-container">
                    <div className="spinner-border text-primary m-2"></div>
                    <div>Convirtiendo archivo, espere por favor ...</div>
                </div>
            )
        }
        return renderInput();
    }

    const renderInput = () => {
        return (<div className="custom-file">
            <input className="form-control" ref={inputRef} onChange={(e) => setFile(e.target.files[0])} type="file"
                   id="formFile"/>
            <br/>
            <button type='submit' className="btn btn-primary" disabled={!(file)}>
                Convertir
            </button>
            <div>{msg}</div>
        </div>)
    }

    return (
        <Styled styles={[styles, bootstrap]} scoped={true}>
            <div className="w-50">
                <form onSubmit={handleSubmit}>
                    {renderForm()}
                </form>
            </div>
        </Styled>
    )
}


export default ConverterV2;
