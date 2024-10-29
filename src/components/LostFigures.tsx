import React, { FC } from "react";
import { Figure } from "../models/figures/Figure";

interface LostFiguresProps {
  title: string;
  figures: Figure[];
}

const LostFigures: FC<LostFiguresProps> = ({ title, figures }) => {
 
  const figureCount: { [name: string]: { figure: Figure; count: number } } = {};

  figures.forEach((figure) => {
    if (figureCount[figure.name]) {
      figureCount[figure.name].count += 1;
    } else {
      figureCount[figure.name] = { figure, count: 1 };
    }
  });

  return (
    <div className="lost">
      <h4>{title}</h4>
      {Object.values(figureCount).map(({ figure, count }) => (
        <div key={figure.id}>
          {figure.name}
          {figure.logo && <img width={20} height={20} src={figure.logo} />}
          {count > 1 && `х ${count}`}
        </div>
      ))}
    </div>
  );
};

export default LostFigures;
