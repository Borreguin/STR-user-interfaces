import { Col, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { SelectOption } from "./model";

export interface TypeAndNameOptions {
  nameOptionsByType: { [K: string]: SelectOption[] };
  typeOptions: SelectOption[];
}

interface TypeSelector {
  key: string;
  selectedOption: SelectOption | undefined;
  options: Array<SelectOption>;
  onSelection: any;
}

const RenderSelection = (props: TypeSelector): JSX.Element => {
  const { key, selectedOption, options, onSelection } = props;
  const [selectedValue, setSelectedValue] = useState<string>(
    selectedOption ? selectedOption.id : "",
  );
  useEffect(() => {
    if (selectedOption !== undefined) {
      setSelectedValue(selectedOption.id);
    }
  }, [selectedOption]);

  const _options = () => {
    if (
      selectedOption === undefined ||
      options.length === 0 ||
      selectedOption.value === undefined
    ) {
      return <option></option>;
    }
    return options.map((op) => (
      <option key={op.id} value={op.id}>
        {op.value}
      </option>
    ));
  };

  const _onSelection = (e) => {
    const id = e.target.value;
    const selectedOption = options.find((op) => op.id === id);
    setSelectedValue(id);
    onSelection(selectedOption);
  };

  return (
    <>
      <Form.Control
        key={key}
        as="select"
        size="sm"
        value={selectedValue}
        onChange={(e) => _onSelection(e)}
      >
        {_options()}
      </Form.Control>
    </>
  );
};

interface TypeNameSelector {
  label: string;
  typeAndNameOptions: TypeAndNameOptions;
  onSelection: any;
}

const renderAlert = (msg: string, type: string) => {
  return (
    <>
      <div className={`alert alert-${type}`} role="alert">
        {msg}
      </div>
    </>
  );
};

export const TypeNameSelector = (props: TypeNameSelector): JSX.Element => {
  const { label, typeAndNameOptions, onSelection } = props;
  const [selectedType, setSelectedType] = useState<SelectOption>(undefined);
  const [selectedName, setSelectedName] = useState<SelectOption>(undefined);
  const [nameOptions, setNameOptions] = useState<SelectOption[]>([]);
  const [lastNameOptionId, setLastNameOptionId] = useState<string>("");

  useEffect(() => {
    if (selectedType === undefined && typeAndNameOptions !== undefined) {
      const toTypeSelect = typeAndNameOptions.typeOptions[0];
      setNameOptionsByType(toTypeSelect);
    }
  }, []);

  useEffect(() => {
    if (selectedType !== undefined) {
      setNameOptionsByType(selectedType);
    }
  }, [selectedType]);

  useEffect(() => {
    if (
      selectedType !== undefined &&
      selectedName !== undefined &&
      lastNameOptionId !== selectedName.id
    ) {
      setLastNameOptionId(selectedName.id);
      onSelection(selectedType, selectedName);
    }
  }, [selectedType, selectedName]);

  useEffect(() => {
    if (
      typeAndNameOptions === undefined ||
      typeAndNameOptions.typeOptions === undefined ||
      typeAndNameOptions.typeOptions.length === 0 ||
      typeAndNameOptions.nameOptionsByType === undefined
    ) {
      setLastNameOptionId(undefined);
      return;
    }
    if (selectedType === undefined || selectedName === undefined) {
      const toTypeSelect = typeAndNameOptions.typeOptions[0];
      setNameOptionsByType(toTypeSelect);

      return;
    }
    findTypeAndNameOptions();
  }, [typeAndNameOptions]);

  const findTypeAndNameOptions = () => {
    let foundName: SelectOption;
    const foundType = typeAndNameOptions.typeOptions.find(
      (t) => t.id === selectedType.id,
    );
    if (typeAndNameOptions.nameOptionsByType[selectedType.id] !== undefined) {
      foundName = typeAndNameOptions.nameOptionsByType[selectedType.id].find(
        (n) => n.id === selectedName.id,
      );
    }
    // special case when the selected name is not in the list of names
    // and needs to change the selected type
    if (
      typeAndNameOptions.nameOptionsByType[selectedType.id] === undefined ||
      foundType === undefined ||
      foundName === undefined
    ) {
      const toTypeSelect = typeAndNameOptions.typeOptions[0];
      setSelectedType(toTypeSelect);
    }
    if (lastNameOptionId !== selectedName.id) {
      onSelection(selectedType, selectedName);
    }
  };

  const setNameOptionsByType = (toTypeSelect: SelectOption) => {
    if (
      toTypeSelect !== undefined &&
      typeAndNameOptions !== undefined &&
      typeAndNameOptions.nameOptionsByType[toTypeSelect.id] !== undefined
    ) {
      setSelectedType(toTypeSelect);
      setSelectedName(typeAndNameOptions.nameOptionsByType[toTypeSelect.id][0]);
      setNameOptions(typeAndNameOptions.nameOptionsByType[toTypeSelect.id]);
    }
  };

  if (typeAndNameOptions === undefined) {
    return renderAlert(`Cargando información de ${label}`, "info");
  }

  if (typeAndNameOptions && typeAndNameOptions.typeOptions?.length === 0) {
    return renderAlert(`No hay ${label} registrados`, "warning");
  }

  return (
    <>
      <Form.Label className="cons-label" id={label}>
        Seleccione {label}
      </Form.Label>
      <Form.Row id={label}>
        <Form.Group as={Col}>
          <RenderSelection
            key={`${label}-type`}
            selectedOption={selectedType}
            options={typeAndNameOptions.typeOptions}
            onSelection={(option: React.SetStateAction<SelectOption>) => {
              setSelectedType(option);
            }}
          />
        </Form.Group>
        <Form.Group as={Col}>
          <RenderSelection
            key={`${label}-name`}
            selectedOption={selectedName}
            options={nameOptions}
            onSelection={(option: React.SetStateAction<SelectOption>) => {
              setSelectedName(option);
            }}
          />
        </Form.Group>
      </Form.Row>
    </>
  );
};
