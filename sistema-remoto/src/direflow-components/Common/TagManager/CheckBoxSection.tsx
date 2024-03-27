import React, { useEffect, useState } from "react";
import { Badge, Button, Form } from "react-bootstrap";

export type CheckBoxType = {
  id: string;
  checked: boolean;
  toSearch: string;
  tagName: string;
  value: string | number | null;
};

export type CheckBoxMapType = { [chId: string]: CheckBoxType };
interface CheckBoxSectionProps {
  checkMap: CheckBoxMapType;
  clearAll: boolean;
  title: string;
  moveSelected?: boolean;
  onClearAll: Function;
  onMoveSelected?: Function;
}

export const CheckBoxSection = (props: CheckBoxSectionProps) => {
  const {
    clearAll,
    onClearAll,
    checkMap,
    title,
    moveSelected,
    onMoveSelected,
  } = props;
  const [checkBoxes, setCheckBoxes] = useState(checkMap as CheckBoxMapType);
  const [selectedCheckBoxes, setSelectedCheckBoxes] = useState(
    {} as CheckBoxMapType,
  );
  const [filterCheckBoxes, setFilterCheckBoxes] = useState(
    checkMap as CheckBoxMapType,
  );
  const [toSearch, setToSearch] = useState("");

  useEffect(() => {
    if (moveSelected) {
      if (onMoveSelected !== undefined) {
        onMoveSelected(selectedCheckBoxes);
      }
      moveSelectedCheckBoxes();
    }
  }, [moveSelected]);

  useEffect(() => {
    if (clearAll) {
      handleClearAll();
    }
  }, [clearAll]);

  useEffect(() => {
    if (checkMap !== undefined) {
      if (Object.keys(selectedCheckBoxes).length > 0) {
        setCheckBoxes({ ...checkMap, ...selectedCheckBoxes });
        setFilterCheckBoxes({ ...checkMap, ...selectedCheckBoxes });
      } else {
        setCheckBoxes(checkMap);
      }
      const newSelectedCheckBoxes = { ...selectedCheckBoxes };
      for (const key in checkMap) {
        if (checkMap[key].checked) {
          newSelectedCheckBoxes[key] = checkMap[key];
        }
      }
      setSelectedCheckBoxes(newSelectedCheckBoxes);
    }
  }, [checkMap]);

  useEffect(() => {
    if (toSearch === undefined || toSearch === "") {
      setFilterCheckBoxes({ ...checkMap, ...selectedCheckBoxes });
    } else {
      setFilterCheckBoxes({ ...checkMap, ...selectedCheckBoxes });
      handleOnChange(toSearch);
    }
  }, [checkBoxes]);

  const handleCheckBoxChange = (id: string) => {
    const newCheckBoxes = { ...checkBoxes };
    if (!newCheckBoxes[id]) {
      return;
    }
    newCheckBoxes[id].checked = !newCheckBoxes[id].checked;
    setCheckBoxes(newCheckBoxes);
    if (newCheckBoxes[id].checked) {
      setSelectedCheckBoxes({ ...selectedCheckBoxes, [id]: newCheckBoxes[id] });
    } else {
      const newSelectedCheckBoxes = { ...selectedCheckBoxes };
      delete newSelectedCheckBoxes[id];
      setSelectedCheckBoxes(newSelectedCheckBoxes);
    }
  };

  const handleClearAll = () => {
    const newCheckBoxes = { ...checkBoxes };
    Object.keys(newCheckBoxes).forEach((key) => {
      newCheckBoxes[key].checked = false;
    });
    setCheckBoxes(newCheckBoxes);
    setSelectedCheckBoxes({});
    if (onClearAll !== undefined) {
      onClearAll();
    }
  };
  const handleSetSelected = (state: boolean) => {
    const newSelectedCheckBoxes = { ...selectedCheckBoxes };
    const newFilterCheckBoxes = { ...filterCheckBoxes };
    Object.keys(filterCheckBoxes).forEach((key) => {
      if (!newSelectedCheckBoxes[key] && state) {
        newSelectedCheckBoxes[key] = checkBoxes[key];
        newSelectedCheckBoxes[key].checked = state;
      }
      if (newSelectedCheckBoxes[key] && !state) {
        delete newSelectedCheckBoxes[key];
        newFilterCheckBoxes[key].checked = false;
      }
    });
    setSelectedCheckBoxes(newSelectedCheckBoxes);
    setFilterCheckBoxes(newFilterCheckBoxes);
  };

  const handleOnChange = (toSearch: string) => {
    if (toSearch === undefined || toSearch === " ") {
      setFilterCheckBoxes(checkMap);
      return;
    }
    setToSearch(toSearch);
    // filter checkboxes using regex  using toSearch
    const escapedText = toSearch.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); // Escape special characters

    const newFilterCheckBoxes = { ...checkBoxes };
    try {
      const regex = new RegExp(toSearch, "i");
      Object.keys(newFilterCheckBoxes).forEach((key) => {
        if (!regex.test(newFilterCheckBoxes[key].toSearch.toLowerCase())) {
          delete newFilterCheckBoxes[key];
        }
      });
    } catch (e) {
      const regex = new RegExp(escapedText, "i");
      Object.keys(newFilterCheckBoxes).forEach((key) => {
        if (!regex.test(newFilterCheckBoxes[key].toSearch.toLowerCase())) {
          delete newFilterCheckBoxes[key];
        }
      });
    }
    setFilterCheckBoxes(newFilterCheckBoxes);
  };

  const moveSelectedCheckBoxes = () => {
    const newCheckBoxes = { ...checkBoxes };
    const newFilterCheckBoxes = { ...filterCheckBoxes };
    Object.keys(selectedCheckBoxes).forEach((key) => {
      if (newCheckBoxes[key] && newFilterCheckBoxes[key]) {
        delete newFilterCheckBoxes[key];
        delete newCheckBoxes[key];
      }
    });
    setCheckBoxes(newCheckBoxes);
    setFilterCheckBoxes(newFilterCheckBoxes);
    setSelectedCheckBoxes({});
  };

  const renderControlButtons = () => {
    return (
      <div className={"chk-button-container"}>
        <div>
          <button onClick={handleClearAll} className="chk-buttons">
            Clear All
          </button>
          <button
            onClick={() => handleSetSelected(true)}
            className="chk-buttons"
          >
            Select filtered
          </button>
          <button
            onClick={() => handleSetSelected(false)}
            className="chk-buttons"
          >
            Clear filtered
          </button>
        </div>
        <div>
          <Badge variant="info">
            {Object.keys(selectedCheckBoxes).length}/
            {Object.keys(checkBoxes).length}
          </Badge>
        </div>
      </div>
    );
  };

  const renderCheckBoxes = () => {
    const orderedCheckBoxes = Object.keys(filterCheckBoxes).sort(
      (a, b) => parseFloat(a) - parseFloat(b),
    );
    return (
      <div className="chk-section">
        {filterCheckBoxes &&
          orderedCheckBoxes.map(
            (chId) =>
              checkBoxes[chId] && (
                <Form.Check
                  type="checkbox"
                  className="chk-values"
                  label={checkBoxes[chId].value}
                  name={checkBoxes[chId].toSearch}
                  defaultValue={checkBoxes[chId].value}
                  checked={checkBoxes[chId].checked}
                  onChange={() => handleCheckBoxChange(chId)}
                  id={chId}
                  key={chId}
                />
              ),
          )}
      </div>
    );
  };

  return (
    <div>
      {renderControlButtons()}
      <div className="chk-title">{title}</div>
      <div className={"chk-search-section"}>
        <Form.Control
          type="text"
          placeholder="Filtrar lista"
          className="chk-search-box"
          value={toSearch}
          onChange={(e) => handleOnChange(e.target.value)}
        ></Form.Control>
        <Button variant="outline-secondary" onClick={() => handleOnChange("")}>
          x
        </Button>
      </div>
      {renderCheckBoxes()}
    </div>
  );
};
