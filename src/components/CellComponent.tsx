import React, { FC } from "react";
import { Cell } from "../models/Cell";

interface CellProps {
  cell: Cell;
  selected: boolean;
  click: (cell: Cell) => void;
}

const CellComponent: FC<CellProps> = ({ cell, selected, click }) => {
  
  const handleClick = () => click(cell);

  const cellClass = `cell ${cell.color} ${selected ? "selected" : ""} ${
    cell.available && cell.figure ? "highlight" : ""
  }`;

  return (
    <div className={cellClass} onClick={handleClick}>
      {cell.available && !cell.figure && <div className="available" />}
      {cell.figure?.logo && <img src={cell.figure.logo} alt="figure logo" />}
    </div>
  );
};

export default CellComponent;
