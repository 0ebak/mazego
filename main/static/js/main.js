import Game from './Game.js'
import { loadImage, loadJSON } from './Loader.js'
import Sprite from './Sprite.js'
import Cinematic from './Cinematic.js'

export default async function main () {
    const game = new Game({
        width: 500,
        height: 500,
        background: 'black'
    })

    document.body.append(game.canvas)

    const image = await loadImage('static/sets/spritesheet.png')
    const atlas = await loadJSON('static/sets/atlas.json')

    const pacman =  new Cinematic({
        image,
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        animations: atlas.pacman
    })
    pacman.start('left')

    game.stage.add(pacman)
}
