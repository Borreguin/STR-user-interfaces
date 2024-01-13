import { Button, Col, Form, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { deleteInstallation } from "../../../../Common/FetchData/V2SRFetchData";

export function InstallationRemove(props) {
  const { selectedEntityId, selectedInstallation, requestReload } = props;
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const [deleteForm, setDeleteForm] = useState({
    instalacion_nombre: undefined,
    instalacion_tipo: undefined,
    protocolo: undefined,
    latitud: 0,
    longitud: 0,
    activado: undefined,
    instalacion_ems_code: undefined,
  });

  useEffect(() => {
    setDeleteForm({
      ...selectedInstallation,
    });
  }, [selectedInstallation]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setLoading(true);
    setValidated(true);

    deleteInstallation(selectedEntityId, selectedInstallation._id).then(() => {
      setLoading(false);
      requestReload();
    });
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
              value={deleteForm.instalacion_ems_code}
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
              value={deleteForm.instalacion_tipo}
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
              value={deleteForm.instalacion_nombre}
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
              value={deleteForm.protocolo}
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
          value={deleteForm.activado || false}
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={loading}>
        Eliminar Instalación
      </Button>
    </Form>
  );
}
