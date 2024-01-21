import React, { useEffect, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import {
  createNewBahia,
  deleteBahia,
  editBahia,
} from "../../../Common/FetchData/V2SRFetchData";

export function BahiaAdministration(props) {
  const { bahia, selectedInstalationId } = props;

  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const [bahiaForm, setBahiaForm] = useState({
    bahia_code: undefined,
    bahia_nombre: undefined,
    voltaje: undefined,
    activado: undefined,
  });

  useEffect(() => {
    setBahiaForm({
      ...bahia,
    });
  }, [bahia]);

  const handleCreate = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setLoading(true);
    setValidated(true);

    createNewBahia(selectedInstalationId, bahiaForm).then((response) => {
      setLoading(false);
      console.error(response);
      // requestReload();
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
        console.error(response);
        setLoading(false);
        // requestReload();
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
      console.error(response);
      setLoading(false);
      // requestReload();
    });
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setBahiaForm((values) => ({ ...values, [name]: value }));
  };

  return (
    <Form noValidate validated={validated}>
      <Form.Group>
        <Form.Label className="required">Codigo Bahia</Form.Label>
        <Form.Control
          type="text"
          placeholder="Codigo"
          name="bahia_code"
          onChange={handleChange}
          defaultValue={bahiaForm.bahia_code}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className="required">Nombre</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre"
          name="bahia_nombre"
          onChange={handleChange}
          defaultValue={bahiaForm.bahia_nombre}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label className="required">Voltaje</Form.Label>
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
          onChange={handleChange}
          value={bahiaForm.activado || false}
        />
      </Form.Group>

      {!bahia && (
        <Button
          variant="primary"
          type="button"
          disabled={loading}
          onClick={handleCreate}
        >
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
    </Form>
  );
}
