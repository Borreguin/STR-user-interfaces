import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";
import {BahiaAdministration} from "./BahiaAdministration";

export function BahiaList(props) {

    const {selectedInstallation} = props
    const {bahias} = selectedInstallation

    const [bahiaSeleccionada, setBahiaSeleccionada] = useState(null);

    const handleRadioChange = (
        value
    ) => {
        setBahiaSeleccionada(value);
    };

    const handleEdit = () => {
        setBahiaSeleccionada(null)
    }

    return (
        <div>
            <Button className="col-4 mb-2" variant="primary" type="button" onClick={handleEdit}>
                Crear Bahia
            </Button>
            <div className="row">
                <Form className="col-6 overflow-auto bahias-container">
                    {bahias?.map((bahia) => (
                        <Form.Check
                            type="radio"
                            label={bahia?.bahia_nombre}
                            name={bahia?.bahia_nombre}
                            defaultValue={bahia}
                            checked={
                                bahiaSeleccionada ===
                                bahia
                            }
                            onChange={() =>
                                handleRadioChange(
                                    bahia
                                )
                            }
                            id={bahia?.document_id}
                            key={bahia?.document_id}
                        />
                    ))
                    }
                </Form>
                <div className="col-6">
                    {<BahiaAdministration bahia={bahiaSeleccionada}
                                          selectedInstalationId={selectedInstallation._id}></BahiaAdministration>}
                </div>
            </div>
        </div>

    );
}