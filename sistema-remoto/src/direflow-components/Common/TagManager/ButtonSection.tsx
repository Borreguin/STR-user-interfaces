import React from "react";

interface ButtonSectionProps {
  moveToRightClick?: () => void;
  moveToLeftClick?: () => void;
  onClearClick?: () => void;
}

export const ButtonSection = (props: ButtonSectionProps) => {
  const { moveToRightClick, moveToLeftClick, onClearClick } = props;
  function onRightHandler() {
    moveToRightClick();
  }

  function onLeftHandler() {
    moveToLeftClick();
  }

  function onClearHandler() {
    onClearClick();
  }

  return (
    <div className="buttons-direction">
      <div>
        <button onClick={onLeftHandler} className="direction-button">
          {"<"}
        </button>
        <button onClick={onRightHandler} className="direction-button">
          {">"}
        </button>
      </div>
      <button onClick={onClearHandler} className="centralbutton">
        Clear all
      </button>
    </div>
  );
};
