import { Button, Col, Form, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { editInstallation } from "../../../Common/FetchData/V2SRFetchData";

export function InstallationEdit(props) {
  const { selectedInstallation, requestReload } = props;
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [msg, setMsg] = useState(undefined);

  const [editForm, setEditForm] = useState({
    instalacion_nombre: undefined,
    instalacion_tipo: undefined,
    protocolo: undefined,
    latitud: 0,
    longitud: 0,
    activado: undefined,
    instalacion_ems_code: undefined,
  });

  useEffect(() => {
    setEditForm({
      ...selectedInstallation,
    });
  }, [selectedInstallation]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setEditForm((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setLoading(true);
    setValidated(true);
    setMsg(`Editando instalación ${selectedInstallation.instalacion_nombre}`);

    editInstallation(selectedInstallation._id, editForm).then((response) => {
      setLoading(false);
      setValidated(false);
      setMsg(response.msg);
      requestReload();
    });
  };
  if (loading) {
    return <div className="spinner-border spinner-border-sm"></div>;
  }

  return (
    <div>
      <Form noValidate validated={validated}>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label className="required">Id Instalación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresar EMS code"
                required
                name="instalacion_ems_code"
                value={editForm.instalacion_ems_code || ""}
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
                value={editForm.instalacion_tipo || ""}
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
                value={editForm.instalacion_nombre || ""}
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
                value={editForm.protocolo || ""}
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
                value={editForm.latitud || 0}
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
                value={editForm.longitud || 0}
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
            checked={editForm.activado || false}
            onChange={() => {
              setEditForm((values) => ({
                ...values,
                activado: !editForm.activado,
              }));
            }}
          />
        </Form.Group>

        <div className={"sc-container"}>
          <Button
            variant="warning"
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
          >
            Editar {selectedInstallation.instalacion_nombre}
          </Button>
          <div>{msg && <div className={"sc-message"}>{msg}</div>}</div>
        </div>
      </Form>
    </div>
  );
}
