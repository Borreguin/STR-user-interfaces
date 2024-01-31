import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { DateRangeTime } from "../../Common/DatePicker/DateRangeTime";
import React, { useEffect, useState } from "react";
import { Consignment, selectedElements } from "../../Common/GeneralTypes";
import { getConsignmentsByIdAndRange } from "../../Common/FetchData/V2SRFetchData";
import { to_yyyy_mm_dd_hh_mm_ss } from "../../Common/DatePicker/DateRange";
import { ConsignmentBoxes } from "./ConsignmentBoxes";
import {
  getElementValues,
  getElementValuesForBahias,
} from "../../Common/common-util";

type Element = {
  document_id: string;
  type: string;
  name: string;
};

export type ConsignmentKeyValue = { [key: string]: Consignment[] };

interface ConsignmentPanelProps {
  selectedValues: selectedElements;
}

export const ConsignmentPanel = (props: ConsignmentPanelProps) => {
  const { selectedValues } = props;
  const [iniDate, setIniDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [title, setTitle] = useState("Consignaciones: ");
  const [elements, setElements] = useState([] as Element[]);
  const [loading, setLoading] = useState(false);
  const [consignmentsToEdit, setConsignmentsToEdit] = useState(
    {} as ConsignmentKeyValue,
  );

  const onPickerChange = (iniDate: Date, endDate: Date) => {
    setIniDate(iniDate);
    setEndDate(endDate);
  };

  useEffect(() => {
    let title = "Consignaciones: ";
    if (selectedValues.selectedNode !== undefined) {
      title += `${selectedValues.selectedNode.tipo} ${selectedValues.selectedNode.nombre}`;
    }
    if (
      selectedValues.selectedNode !== undefined &&
      selectedValues.selectedEntity !== undefined &&
      selectedValues.selectedInstallation !== undefined
    ) {
      const elements = [
        getElementValues(selectedValues.selectedNode),
        getElementValues(selectedValues.selectedEntity),
        getElementValues(selectedValues.selectedInstallation),
      ];
      for (const bahia of selectedValues.selectedInstallation.bahias) {
        elements.push(getElementValuesForBahias(bahia));
      }
      setElements(elements);
    }

    setTitle(title);
  }, [selectedValues]);

  const getConsignments = async () => {
    const iniDateStr = to_yyyy_mm_dd_hh_mm_ss(iniDate);
    const endDateStr = to_yyyy_mm_dd_hh_mm_ss(endDate);
    setLoading(true);
    let consignments = {} as ConsignmentKeyValue;
    for (const element of elements) {
      const resp = await getConsignmentsByIdAndRange(
        element.document_id,
        iniDateStr,
        endDateStr,
      );
      if (resp.success) {
        const description = `${element.type} ${element.name}`;
        consignments[description] = resp.consignaciones;
      }
    }
    setConsignmentsToEdit(consignments);
    setLoading(false);
  };

  return (
    <Card>
      <Card.Header className="cons-header">{title}</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group as={Row}>
            <Col sm="3" style={{ minWidth: "350px" }}>
              <Form.Label>Seleccione fecha de consulta: </Form.Label>
              <br></br>
              <DateRangeTime
                last_month={true}
                onPickerChange={(iniDate: Date, endDate: Date) =>
                  onPickerChange(iniDate, endDate)
                }
              ></DateRangeTime>
            </Col>

            <Col sm="1">
              <Form.Label></Form.Label>
              <br></br>
              <Button disabled={loading} onClick={getConsignments}>
                Consultar
              </Button>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col sm="12">
              <ConsignmentBoxes
                consignments={consignmentsToEdit}
                onReload={() => getConsignments()}
              />
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};
