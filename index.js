const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth - 10
canvas.height = window.innerHeight
const speed = 3
const collisionsMap = []
const OFFSET = {
    x: -800,
    y: -580
}
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}
class Boundry {
    static scaled = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundries = [];
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 0) return
        boundries.push(new Boundry({ position: { x: (j * Boundry.scaled) + OFFSET.x, y: (i * Boundry.scaled) + OFFSET.y } }))
    })
})
console.log(boundries);




c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = './assets/map.png'

const playerImage = new Image();
playerImage.src = './assets/playerDown.png'

class Sprite {
    constructor({ position, velocity, image, type = 'background' }) {
        this.position = position
        this.image = image
        this.type = type
    }
    draw() {
        if (this.type == 'player') {
            this.position.x = canvas.width / 2 - this.image.width / 8;
            this.position.y = canvas.height / 2 - this.image.height / 2;
            c.drawImage(this.image,
                0,
                0,
                this.image.width / 4,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width / 4,
                this.image.height,

            )
        }
        else {
            c.drawImage(this.image, this.position.x, this.position.y)
        }
    }
}

const backgorund = new Sprite({
    position: {
        ...OFFSET
    },
    image
})
const player = new Sprite({ image: playerImage, type: 'player', position: { x: 100, y: 100 } })
const keys = {
    up: { pressed: false },
    down: { pressed: false },
    left: { pressed: false },
    right: { pressed: false },
}
const testBoundary = new Boundry({ position: { x: 400, y: 400 } })
const movables = [backgorund, testBoundary]
function animate() {
    requestAnimationFrame(animate)
    backgorund.draw()
    testBoundary.draw()
    player.draw()
    if (keys.up.pressed && lastKey == 'ArrowUp') {
        movables.forEach((movable) => movable.position.y += speed)
    }
    if (keys.down.pressed && lastKey == 'ArrowDown') {
        movables.forEach((movable) => movable.position.y -= speed)
    }
    if (keys.left.pressed && lastKey == 'ArrowLeft') {
        movables.forEach((movable) => movable.position.x += speed)
    }
    if (keys.right.pressed && lastKey == 'ArrowRight') {
        movables.forEach((movable) => movable.position.x -= speed)
    }
    //collision
    if (player.position.x + player.image.width / 4 >= testBoundary.position.x &&
        player.position.x < testBoundary.position.x + testBoundary.width &&
        player.position.y + player.image.height > testBoundary.position.y &&
        player.position.y < testBoundary.position.y + testBoundary.height
    ) {
        console.log('colliding');

    }
}
animate()
let lastKey = ''
addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.up.pressed = true
            lastKey = 'ArrowUp'
            break;
        case 'ArrowDown':
            keys.down.pressed = true
            lastKey = 'ArrowDown'
            break;
        case 'ArrowLeft':
            keys.left.pressed = true
            lastKey = 'ArrowLeft'
            break;
        case 'ArrowRight':
            keys.right.pressed = true
            lastKey = 'ArrowRight'
            break;
        default:
            break;
    }
})

addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.up.pressed = false
            break;
        case 'ArrowDown':
            keys.down.pressed = false
            break;
        case 'ArrowLeft':
            keys.left.pressed = false
            break;
        case 'ArrowRight':
            keys.right.pressed = false
            break;
        default:
            break;
    }

})
