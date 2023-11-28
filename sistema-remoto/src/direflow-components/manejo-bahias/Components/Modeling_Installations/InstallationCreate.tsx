import {Button, Col, Form, Row} from "react-bootstrap";
import React, {useState} from "react";

export function InstallationCreate() {
    const [createForm, setCreateForm] = useState({
        name: undefined,
        tipo: undefined,
        protocolo: undefined,
        latitud: undefined,
        longitud: undefined,
        activated: undefined,
        ems_code: undefined
    })

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setCreateForm(values => ({...values, [name]: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(JSON.stringify(createForm));
    }


    return (
        <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label className="required">Id Instalación</Form.Label>
                        <Form.Control type="text" placeholder="Ingresar EMS code"
                                      name="ems_code"
                                      value={createForm.ems_code || ""}
                                      onChange={handleChange}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label className="required">Tipo</Form.Label>
                        <Form.Control type="text" placeholder="Ingresar Tipo"
                                      name="tipo"
                                      value={createForm.tipo || ""}
                                      onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label className="required">Nombre</Form.Label>
                        <Form.Control type="text" placeholder="Ingresar nombre"
                                      name="name"
                                      value={createForm.name || ""}
                                      onChange={handleChange}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label className="required">Protocolo</Form.Label>
                        <Form.Control type="text" placeholder="Ingresar Protocolo"
                                      name="protocolo"
                                      value={createForm.protocolo || ""}
                                      onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label className="required">Latitud</Form.Label>
                        <Form.Control type="number"
                                      name="latitud"
                                      value={createForm.latitud || 0}
                                      onChange={handleChange}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label className="required">Longitud</Form.Label>
                        <Form.Control type="number"
                                      name="longitud"
                                      value={createForm.longitud || 0}
                                      onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Activada"
                            name="activated"
                            value={createForm.activated || false}
                            onChange={handleChange}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}