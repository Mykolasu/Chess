import React, { FC, useMemo, useCallback } from "react";
import cl from "./styleModalEndGame.module.css";
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

  const winnerMessage = useMemo(() => {
    if (!currentPlayer) return "";
    const playerColor = currentPlayer.color === Colors.WHITE ? "White" : "Black";
    const loseCondition = board.isMate ? "is checkmated and loses the game" : "player, your time is up";
    return `${playerColor} ${loseCondition}`;
  }, [currentPlayer, board.isMate]);

  const newGameStart = useCallback(() => {
    restart();
    setSelectedCell(null);
    setVisible(false);
  }, [restart, setSelectedCell, setVisible]);

  return (
    <div className={rootClasses.join(" ")}>
      <div
        className={cl.myModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{winnerMessage}</h3>
        <button className="c-button" onClick={newGameStart}>
          restart
        </button>
      </div>
    </div>
  );
};

export default EndOfTheGame;
