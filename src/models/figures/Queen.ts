import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import blackLogo from "../../assets/black-queen.png"
import whiteLogo from "../../assets/white-queen.png"

export class Queen extends Figure {
    
    constructor(color:Colors, cell:Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.QUEEN;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) {
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