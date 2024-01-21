import { Button, Col, Form, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { deleteInstallation } from "../../../Common/FetchData/V2SRFetchData";

export function InstallationRemove(props) {
  const { selectedEntityId, selectedInstallation, requestReload } = props;
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [msg, setMsg] = useState(undefined);

  const [deleteForm, setDeleteForm] = useState({
    instalacion_nombre: undefined,
    instalacion_tipo: undefined,
    protocolo: undefined,
    latitud: 0,
    longitud: 0,
    activado: selectedInstallation.activado,
    instalacion_ems_code: undefined,
  });

  useEffect(() => {
    setDeleteForm({
      ...selectedInstallation,
    });
  }, [selectedInstallation]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setLoading(true);
    setValidated(true);

    deleteInstallation(selectedEntityId, selectedInstallation._id).then(
      (resp) => {
        console.log("resp", resp);
        setLoading(false);
        setMsg(resp ? resp?.msg : "No defined");
        requestReload();
      },
    );
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label className="disabled">Id Instalación</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar EMS code"
              disabled
              name="instalacion_ems_code"
              defaultValue={deleteForm.instalacion_ems_code}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="disabled">Tipo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar Tipo"
              disabled
              name="instalacion_tipo"
              defaultValue={deleteForm.instalacion_tipo}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label className="disabled">Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar nombre"
              disabled
              name="instalacion_nombre"
              defaultValue={deleteForm.instalacion_nombre}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="disabled">Protocolo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar Protocolo"
              disabled
              name="protocolo"
              defaultValue={deleteForm.protocolo}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label className="disabled">Latitud</Form.Label>
            <Form.Control
              type="number"
              disabled
              name="latitud"
              value={deleteForm.latitud || 0}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="disabled">Longitud</Form.Label>
            <Form.Control
              type="number"
              disabled
              name="longitud"
              value={deleteForm.longitud || 0}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check
          type="checkbox"
          label="Activada"
          name="activado"
          defaultChecked={deleteForm.activado || false}
          value={deleteForm.activado || false}
        />
      </Form.Group>
      <div className={"sc-container"}>
        <Button variant="danger" type="submit" disabled={loading}>
          Eliminar {selectedInstallation.instalacion_nombre}
        </Button>
        <div>{msg && <div className={"sc-message"}>{msg}</div>}</div>
      </div>
    </Form>
  );
}
