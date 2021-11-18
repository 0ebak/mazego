import Game from './Game.js'
import { loadImage, loadJSON } from './Loader.js'

export default async function main () {
    const game = new Game({
        width: 100,
        height: 100,
        background: 'green'
    })

    document.body.append(game.canvas)

    const image = await loadImage('/sets/spritesheet.png')
    const atlas = await loadJSON('/sets/atlas.json ')

}
