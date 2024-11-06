import React, { useEffect, useState, useMemo, useCallback } from "react";
import "./App.css";
import BoardComponent from "./components/BoardComponent";
import { Board } from "./models/Board";
import { Player } from "./models/Player";
import { Colors } from "./models/Colors";
import LostFigures from "./components/LostFigures";
import Timer from "./components/Timer";
import { Cell } from './models/Cell';

const App = () => {
  const whitePlayer = useMemo(() => new Player(Colors.WHITE), []);
  const blackPlayer = useMemo(() => new Player(Colors.BLACK), []);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(whitePlayer);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [board, setBoard] = useState<Board>(new Board());

  useEffect(() => {
    restart();
  }, []);

  const restart = useCallback(() => {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigures();
    setBoard(newBoard);
    setSelectedCell(null);
    setCurrentPlayer(whitePlayer);
  }, [whitePlayer]);

  const swapPlayer = useCallback(() => {
    setCurrentPlayer((prev) =>
      prev.color === Colors.WHITE ? blackPlayer : whitePlayer
    );
  }, [blackPlayer, whitePlayer]);

  return (
    <div className="app">
      <Timer
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
        board={board}
        currentPlayer={currentPlayer}
        restart={restart}
        swapPlayer={swapPlayer}
      />
      <BoardComponent
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        swapPlayer={swapPlayer}
      />
      <div>
        <LostFigures title="Black figures" figures={board.lostBlackFigures} />
        <LostFigures title="White figures" figures={board.lostWhiteFigures} />
      </div>
    </div>
  );
};

export default App;
