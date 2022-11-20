export class BoardSetup {

    boardSize: number
    fieldSize: number
    constructor(public boardFlipped: boolean, windowHeight: number) {
        this.updateFieldSize(windowHeight)
    }

    containerSizeUpdated(windowHeight: number) {
        this.updateFieldSize(windowHeight)
    }

    private updateFieldSize(containerHeight: number) {
        console.log(containerHeight)
        this.boardSize = containerHeight
        this.fieldSize = this.boardSize / 8
    }
}