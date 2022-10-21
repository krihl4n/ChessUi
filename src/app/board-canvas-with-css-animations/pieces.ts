import { Piece } from "./piece.model";

export class Pieces {

    whiteBishop: Piece
    blackBishop: Piece

    initialize(allPiecesLoaded: () => void) {
        this.whiteBishop = new Piece('white', 'bishop', () => {
            this.notifyIfAllLoaded(allPiecesLoaded)
        })
        this.blackBishop = new Piece('black', 'bishop', () => {
            this.notifyIfAllLoaded(allPiecesLoaded)
        })
    }

    private notifyIfAllLoaded(allPiecesLoaded: () => void) {
        if(this.whiteBishop.imageLoaded && this.blackBishop.imageLoaded) {
            console.log("All images loaded")
            allPiecesLoaded()
        }
    }
}