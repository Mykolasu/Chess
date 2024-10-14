import React, { FC, useEffect, useRef, useState } from "react";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";

interface TimerProps {
  currentPlayer: Player | null;
  restart: () => void;
}

const Timer: FC<TimerProps> = ({ currentPlayer, restart }) => {
  const [blackTime, setBlackTime] = useState(180);
  const [whiteTime, setWhiteTime] = useState(180);
  const timer = useRef<null | ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    startTimer();
  }, [currentPlayer]);

  function startTimer() {
    if (timer.current) {
      clearInterval(timer.current);
    }
    const callback =
      currentPlayer?.color === Colors.WHITE
        ? decrementWhiteTimer
        : decrementBlackTimer;
    timer.current = setInterval(callback, 1000);
  }

  function decrementBlackTimer() {
    setBlackTime((prev) => {
      if (prev <= 1) {
        clearInterval(timer.current!);
        alert("Time is up. Player WHITE is the winner!");
        return 0;
      }
      return prev - 1;
    });
  }

  function decrementWhiteTimer() {
    setWhiteTime((prev) => {
      if (prev <= 1) {
        clearInterval(timer.current!); 
        alert("Time is up. Player BLACK is the winner!");
        return 0;
      }
      return prev - 1;
    });
  }

  const handleRestart = () => {
    setBlackTime(180);
    setWhiteTime(180);
    restart();
  };

  return (
    <div style={{ width: 150 }}>
      <h3>The Black - {blackTime}</h3>
      <div style={{ padding: 10 }}>
        <button onClick={handleRestart}>Restart game</button>
      </div>
      <h3>The White - {whiteTime}</h3>
    </div>
  );
};

export default Timer;