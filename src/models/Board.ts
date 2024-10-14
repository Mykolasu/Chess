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

  public isCellUnderAttack(targetCell: Cell, enemyColor: Colors): boolean {
    for (const row of this.cells) {
      if (
        row.some(
          (cell) =>
            cell.figure &&
            cell.figure.color === enemyColor &&
            cell.figure.canMove(targetCell)
        )
      ) {
        return true;
      }
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
    for (const row of this.cells) {
      for (const targetCell of row) {
        if (
          figure.canMove(targetCell) &&
          this.isAvailableMove(figure, figure.cell, targetCell)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  checkIsMate(playerColor: Colors): boolean {
    for (const row of this.cells) {
      for (const cell of row) {
        if (
          cell.figure &&
          cell.figure.color === playerColor &&
          this.isFigureHasAnyMove(cell.figure)
        ) {
          return false;
        }
      }
    }
    console.log("bt");
    return true;
  }

  public initCells() {
    this.cells = Array.from({ length: 8 }, (_, i) =>
      Array.from(
        { length: 8 },
        (_, j) =>
          new Cell(
            this,
            j,
            i,
            (i + j) % 2 === 0 ? Colors.WHITE : Colors.BLACK,
            null
          )
      )
    );
  }

  public getCopyBoard(): Board {
    const newBoard = new Board();
    newBoard.cells = this.cells;
    newBoard.lostWhiteFigures = this.lostWhiteFigures;
    newBoard.lostBlackFigures = this.lostBlackFigures;
    return newBoard;
  }

  public highlightCells(selectedCell: Cell | null) {
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        const target = row[j];
        target.available = !!selectedCell?.figure?.canMove(target);
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

    this.addFigure(King, Colors.BLACK, [[4, 0]]);
    this.addFigure(King, Colors.WHITE, [[4, 7]]);

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
