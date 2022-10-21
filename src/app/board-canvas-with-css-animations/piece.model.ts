export class Piece {
    
    imagePath: string
    image: HTMLImageElement
    imageLoaded = false
    constructor(color: String, type: String, imageLoaded: () => void) {
        this.imagePath = `assets/${color}_${type}.svg`
        this.image = new Image()
        this.image.onload = () => {
            this.imageLoaded = true
            console.log(this.imagePath + " loaded")
            imageLoaded()
          }
          this.image.src = this.imagePath
    }
}
