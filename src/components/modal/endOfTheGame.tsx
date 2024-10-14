import React, { FC } from "react";
import cl from "./endOfTheGame.module.css";
import { Colors } from "../../models/Colors";
import { Player } from "../../models/Player";
import { Board } from "../../models/Board";
import { Cell } from "../../models/Cell";

interface EndOfTheGameProps {
  setSelectedCell: (cell: Cell | null) => void;
  board: Board;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  currentPlayer: Player | null;
  restart: () => void;
}

const EndOfTheGame: FC<EndOfTheGameProps> = ({
  board,
  restart,
  visible,
  setVisible,
  currentPlayer,
  setSelectedCell,
}) => {
  const rootClasses = [cl.myModal];
  if (visible) rootClasses.push(cl.active);

  const winner = currentPlayer?.color === Colors.WHITE
    ? board.isMate ? "White is checkmated and loses the game" : "White player your time is up"
    : board.isMate ? "Black is checkmated and loses the game" : "Black player your time is up";

  const newGameStart = () => {
    restart();
    setSelectedCell(null);
    setVisible(false);
  };

  return (
    <div className={rootClasses.join(" ")}>
      <div
        className={cl.myModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{winner}</h3>
        <button className="c-button" onClick={newGameStart}>
          restart
        </button>
      </div>
    </div>
  );
};

export default EndOfTheGame;
