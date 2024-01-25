import React, { FC } from "react";
import { Spinner } from "react-bootstrap";

interface SpinnerAndTextProps {
  msg: string;
}

export const SpinnerAndText: FC<SpinnerAndTextProps> = (props) => {
  const { msg } = props;
  return (
    <>
      <Spinner
        className="pr-spinner"
        animation="border"
        role="status"
        size="sm"
      />
      <div className="pr-label"> {msg}</div>
    </>
  );
};
