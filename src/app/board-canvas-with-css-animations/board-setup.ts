export class BoardSetup {
    
    boardSize: number
    fieldSize: number
    constructor(private boardFlipped: boolean, private windowHeight: number) {
        this.updateFieldSize(windowHeight)
    }

    windowHeightUpdated(windowHeight: number){
        this.updateFieldSize(windowHeight)
    }

    private updateFieldSize(windowHeight: number) {
        this.fieldSize = (windowHeight-200)/8
        this.boardSize = this.fieldSize * 8
    }
}