import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Row } from "react-bootstrap";
import {
  createNewBahia,
  deleteBahia,
  editBahia,
} from "../../../Common/FetchData/V2SRFetchData";

export function BahiaAdministration(props) {
  const { bahia, selectedInstalationId, requestReload } = props;

  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [msg, setMsg] = useState(undefined);

  const [bahiaForm, setBahiaForm] = useState({
    bahia_code: undefined,
    bahia_nombre: undefined,
    voltaje: undefined,
    activado: undefined,
    tags: [],
  });

  useEffect(() => {
    setBahiaForm({
      ...bahia,
    });
  }, [bahia]);

  const handleSubmit = (event) => {
    let formToSend = bahiaForm;

    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setLoading(true);
    setValidated(true);

    createNewBahia(selectedInstalationId, formToSend).then((response) => {
      setLoading(false);
      setMsg(response.msg);
      if (response.success) {
        requestReload();
      }
    });
  };

  const handleEdit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setLoading(true);
    setValidated(true);

    editBahia(selectedInstalationId, bahia.document_id, bahiaForm).then(
      (response) => {
        setLoading(false);
        if (response.success) {
          requestReload();
        }
        setMsg(response.msg);
      },
    );
  };

  const handleRemove = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setLoading(true);
    setValidated(true);

    deleteBahia(selectedInstalationId, bahia.document_id).then((response) => {
      setLoading(false);
      if (response.success) {
        requestReload();
      }
      setMsg(response.msg);
    });
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setBahiaForm((values) => ({ ...values, [name]: value }));
  };

  return (
    <Form validated={validated} onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label className="required">Código Bahia</Form.Label>
        <Form.Control
          type="text"
          placeholder="Codigo"
          required
          name="bahia_code"
          value={bahiaForm.bahia_code || ""}
          onChange={handleChange}
          defaultValue={bahiaForm.bahia_code}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className="required">Nombre</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre"
          required
          name="bahia_nombre"
          value={bahiaForm.bahia_nombre || ""}
          onChange={handleChange}
          defaultValue={bahiaForm.bahia_nombre}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Voltaje</Form.Label>
        <Form.Control
          type="number"
          placeholder="Voltaje"
          name="voltaje"
          onChange={handleChange}
          value={bahiaForm.voltaje || 0}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check
          type="checkbox"
          label="Activada"
          name="activado"
          checked={bahiaForm.activado || false}
          onChange={() =>
            setBahiaForm({ ...bahiaForm, activado: !bahiaForm.activado })
          }
          value={bahiaForm.activado || false}
        />
      </Form.Group>

      {!bahia && (
        <Button variant="primary" type="submit" disabled={loading}>
          Crear Bahia
        </Button>
      )}
      {bahia && (
        <Row>
          <Button
            className="btn-half"
            variant="warning"
            type="button"
            disabled={loading}
            onClick={handleEdit}
          >
            Actualizar Bahia
          </Button>
          <br className="col" />
          <Button
            className="btn-half"
            variant="danger"
            type="button"
            disabled={loading}
            onClick={handleRemove}
          >
            Eliminar Bahia
          </Button>
        </Row>
      )}
      {msg && <Alert variant="info">{msg}</Alert>}
    </Form>
  );
}
