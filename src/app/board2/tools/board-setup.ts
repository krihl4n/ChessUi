export class BoardSetup {

    boardSize: number
    fieldSize: number
    constructor(public boardFlipped: boolean, windowHeight: number) {
        this.updateFieldSize(windowHeight)
    }

    windowHeightUpdated(windowHeight: number) {
        this.updateFieldSize(windowHeight)
    }

    private updateFieldSize(windowHeight: number) {
        this.boardSize = windowHeight - 500
        this.fieldSize = this.boardSize / 8
    }
}