import { Board } from "./Board";

class CheckMateChecker {
  static isCheckMate(board: Board): boolean {
    // Loop through all cells on the board
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const cell = board.getCell(i, j);
        
        // Skip cells without figures
        if (!cell?.figure) continue;

        // Check all possible moves for each figure
        for (let x = 0; x < 8; x++) {
          for (let y = 0; y < 8; y++) {
            const targetCell = board.getCell(x, y);

            // If a move is available, it's not checkmate
            if (board.isAvailableMove(cell.figure, cell, targetCell)) {
              return false;
            }
          }
        }
      }
    }
    // If no move is available, it's checkmate
    return true;
  }
}

export default CheckMateChecker;
