import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import blackLogo from "../../assets/black-king.png"
import whiteLogo from "../../assets/white-king.png"

export class King extends Figure {
    
    constructor(color:Colors, cell:Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.KING;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) {
            return false;
        }
        const absX = Math.abs(target.x - this.cell.x);
        const absY = Math.abs(target.y - this.cell.y);
        if (absY !== 1 && absX !== 1) {
            return false;
        }
        if (this.cell.isAvailableVertically(target)) {
            return true;
        }
        if (this.cell.isAvailableHorizontally(target)) {
            return true;
        }
        if (this.cell.isAvailableDiagonal(target)) {
            return true;
        }
        return false
    }
}