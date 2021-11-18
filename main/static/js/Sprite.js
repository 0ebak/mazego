import DisplayObject from './DisplayObject.js'

export default class Sprite extends DisplayObject {
    constructor (props = {}) {
        super(props)

        this.image = props.image ?? null
        this.frame = props.frame ?? null
    }

    update () {

    }

    draw (context) {
        context.drawImage(
            this.image,

            this.frame.x, this.frame.y,
            this.frame.width, this.frame.height,

            this.x, this.y,
            this.width, this.height
        )
    }
}