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
  // const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  const click = useCallback(
    (cell: Cell) => {
      if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
        if (!board.isAvailableMove(selectedCell.figure, selectedCell, cell)) return;
        selectedCell.moveFigure(cell);
        swapPlayer();
        setSelectedCell(null);
        updateBoard();
      } else if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      } else {
        setSelectedCell(null);
      }
    },
    [selectedCell, board, swapPlayer, currentPlayer, setSelectedCell]
  );

  const updateBoard = useCallback(() => {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
    if (currentPlayer && newBoard.checkIsMate(currentPlayer.color)) {
      newBoard.isMate = true;
      console.log("Mate?!"); 
    }
  }, [board, setBoard, currentPlayer]);

  const highlightCells = useCallback(() => {
    board.highlightCells(selectedCell);
    updateBoard();
  }, [board, selectedCell, updateBoard]);

  useEffect(() => {
    highlightCells();
  }, [selectedCell, highlightCells]);

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
