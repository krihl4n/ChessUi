import { BoardSetup } from "./board-setup";

export class Piece {

    imagePath: string
    htmlElement: any
    desiredHeight: number
    listener: any; // todo collection

    constructor(public color: string, private type: string, private boardSetup: BoardSetup) {
        this.imagePath = `assets/${color}_${type}.svg`
        this.setDesiredHeight()
    }

    setHtmlElement(htmlElement: any) {
        this.htmlElement = htmlElement
        this.htmlElement.addEventListener('mousedown', (e:MouseEvent)=> {
            this.listener(e, this)
        })
    }

    setMouseDownListener(listener: any) { // todo type
        this.listener = listener
    }

    private setDesiredHeight() {
        this.desiredHeight = this.boardSetup.fieldSize * 0.8 // maybe smaller
    }

    getWitdh() {
        console.log(this.htmlElement.height)
        console.log(this.htmlElement.width)
    }
}

// F 88
// p 68

// P = F * X