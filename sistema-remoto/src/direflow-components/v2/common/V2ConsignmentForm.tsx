import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { to_yyyy_mm_dd_hh_mm_ss } from "../../Common/DatePicker/DateRange";
import { DateRangeTime } from "../../Common/DatePicker/DateRangeTime";

interface V2ConsignmentFormProps {
  headerLabel: string;
  buttonLabel: string;
  onSubmit: Function;
}
export const V2ConsignmentForm = (props: V2ConsignmentFormProps) => {
  const { headerLabel, buttonLabel, onSubmit } = props;

  const [consForm, setConsForm] = useState({
    no_consignacion: undefined,
    fecha_inicio: undefined,
    fecha_final: undefined,
    detalle: "",
    descripcion_corta: "",
    responsable:
      localStorage.getItem("userRole") +
      " | " +
      localStorage.getItem("userDisplayName"),
  });
  const [validatedForm, setValidatedForm] = useState({
    no_consignacion: false,
    fecha_inicio: true,
    fecha_final: true,
  });
  const [validated, setValidated] = useState(false);

  const toCheck = ["no_consignacion", "fecha_inicio", "fecha_final"];

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const name = event.target.name;
    const value = event.target.value;
    const currentValidation = checkForm(name, value);
    setValidatedForm((values) => ({
      ...values,
      [name]: currentValidation,
    }));
    setConsForm((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    setValidated(isValidForm());
  }, [consForm]);

  const checkForm = (name: string, value: any): boolean => {
    switch (name) {
      case "no_consignacion":
        return value?.length >= 4;
      case "fecha_inicio":
        return value !== undefined;
      case "fecha_final":
        return value !== undefined;
      default:
        return true;
    }
  };

  const isValidForm = (): boolean => {
    let isValid = true;
    toCheck.forEach((element) => {
      isValid = isValid && validatedForm[element];
    });
    return isValid;
  };

  return (
    <Card>
      <Card.Header className="cons-header">{headerLabel}</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group as={Row}>
            <Col sm="5">
              <Form.Label>
                Código de consignación (min 4 caracteres):{" "}
                <span className="cons-mandatory">* </span>
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Ingrese código"
                name="no_consignacion"
                onChange={handleChange}
              />
            </Col>
            <Col sm="7">
              <Form.Label>
                Fecha de consignación:{" "}
                <span className="cons-mandatory">* </span>
              </Form.Label>
              <br></br>
              <DateRangeTime
                last_month={true}
                onPickerChange={(ini: Date, end: Date) => {
                  setConsForm((values) => ({
                    ...values,
                    fecha_inicio: to_yyyy_mm_dd_hh_mm_ss(ini),
                    fecha_final: to_yyyy_mm_dd_hh_mm_ss(end),
                  }));
                }}
              ></DateRangeTime>
            </Col>
            <Col sm="12">
              <Form.Label>Descripción corta de la consignación: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese descripción corta"
                onChange={handleChange}
              />
            </Col>
            <Col sm="12">
              <Form.Label>Detalles: </Form.Label>
              <Form.Control
                as="textarea"
                aria-label="With textarea"
                placeholder="Ingrese detalles"
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Label>
                <span style={{ fontWeight: "bold" }}>Responsable: </span>{" "}
                {consForm.responsable}
              </Form.Label>
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
      <Card.Footer>
        {validated ? (
          <button
            className="btn btn-warning "
            onClick={() => {
              onSubmit(consForm);
            }}
          >
            {buttonLabel}
          </button>
        ) : (
          <></>
        )}
      </Card.Footer>
    </Card>
  );
};
