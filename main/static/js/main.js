import Game from './Game.js'
import { loadImage, loadJSON } from './Loader.js'
import Sprite from './Sprite.js'
import Cinematic from './Cinematic.js'
import { getRandomFrom, haveCollision } from './Additional.js'
import DisplayObject from './DisplayObject.js'

const scale = 3

export default async function main () {
    const game = new Game({
        width: 672,
        height: 744,
        background: 'black'
    })

    document.body.append(game.canvas)

    const image = await loadImage('static/sets/spritesheet.png')
    const atlas = await loadJSON('static/sets/atlas.json')

    const maze = new Sprite({
        image,
        x: 0,
        y: 0,
        width: atlas.maze.width * scale,
        height: atlas.maze.height * scale,
        frame: atlas.maze
    })
    game.canvas.width = maze.width
    game.canvas.height = maze.height

    let foods = atlas.maze.foods
        .map(food => ({
            ...food,
            x: food.x * scale,
            y: food.y * scale,
            width: food.width * scale,
            height: food.height * scale,
        }))
        .map(food => new Sprite({
            image,
            frame: atlas.food,
            ...food
        }))

    const pacman =  new Cinematic({
        image,
        x: atlas.position.pacman.x * scale,
        y: atlas.position.pacman.y * scale,
        width: 13 * scale,
        height: 13 * scale,
        animations: atlas.pacman,
        speedX: 1,
        debug: true,
    })
    pacman.start('right')

    const ghosts = ['red', 'pink', 'turquoise', 'banana']
        .map(color => {
            const ghost = new Cinematic({
                image,
                x: atlas.position[color].x * scale,
                y: atlas.position[color].y * scale,
                width: 13 * scale,
                height: 13 * scale,
                animations: atlas[`${color}Ghost`]
            })
            ghost.start(atlas.position[color].direction)
            ghost.nextDirection = atlas.position[color].direction

            return ghost
        })

    const walls = atlas.maze.walls.map(wall => new DisplayObject({
        x: wall.x * scale,
        y: wall.y * scale,
        width: wall.width * scale,
        height: wall.height * scale,
        debug: true,
    }))

    walls.forEach(wall => game.stage.add(wall))
    game.stage.add(maze)
    game.stage.add(pacman)
    foods.forEach(food => game.stage.add(food))
    ghosts.forEach(ghost => game.stage.add(ghost))

    game.update = () => {
        const eaten = []
        for (const food of foods) {
            if (haveCollision(pacman, food)) {
                eaten.push(food)
                game.stage.remove(food)
            }
        }
        foods = foods.filter(food => !eaten.includes(food))

        changeDirection(pacman)
        ghosts.forEach(changeDirection)

        for (const ghost of ghosts) {
            const wall = getWallCollision(ghost.getNextPosition())

            if (wall) {
                ghost.speedX = 0
                ghost.speedY = 0
            }

            if (ghost.speedX === 0 && ghost.speedY === 0) {
                if (ghost.animation.name === 'up') {
                    ghost.nextDirection = getRandomFrom('left', 'right', 'down')
                }

                else if (ghost.animation.name === 'down') {
                    ghost.nextDirection = getRandomFrom('left', 'right', 'up')
                }

                else if (ghost.animation.name === 'right') {
                    ghost.nextDirection = getRandomFrom('left', 'up', 'down')
                }

                else if (ghost.animation.name === 'left') {
                    ghost.nextDirection = getRandomFrom('up', 'right', 'down')
                }
            }

            if (pacman.play && haveCollision(pacman, ghost)) {
                pacman.speedX = 0
                pacman.speedY = 0
                pacman.start('die', {
                    onEnd () {
                        pacman.play = false
                        pacman.stop()
                        game.stage.remove(pacman)
                    }
                })
            }
        }

        const wall = getWallCollision(pacman.getNextPosition())
        if (wall) {
            pacman.start(`wait${pacman.animation.name}`)
            pacman.speedX = 0
            pacman.speedY = 0
        }
    }

    document.addEventListener('keydown', event => {
        if(!pacman.play) {
            return
        }
        if (event.key === 'a'){
            pacman.nextDirection = 'left'
        }
        else if (event.key === 'd'){
            pacman.nextDirection = 'right'
        }
        else if (event.key === 'w'){
            pacman.nextDirection = 'up'
        }
        else if (event.key === 's'){
            pacman.nextDirection = 'down'
        }
    })

    function getWallCollision (obj) {
        for (const wall of walls) {
            if(haveCollision(obj, wall)) {
                return wall
            }
        }
        return null
    }

    function changeDirection(sprite) {
        if (!sprite.nextDirection) {
            return
        }
        if (sprite.nextDirection === 'up') {
            sprite.y -= 10
            if (!getWallCollision(sprite)) {
                sprite.nextDirection = null
                sprite.speedX = 0
                sprite.speedY = -1
                sprite.start('up')
            }
            sprite.y += 10
        }
        else if (sprite.nextDirection === 'down') {
            sprite.y += 10
            if (!getWallCollision(sprite)) {
                sprite.nextDirection = null
                sprite.speedX = 0
                sprite.speedY = 1
                sprite.start('down')
            }
            sprite.y -= 10
        }
        else if (sprite.nextDirection === 'right') {
            sprite.x += 10
            if (!getWallCollision(sprite)) {
                sprite.nextDirection = null
                sprite.speedX = 1
                sprite.speedY = 0
                sprite.start('right')
            }
            sprite.x -= 10
        }
        else if (sprite.nextDirection === 'left') {
            sprite.x -= 10
            if (!getWallCollision(sprite)) {
                sprite.nextDirection = null
                sprite.speedX = -1
                sprite.speedY = 0
                sprite.start('left')
            }
            sprite.x += 10
        }
    }
}
