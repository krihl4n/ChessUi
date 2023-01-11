import { Piece } from "./piece.model";

export class PiecesLocations {

    private locations = new Map<string, Piece>() 

    set(field:string, piece: Piece) {
        this.locations.set(field, piece)
    }

    get(field: string) {
        return this.locations.get(field)
    }

    getAll() {
        return this.locations
    }

    delete(field: string) {
        this.locations.delete(field)
    }

    fieldOccupied(field: string) {
        return this.locations.get(field)
    }
}