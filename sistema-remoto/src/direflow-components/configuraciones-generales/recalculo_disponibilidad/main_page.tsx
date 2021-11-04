import * as React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { DateRange } from "../../Common/DatePicker/DateRange";

interface IRecalDisponibilidadProps {}

const RecalDisponibilidad: React.FunctionComponent<IRecalDisponibilidadProps> =
  (props) => {
    const _on_picker_change = (ini_date, end_date) => {
      console.log(ini_date, end_date);
    };

    return (
      <Card>
        <Form>
          <Row>
            <Col className="btn-aplicar">
              <Button className="btn-app" variant="success">
                Consultar
              </Button>
            </Col>
            <Col className="btn-aplicar">
              <Button className="btn-app" variant="warning">
                Recálculo
              </Button>
            </Col>
            <Col>
              <DateRange
                last_month={true}
                onPickerChange={_on_picker_change}
              ></DateRange>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };

export default RecalDisponibilidad;
