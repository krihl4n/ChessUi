export class Piece {

    imagePath: string
    htmlElement: any

    listener: any; // todo collection
    constructor(public color: string, type: string) {
        this.imagePath = `assets/${color}_${type}.svg`
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
}
