import React, { FC, useContext, useState } from "react";
import { EventContext, Styled } from "direflow-component";
import styles from "./App.css";
import { Card, Tab, Tabs } from "react-bootstrap";
import RecalDisponibilidad from "./recalculo_disponibilidad/main_page";
import react_picker from "react-datepicker/dist/react-datepicker.css";


interface IProps {
  componentTitle: string;
  sampleList: string[];
}

const App: FC<IProps> = (props) => {
  const dispatch = useContext(EventContext);
  const [key, setKey] = useState("page3");

  const handleClick = () => {
    const event = new Event("my-event");
    dispatch(event);
  };

  const renderSampleList = props.sampleList.map((sample: string) => (
    <div key={sample} className="sample-text">
      → {sample}
    </div>
  ));

  return (
    <Styled styles={[styles, react_picker]}>
      <div className="page-content">
        <div className="border">
          <Card>
            <Tabs
              id="configuration-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="page1" title="Supervisión diaria">
                <div>Hello</div>
              </Tab>
              <Tab eventKey="page2" title="Supervisión acumulada">
                <div>Profile</div>
              </Tab>
              <Tab eventKey="page3" title="Recálculo disponibilidad">
                <RecalDisponibilidad/>
              </Tab>
            </Tabs>
          </Card>
        </div>
      </div>
    </Styled>
  );
};

App.defaultProps = {
  componentTitle: "Sistema Remoto",
  sampleList: [
    "Componente creado en React (yarn start)",
    "Construido como Componente Web (yarn build)",
    "Compilado y usado en cualquier lugar (build/ComponentBundle.js)",
  ],
};

export default App;
