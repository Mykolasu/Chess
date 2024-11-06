import { Colors } from './Colors';
import { Figure } from './figures/Figure';
import { Board } from './Board';

export class Cell {
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    figure: Figure | null;
    board: Board;
    available: boolean;  // the possibility of moving
    id: number; 

    constructor (board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.board = board;
        this.available = false;
        this.id = Math.random();
    }

    isEmpty(): boolean {
        return this.figure === null;
    }

    isEnemy(target:Cell): boolean {
        if (target.figure) {
            return this.figure?.color !== target.figure.color;
        }
        return false;
    }

    private isAvailableInLine(start: number, end: number, fixed: number, checkVertical: boolean): boolean {
        const min = Math.min(start, end);
        const max = Math.max(start, end);
        for (let i = min + 1; i < max; i++) {
            const cell = checkVertical ? this.board.getCell(fixed, i) : this.board.getCell(i, fixed);
            if (!cell.isEmpty()) {
                return false;
            }
        }
        return true;
    }

    isAvailableVertically(target: Cell): boolean {
        return this.x === target.x && this.isAvailableInLine(this.y, target.y, this.x, true);
    }

    isAvailableHorizontally(target: Cell): boolean {
        return this.y === target.y && this.isAvailableInLine(this.x, target.x, this.y, false);
    }

    isAvailableDiagonal(target:Cell): boolean {
        const absX = Math.abs(target.x - this.x);
        const absY = Math.abs(target.y - this.y);
        if (absY !== absX) return false;
        
        const dy = this.y < target.y ? 1 : -1;
        const dx = this.x < target.x ? 1 : -1;

        for (let i = 1; i < absX; i++) {
            const cell = this.board.getCell(this.x + dx * i, this.y + dy * i);
            if (!cell.isEmpty()) {
                return false; 
            }
        }
        return true;
    }

    setFigure(figure: Figure) {
        this.figure = figure;
        this.figure.cell = this;
    }

    addLostFigure(figure:Figure) {
        figure.color === Colors.BLACK
        ? this.board.lostBlackFigures.push(figure)
        : this.board.lostWhiteFigures.push(figure)
    }

    moveFigure(target: Cell) {
        if (this.figure?.canMove(target)) {
            if (target.figure) this.addLostFigure(target.figure);
            target.setFigure(this.figure);
            this.figure = null;
        }
    }
}