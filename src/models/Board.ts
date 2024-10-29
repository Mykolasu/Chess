import { Cell } from "./Cell";
import { Colors } from "./Colors";
import { Queen } from "./figures/Queen";
import { Pawn } from "./figures/Pawn";
import { King } from "./figures/King";
import { Bishop } from "./figures/Bishop";
import { Knight } from "./figures/Knight";
import { Rook } from "./figures/Rook";
import { Figure } from "./figures/Figure";

export class Board {
  cells: Cell[][] = [];
  lostBlackFigures: Figure[] = [];
  lostWhiteFigures: Figure[] = [];
  isMate: boolean = false;

  whiteKing?: King;
  blackKing?: King;

  getOppositeColor(color: Colors) {
    return color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
  }

  public initCells() {
    for (let i = 0; i < 8; i++) {
      const row = Array.from({ length: 8 }, (_, j) =>
        new Cell(this, j, i, (i + j) % 2 === 0 ? Colors.WHITE : Colors.BLACK, null)
      );
      this.cells.push(row);
    }
  }

  public isCellUnderAttack(targetCell: Cell, enemyColor: Colors): boolean {
    return this.cells.some(row =>
      row.some(
        cell =>
          cell.figure &&
          cell.figure.color === enemyColor &&
          cell.figure.canMove(targetCell)
      )
    );
  }

  public isAvailableMove(figure: Figure, startCell: Cell, targetCell: Cell): boolean {
    const originalFigure = targetCell.figure;
    targetCell.figure = figure;
    const king = figure.color === Colors.WHITE ? this.whiteKing : this.blackKing;
    const isKingUnderAttack = king ? this.isCellUnderAttack(king.cell, this.getOppositeColor(king.color)) : false;

    targetCell.figure = originalFigure; // Revert target cell to its original state
    return !isKingUnderAttack;
  }

  public isFigureHasAnyMove(figure: Figure): boolean {
    return this.cells.some(row =>
      row.some(
        cell =>
          figure.canMove(cell) && this.isAvailableMove(figure, figure.cell, cell)
      )
    );
  }

  public checkIsMate(playerColor: Colors): boolean {
    return !this.cells.some(row =>
      row.some(
        cell =>
          cell.figure &&
          cell.figure.color === playerColor &&
          this.isFigureHasAnyMove(cell.figure)
      )
    );
  }

  public getCopyBoard(): Board {
    const newBoard = new Board();
    Object.assign(newBoard, this, { cells: this.cells });
    return newBoard;
  }

  public highLightCells(selectedCell: Cell | null) {
    this.cells.forEach(row =>
      row.forEach(
        target =>
          (target.available = !!(
            selectedCell?.figure?.canMove(target) &&
            this.isAvailableMove(selectedCell.figure, selectedCell, target)
          ))
      )
    );
  }
  public getCell(x: number, y: number) {
    return this.cells[y][x];
  }

  private addFigure(
    FigureClass: typeof Figure,
    color: Colors,
    positions: [number, number][]
  ) {
    positions.forEach(([x, y]) => new FigureClass(color, this.getCell(x, y)));
  }

  public addFigures() {
    const figureConfig = [
      { figure: Pawn, color: Colors.BLACK, positions: Array.from({ length: 8 }, (_, i): [number, number] => [i, 1]) },
      { figure: Pawn, color: Colors.WHITE, positions: Array.from({ length: 8 }, (_, i): [number, number] => [i, 6]) },
      { figure: Knight, color: Colors.BLACK, positions: [[1, 0], [6, 0]] as [number, number][] },
      { figure: Knight, color: Colors.WHITE, positions: [[1, 7], [6, 7]] as [number, number][] },
      { figure: Bishop, color: Colors.BLACK, positions: [[2, 0], [5, 0]] as [number, number][] },
      { figure: Bishop, color: Colors.WHITE, positions: [[2, 7], [5, 7]] as [number, number][] },
      { figure: Queen, color: Colors.BLACK, positions: [[3, 0]] as [number, number][] },
      { figure: Queen, color: Colors.WHITE, positions: [[3, 7]] as [number, number][] },
      { figure: Rook, color: Colors.BLACK, positions: [[0, 0], [7, 0]] as [number, number][] },
      { figure: Rook, color: Colors.WHITE, positions: [[0, 7], [7, 7]] as [number, number][] },
    ];    

    figureConfig.forEach(({ figure, color, positions }) =>
      this.addFigure(figure, color, positions)
    );

    // Assign kings separately to track their positions
    this.whiteKing = new King(Colors.WHITE, this.getCell(4, 7));
    this.blackKing = new King(Colors.BLACK, this.getCell(4, 0));
  }
}
