import React from "react";

interface RowValueProps {
  label: string;
  value: string;
  valueClassName?: string;
}

export const RowValue = (props: RowValueProps) => {
  const { label, value, valueClassName } = props;
  return (
    <div className="gr-sc-row">
      <div className="gr-sc-subtitle">{label}</div>
      <div
        className={
          valueClassName !== undefined ? valueClassName : "gr-sc-value"
        }
      >
        {value}
      </div>
    </div>
  );
};
