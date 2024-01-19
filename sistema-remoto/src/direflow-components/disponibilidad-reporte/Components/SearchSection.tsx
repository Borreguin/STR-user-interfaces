import { Button, Col, Form } from "react-bootstrap";
import React from "react";

interface SearchSectionProps {
  loading: boolean;
  placeholder: string;
  buttonText: string;
  onChangeText: Function;
  onClickSearch: Function;
  onUpdateSearch: Function;
}
export const SearchSection = (props: SearchSectionProps) => {
  const {
    onChangeText,
    onClickSearch,
    loading,
    buttonText,
    placeholder,
    onUpdateSearch,
  } = props;
  return (
    <div className={"search-container"}>
      <Button
        variant="outline-dark"
        onClick={() => onClickSearch()}
        disabled={loading}
        className="left-button"
      >
        {buttonText}
      </Button>
      <div>
        <Form.Control
          type="text"
          onChange={(e) => onChangeText(e.target.value)}
          onBlur={(e) => onUpdateSearch(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className={"search-input"}
        />
      </div>
    </div>
  );
};
