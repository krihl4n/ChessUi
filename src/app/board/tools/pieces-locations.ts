import { Injectable } from "@angular/core";
import { Piece } from "./piece.model";

@Injectable({
    providedIn: "root"
})
export class PiecesLocations {

    private locations = new Map<string, Piece>() 

    reset() {
        this.locations.clear()
    }

    set(field:string, piece: Piece) {
        this.locations.set(field, piece)
    }

    get(field: string): Piece | undefined {
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