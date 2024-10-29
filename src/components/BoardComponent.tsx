import React, { FC, useCallback, useEffect, useState } from "react";
import { Board } from "../models/Board";
import CellComponent from "./CellComponent";
import { Cell } from "../models/Cell";
import { Player } from "../models/Player";

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
  setSelectedCell: (cell: Cell | null) => void;
  selectedCell: Cell | null;
}

const BoardComponent: FC<BoardProps> = ({
  board,
  setBoard,
  currentPlayer,
  swapPlayer,
  setSelectedCell,
  selectedCell,
}) => {
  function click(cell: Cell) {
    if (
      selectedCell &&
      selectedCell !== cell &&
      selectedCell.figure?.canMove(cell)
    ) {
      if (!board.isAvailableMove(selectedCell.figure, selectedCell, cell))
        return;
      selectedCell?.moveFigure(cell);
      swapPlayer();
      setSelectedCell(null);
      updateBoard();
    } else {
      if (cell.figure?.color === currentPlayer?.color) setSelectedCell(cell);
    }
    if (selectedCell) {
      setSelectedCell(null);
    }
    if (selectedCell === null && !cell.figure) {
      setSelectedCell(null);
    }
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
    if (currentPlayer && newBoard.checkIsMate(currentPlayer.color)) {
      newBoard.isMate = true;
    }
  } 

  function highLightCells() {
    board.highLightCells(selectedCell);
    updateBoard();
  }

  useEffect(() => {
    highLightCells();
  }, [selectedCell]);

  return (
    <div>
      <h4>Current player {currentPlayer?.color}</h4>
      <div className="board">
        {board.cells.map((row, index) => (
          <React.Fragment key={index}>
            {row.map((cell) => (
              <CellComponent
                click={click}
                cell={cell}
                key={cell.id}
                selected={
                  cell.x === selectedCell?.x && cell.y === selectedCell?.y
                }
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BoardComponent;
