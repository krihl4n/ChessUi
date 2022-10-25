export class Piece {

    imagePath: string
    htmlElement: any

    listener: any; // todo collection
    constructor(color: String, type: String) {
        this.imagePath = `assets/${color}_${type}.svg`
    }

    setHtmlElement(htmlElement: any) {
        this.htmlElement = htmlElement
        this.htmlElement.addEventListener('mousedown', (e:MouseEvent)=> {
            console.log("piece clicked")
            this.listener(e, this)
        })
    }

    setMouseDownListener(listener: any) { // todo type
        this.listener = listener
    }
}
