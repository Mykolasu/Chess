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
      const row: Cell[] = [];
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 !== 0) {
          row.push(new Cell(this, j, i, Colors.BLACK, null));
        } else {
          row.push(new Cell(this, j, i, Colors.WHITE, null));
        }
      }
      this.cells.push(row);
    }
  }

  public isCellUnderAttack(targetCell: Cell, enemyColor: Colors): boolean {
    for (let i = 0; i < this.cells.length; i++) {
      let row = this.cells[i];
      let cellWithCheckFigure = row.find(
        (cell) =>
          cell.figure &&
          cell.figure.color === enemyColor &&
          cell.figure.canMove(targetCell)
      );
      if (cellWithCheckFigure) return true;
    }
    return false;
  }

  public isAvailableMove(
    figure: Figure,
    startCell: Cell,
    targetCell: Cell
  ): boolean {
    let targetFigure = targetCell.figure;
    targetCell.figure = figure;
    figure.cell = targetCell;
    startCell.figure = null;
    let king: any;
    if (figure.color === Colors.WHITE) {
      king = this.whiteKing;
    } else {
      king = this.blackKing;
    }
    var isKingUnderAttack: boolean = this.isCellUnderAttack(
      king.cell,
      this.getOppositeColor(king.color)
    );
    figure.cell = startCell;
    startCell.figure = figure;
    targetCell.figure = targetFigure;

    return !isKingUnderAttack;
  }

  isFigureHasAnyMove(figure: Figure): boolean {
    for (let j = 0; j < this.cells.length; j++) {
      for (let i = 0; i < this.cells.length; i++) {
        const targetCell = this.getCell(j, i);
        if (
          figure?.canMove(targetCell) &&
          this.isAvailableMove(figure, figure.cell, targetCell)
        )
          return true;
      }
    }
    return false;
  }

  checkIsMate(playerColor: Colors): boolean {
    for (let k = 0; k < this.cells.length; k++) {
      for (let i = 0; i < this.cells.length; i++) {
        const cell = this.getCell(k, i);
        if (
          cell.figure &&
          cell.figure.color === playerColor &&
          this.isFigureHasAnyMove(cell.figure)
        )
          return false;
      }
    }
    return true;
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
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < this.cells.length; j++) {
        const target = row[j];
        target.available = !!(
          selectedCell?.figure?.canMove(target) &&
          this.isAvailableMove(selectedCell.figure, selectedCell, target)
        );
      }
    }
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
