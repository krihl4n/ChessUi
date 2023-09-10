import { PAWN } from "src/app/model/typings";

export class Piece {

    imagePath: string
    htmlElement: any
    desiredHeight: number
    desiredWidth: number
    listener: any; // todo collection

    height: number = -1
    width: number = -1

    constructor(public color: string, public type: string, private fieldSize: number) {
        this.imagePath = `assets/${color}_${type}.svg`
        this.setDesiredHeight()
    }

    setHtmlElement(htmlElement: any) {
        this.htmlElement = htmlElement
        this.htmlElement.addEventListener('mousedown', (e:MouseEvent)=> {
            this.listener(e, this)
        })
       this.height = htmlElement.height
       this.width = htmlElement.width
    }

    setMouseDownListener(listener: any) { // todo type
        this.listener = listener
    }

    setDesiredHeight() {
        if(this.type == PAWN){
            this.desiredHeight = this.fieldSize * 0.7 
        } else {
            this.desiredHeight = this.fieldSize * 0.8 
        }
    }

    getWidth() {
        // console.log("element w:" + this.htmlElement.width)
        // console.log("this w:" + this.width)
        // return this.width
        return this.htmlElement.width
    }

    getHeight() {
    //    return this.height
    return this.htmlElement.height
    }
}
