import { Button, Col, Form, Row } from "react-bootstrap";
import React, { useState } from "react";
import { createNewInstallation } from "../../../Common/FetchData/V2SRFetchData";

export function InstallationCreate(props) {
  const { selectedEntity, requestReload } = props;
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  console.log(selectedEntity);
  const [createForm, setCreateForm] = useState({
    instalacion_nombre: undefined,
    instalacion_tipo: undefined,
    protocolo: undefined,
    latitud: 0,
    longitud: 0,
    activado: undefined,
    instalacion_ems_code: undefined,
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCreateForm((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    let formToSend = createForm;

    if (!createForm?.activado) {
      formToSend = {
        ...createForm,
        activado: false,
      };
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setLoading(true);
    setValidated(true);

    createNewInstallation(selectedEntity.id_entidad, formToSend).then(() => {
      setLoading(false);
      requestReload();
    });
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label className="required">Id Instalación</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar EMS code"
              required
              name="instalacion_ems_code"
              value={createForm.instalacion_ems_code}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="required">Tipo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar Tipo"
              required
              name="instalacion_tipo"
              value={createForm.instalacion_tipo}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label className="required">Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar nombre"
              required
              name="instalacion_nombre"
              value={createForm.instalacion_nombre}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="required">Protocolo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar Protocolo"
              required
              name="protocolo"
              value={createForm.protocolo}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label className="required">Latitud</Form.Label>
            <Form.Control
              type="number"
              required
              name="latitud"
              value={createForm.latitud || 0}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="required">Longitud</Form.Label>
            <Form.Control
              type="number"
              required
              name="longitud"
              value={createForm.longitud || 0}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check
          type="checkbox"
          label="Activada"
          name="activado"
          value={createForm.activado || false}
          onChange={handleChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={loading}>
        Crear Instalación
      </Button>
    </Form>
  );
}
