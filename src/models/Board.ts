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
    this.cells = Array.from({ length: 8 }, (_, i) =>
      Array.from({ length: 8 }, (_, j) => new Cell(this, j, i, (i + j) % 2 !== 0 ? Colors.BLACK : Colors.WHITE, null))
    );
  }

  public isCellUnderAttack(targetCell: Cell, enemyColor: Colors): boolean {
    return this.cells.some((row) =>
      row.some((cell) =>
        cell.figure && cell.figure.color === enemyColor && cell.figure.canMove(targetCell)
      )
    );
  }

  public isAvailableMove(figure: Figure, startCell: Cell, targetCell: Cell): boolean {
    const originalTargetFigure = targetCell.figure;
    targetCell.figure = figure;
    startCell.figure = null;
    figure.cell = targetCell;

    const king = figure.color === Colors.WHITE ? this.whiteKing : this.blackKing;
    const isKingUnderAttack = this.isCellUnderAttack(king!.cell, this.getOppositeColor(king!.color));

    targetCell.figure = originalTargetFigure;
    startCell.figure = figure;
    figure.cell = startCell;

    return !isKingUnderAttack;
  }

  isFigureHasAnyMove(figure: Figure): boolean {
    return this.cells.some(row =>
      row.some(targetCell =>
        figure.canMove(targetCell) && this.isAvailableMove(figure, figure.cell, targetCell)
      )
    );
  }

  checkIsMate(playerColor: Colors): boolean {
    return !this.cells.some(row =>
      row.some(cell =>
        cell.figure &&
        cell.figure.color === playerColor &&
        this.isFigureHasAnyMove(cell.figure)
      )
    );
  }

  public getCopyBoard(): Board {
    const newBoard = new Board();
    newBoard.isMate = this.isMate;
    newBoard.cells = this.cells;
    newBoard.lostWhiteFigures = this.lostWhiteFigures;
    newBoard.lostBlackFigures = this.lostBlackFigures;
    newBoard.whiteKing = this.whiteKing;
    newBoard.blackKing = this.blackKing;
    return newBoard;
  }

  public highLightCells(selectedCell: Cell | null) {
    this.cells.forEach(row =>
      row.forEach(target => {
        target.available = !!(
          selectedCell?.figure?.canMove(target) &&
          this.isAvailableMove(selectedCell.figure, selectedCell, target)
        );
      })
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
    this.addFigure(
      Pawn,
      Colors.BLACK,
      Array(8)
        .fill(0)
        .map((_, i) => [i, 1])
    );
    this.addFigure(
      Pawn,
      Colors.WHITE,
      Array(8)
        .fill(0)
        .map((_, i) => [i, 6])
    );

    this.addFigure(Knight, Colors.BLACK, [
      [1, 0],
      [6, 0],
    ]);
    this.addFigure(Knight, Colors.WHITE, [
      [1, 7],
      [6, 7],
    ]);

    const blackKing = new King(Colors.BLACK, this.getCell(4, 0));
    const whiteKing = new King(Colors.WHITE, this.getCell(4, 7));
    this.blackKing = blackKing;
    this.whiteKing = whiteKing;

    this.addFigure(Bishop, Colors.BLACK, [
      [2, 0],
      [5, 0],
    ]);
    this.addFigure(Bishop, Colors.WHITE, [
      [2, 7],
      [5, 7],
    ]);

    this.addFigure(Queen, Colors.BLACK, [[3, 0]]);
    this.addFigure(Queen, Colors.WHITE, [[3, 7]]);

    this.addFigure(Rook, Colors.BLACK, [
      [0, 0],
      [7, 0],
    ]);
    this.addFigure(Rook, Colors.WHITE, [
      [0, 7],
      [7, 7],
    ]);
  }
}
