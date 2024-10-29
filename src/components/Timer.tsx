import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";
import { Board } from "../models/Board";
import { Cell } from "../models/Cell";
import EndOfTheGame from "./modal/endOfTheGame";

interface TimerProps {
  board: Board;
  selectedCell: Cell | null;
  currentPlayer: Player | null;
  restart: () => void;
  swapPlayer: () => void;
  setSelectedCell: (cell: Cell | null) => void;
}

const Timer: FC<TimerProps> = ({
  setSelectedCell,
  selectedCell,
  board,
  currentPlayer,
  restart,
  swapPlayer,
}) => {
  const [blackTime, setBlackTime] = useState(180);
  const [whiteTime, setWhiteTime] = useState(180);
  const timer = useRef<null | ReturnType<typeof setInterval>>(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (whiteTime > 0 && blackTime > 0) startTimer();
  }, [currentPlayer]);

  useEffect(() => {
    createModalEndGame();
  }, [whiteTime, blackTime, board]);

  const startTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    const callback =
      currentPlayer?.color === Colors.WHITE
        ? decrementWhiteTimer
        : decrementBlackTimer;
    timer.current = setInterval(callback, 1000);
  }, [currentPlayer]);

  const stopTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  const decrementBlackTimer = useCallback(() => {
    setBlackTime((prev) => prev - 1);
  }, []);

  const decrementWhiteTimer = useCallback(() => {
    setWhiteTime((prev) => prev - 1);
  }, []);

  const handleRestart = () => {
    setSelectedCell(null);
    setWhiteTime(180);
    setBlackTime(180);
    setModal(false);
    restart();
  };

  const createModalEndGame = useCallback(() => {
    if (whiteTime === 0 || blackTime === 0 || board.isMate) {
      stopTimer();
      setModal(true);
    }
  }, [whiteTime, blackTime, board, stopTimer]);

  return (
    <div style={{ width: 150 }}>
      <h3>The Black - {blackTime}</h3>
      <div style={{ padding: 10 }}>
        <button onClick={handleRestart}>Restart game</button>
        <div>
          <EndOfTheGame
            setSelectedCell={setSelectedCell}
            board={board}
            restart={handleRestart}
            visible={modal}
            setVisible={setModal}
            currentPlayer={currentPlayer}
          ></EndOfTheGame>
        </div>
      </div>
      <h3>The White - {whiteTime}</h3>
    </div>
  );
};

export default Timer;
