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
  const [modal, setModal] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    stopTimer();
    timer.current = setInterval(() => {
      if (currentPlayer?.color === Colors.WHITE) {
        setWhiteTime((prev) => prev - 1);
      } else {
        setBlackTime((prev) => prev - 1);
      }
    }, 1000);
  }, [currentPlayer]);

  const stopTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    if (whiteTime > 0 && blackTime > 0) {
      startTimer();
    }

    return () => stopTimer(); 
  }, [currentPlayer, startTimer]);

  useEffect(() => {
    if (whiteTime === 0 || blackTime === 0 || board.isMate) {
      stopTimer();
      setModal(true);
    }
  }, [whiteTime, blackTime, board, stopTimer]);

  const handleRestart = useCallback(() => {
    setSelectedCell(null);
    setWhiteTime(180);
    setBlackTime(180);
    setModal(false);
    restart();
  }, [restart, setSelectedCell]);

  return (
    <div style={{ width: 150 }}>
      <h3>The Black - {blackTime}</h3>
      <div style={{ padding: 10 }}>
        <button onClick={handleRestart}>Restart game</button>
        {modal && (
          <EndOfTheGame
            setSelectedCell={setSelectedCell}
            board={board}
            restart={handleRestart}
            visible={modal}
            setVisible={setModal}
            currentPlayer={currentPlayer}
          />
        )}
      </div>
      <h3>The White - {whiteTime}</h3>
    </div>
  );
};

export default Timer;
