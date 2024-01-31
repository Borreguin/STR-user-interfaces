import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { to_yyyy_mm_dd_hh_mm_ss } from "../Common/DatePicker/DateRange";
import {
  DateRangeTime,
  get_last_month_dates,
} from "../Common/DatePicker/DateRangeTime";
import { getCurrentUser } from "../Common/common-util";

interface V2ConsignmentFormProps {
  headerLabel: string;
  buttonLabel: string;
  onSubmit: Function;
  initialValues?: V2ConsignmentFormValues | undefined;
}

export interface V2ConsignmentFormValues {
  no_consignacion: string;
  fecha_inicio: string;
  fecha_final: string;
  detalle: string;
  descripcion_corta: string;
  responsable: string;
}

export const V2ConsignmentForm = (props: V2ConsignmentFormProps) => {
  const { headerLabel, buttonLabel, onSubmit, initialValues } = props;

  const [consForm, setConsForm] = useState({
    no_consignacion: !initialValues ? undefined : initialValues.no_consignacion,
    fecha_inicio: !initialValues ? undefined : initialValues.fecha_inicio,
    fecha_final: !initialValues ? undefined : initialValues.fecha_final,
    detalle: !initialValues ? "" : initialValues.detalle,
    descripcion_corta: !initialValues ? "" : initialValues.descripcion_corta,
    responsable: getCurrentUser(),
  } as V2ConsignmentFormValues);
  const [validatedForm, setValidatedForm] = useState({
    no_consignacion: true,
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
    if (initialValues !== undefined) {
      setValidated(true);
    }
  }, [initialValues]);

  useEffect(() => {
    for (const key of toCheck) {
      const isValid = checkForm(key, consForm[key]);
      setValidatedForm((values) => ({
        ...values,
        [key]: isValid,
      }));
    }
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
                defaultValue={consForm.no_consignacion}
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
                ini_date={
                  initialValues?.fecha_inicio === undefined
                    ? get_last_month_dates().first_day_month
                    : new Date(initialValues.fecha_inicio)
                }
                end_date={
                  initialValues?.fecha_final === undefined
                    ? get_last_month_dates().last_day_month
                    : new Date(initialValues.fecha_final)
                }
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
                name="descripcion_corta"
                defaultValue={consForm.descripcion_corta}
                onChange={handleChange}
              />
            </Col>
            <Col sm="12">
              <Form.Label>Detalles: </Form.Label>
              <Form.Control
                as="textarea"
                aria-label="With textarea"
                placeholder="Ingrese detalles"
                name="detalle"
                defaultValue={consForm.detalle}
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
