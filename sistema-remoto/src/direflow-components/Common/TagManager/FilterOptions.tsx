import React, { useEffect, useState } from "react";
import { BahiaElement, selectedElements, TAG } from "../GeneralTypes";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { searchTags } from "../FetchData/V2SRFetchData";
import { CheckBoxMapType } from "./CheckBoxSection";

interface FilterOptionsProps {
  selectedValues: selectedElements;
  onSelection: Function;
  onFilterTags?: Function;
  onSaveTags?: Function;
}

export function FilterOptions(props: FilterOptionsProps) {
  const { onSelection, selectedValues, onSaveTags, onFilterTags } = props;
  const bahias = selectedValues.selectedInstallation.bahias;
  const selectedInstallation = selectedValues.selectedInstallation;

  const [emsCode, setEmsCode] = useState("");
  const [bahiaCode, setBahiaCode] = useState("");
  const [voltage, setVoltage] = useState("");
  const [regEx, setRegEx] = useState(".*");

  useEffect(() => {
    const emsCode = selectedValues.selectedInstallation.instalacion_ems_code;
    const bahiaCode =
      selectedValues.selectedInstallation?.bahias.length > 0
        ? selectedValues.selectedInstallation?.bahias[0].bahia_code
        : "";
    const voltage =
      selectedValues.selectedInstallation?.bahias.length > 0
        ? selectedValues.selectedInstallation?.bahias[0].voltaje
        : "";
    setEmsCode(emsCode);
    setBahiaCode(bahiaCode);
    setVoltage(`${voltage}`);
    handleOnChange(`${bahiaCode}@${voltage}`);
  }, [selectedValues]);

  useEffect(() => {
    const _bahiaCode = getBahiaCode(bahiaCode);
    const _regEx = `${emsCode}.*(${voltage})?.*(${_bahiaCode}).*(${voltage})?.*[Q]$`;
    setRegEx(_regEx);
  }, [emsCode, bahiaCode, voltage]);

  const handleOnChange = (bahiaCode: string) => {
    setBahiaCode(bahiaCode);
    if (selectedInstallation.bahias && selectedInstallation.bahias.length > 0) {
      const bahia = selectedInstallation.bahias.find(
        (b: BahiaElement) => genKey(b) === bahiaCode,
      );
      if (bahia) {
        onSelection(bahia);
        setVoltage(`${bahia.voltaje}`);
      } else {
        onSelection(null);
      }
    }
  };
  const genKey = (bahia: BahiaElement) => {
    return `${bahia.bahia_code}@${bahia.voltaje}`;
  };
  const getBahiaCode = (key: string) => {
    const value = key.split("@");
    return value[0];
  };
  const renderBahiasOptions = () => {
    return (
      <Form.Control
        as={"select"}
        size={"sm"}
        className={"select-bahia"}
        onChange={(e) => handleOnChange(e.target.value)}
      >
        {bahias.map((bahia, ix) => (
          <option
            key={`${bahia.bahia_code}-${bahia.bahia_nombre}-${ix}`}
            value={genKey(bahia)} // value that is going to be selected
          >
            {bahia.bahia_nombre} - {bahia.voltaje}
          </option>
        ))}
      </Form.Control>
    );
  };

  const handlePIServerRequest = () => {
    const code = regEx.split(".*");
    const filter = code.length > 0 ? `${code[0]}*` : `${regEx}`;
    if (filter.length < 5) {
      const tagMap = {
        0: {
          id: 0,
          checked: false,
          toSearch: 0,
          tagName: "No tags found",
          value: "Ingrese un filtro válido, al menos 4 caracteres",
        },
      };
      onFilterTags(tagMap);
      return;
    }

    searchTags(filter, regEx).then((response) => {
      if (response.success && onFilterTags) {
        const tagMap = {} as CheckBoxMapType;
        for (const tag of response.tags) {
          tagMap[tag.id] = {
            id: tag.id,
            checked: false,
            toSearch: tag.id,
            tagName: tag.name,
            value: `${tag.name} - [${tag.timestamp}] - ${tag.value}`,
          };
        }
        onFilterTags(tagMap);
      } else {
        onFilterTags({} as CheckBoxMapType);
      }
    });
  };

  const handleSaveTags = () => {
    if (onSaveTags) {
      onSaveTags();
    }
  };

  return (
    <Card>
      <Card.Body>
        <Form>
          <div className={"ft-bahia-selector"}>
            <div>Seleccionar Bahía:</div>
            {renderBahiasOptions()}
          </div>
          <Row>
            <Col>
              <Form.Control
                size="sm"
                type="text"
                placeholder="EMS Code"
                value={emsCode}
                onChange={(e) => setEmsCode(e.target.value)}
              ></Form.Control>
            </Col>
            <Col>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Bahia Code"
                value={getBahiaCode(bahiaCode)}
                onChange={(e) => setBahiaCode(e.target.value)}
              ></Form.Control>
            </Col>
            <Col>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Voltaje"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
              ></Form.Control>
            </Col>
          </Row>
        </Form>
      </Card.Body>
      <Card.Footer>
        <Form>
          <div className={"btns-cotainer"}>
            <Button variant="success" onClick={handlePIServerRequest}>
              Buscar tags
            </Button>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Filtro: Regex"
              className="filter-input"
              value={regEx}
              onChange={(e) => setRegEx(e.target.value)}
            ></Form.Control>
            <Button variant="warning" onClick={() => handleSaveTags()}>
              Guardar cambios
            </Button>
          </div>
        </Form>
      </Card.Footer>
    </Card>
  );
}
