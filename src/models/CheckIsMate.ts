import { Board } from "./Board";
import { Cell } from "./Cell";
import { Figure } from "./figures/Figure";
import { Colors } from "./Colors";

class CheckMateChecker {
  static isCheckMate(board: Board, playerColor: Colors): boolean {
    // We get the figures of the current player
    const playerFigures = board.cells
      .flat()
      .filter((cell: Cell) => cell.figure?.color === playerColor)
      .map((cell: Cell) => cell.figure!) as Figure[];

    // We check whether there is at least one available move for any figure
    for (const figure of playerFigures) {
      const { cell } = figure;
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const targetCell = board.getCell(x, y);
          if (board.isAvailableMove(figure, cell, targetCell)) {
            return false; 
          }
        }
      }
    }
    return true;
  }
}

export default CheckMateChecker;
