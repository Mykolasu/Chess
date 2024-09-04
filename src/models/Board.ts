import { Cell } from './Cell';
import { Colors } from './Colors';
import { Queen } from './figures/Queen';
import { Pawn } from './figures/Pawn';

export class Board {
    cells: Cell[][] = []

    public initCells() {
        for (let i = 0; i < 8; i++) {
            const row: Cell[] = []
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 !== 0) {
                    row.push(new Cell(this, j, i, Colors.BLACK, null)) //black cell
                } else {
                    row.push(new Cell(this, j, i, Colors.WHITE, null)) //white cell
                }
            } 
            this.cells.push(row);           
        }
    }

    public getCell(x: number, y: number) {
        return this.cells[y][x]
    }

    private addPawns() {
        for (let i = 0; i < 8; i++) {
            new Pawn(Colors.BLACK, this.getCell(i, 1))
            new Pawn(Colors.WHITE, this.getCell(i, 6))
            
        }
    }

    private addKings() {
        
    }

    private addQueens() {
        
    }

    private addBishops() {
        
    }

    private addKhights() {
        
    }

    private addRooks() {
        
    }

    public addFigures() {
        this.addPawns()
        this.addKhights()
        this.addKings()
        this.addBishops()
        this.addQueens()
        this.addRooks()
    }
}