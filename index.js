const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth - 10
canvas.height = window.innerHeight
const speed = 5
const collisionsMap = []
const OFFSET = {
    x: -750,
    y: -400
}
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}

const boundries = [];
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 0) return
        boundries.push(new Boundry({ position: { x: (j * Boundry.scaled) + OFFSET.x, y: (i * Boundry.scaled) + OFFSET.y } }))
    })
})


const image = new Image()
image.src = './assets/map.png'


const playerImageUp = new Image();
playerImageUp.src = './assets/playerUp.png'
const playerImageDown = new Image();
playerImageDown.src = './assets/playerDown.png'
const playerImageLeft = new Image();
playerImageLeft.src = './assets/playerLeft.png'
const playerImageRight = new Image();
playerImageRight.src = './assets/playerRight.png'

const foregroundImage = new Image();
foregroundImage.src = './assets/foreground.png'

const backgorund = new Sprite({
    position: {
        ...OFFSET
    },
    image
})
const foreground = new Sprite({
    position: {
        ...OFFSET
    },
    image: foregroundImage
})
const player = new Sprite({
    image: playerImageDown,
    type: 'player',
    position: { x: 100, y: 100 },
    images: {
        up: playerImageUp,
        down: playerImageDown,
        left: playerImageLeft,
        right: playerImageRight
    }
})
const keys = {
    up: { pressed: false },
    down: { pressed: false },
    left: { pressed: false },
    right: { pressed: false },
}
const movables = [backgorund, ...boundries, foreground]
function rectangularCollision({ player, boundary }) {
    return (player.position.x + player.image.width / 4 >= boundary.position.x &&
        player.position.x <= boundary.position.x + boundary.width &&
        player.position.y + player.image.height >= boundary.position.y &&
        player.position.y <= boundary.position.y + boundary.height)
}

let lastKey = ''
function animate() {
    requestAnimationFrame(animate)
    movables.forEach(movable => {
        movable.draw()
    })
    player.draw()
    foreground.draw()
    let moving = true
    if (keys.up.pressed && lastKey == 'ArrowUp') {
        for (let i = 0; i < boundries.length; i++) {
            const boundary = boundries[i];
            if (rectangularCollision({
                player,
                boundary: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + speed
                    }
                }
            })) {
                console.log('colliding');
                moving = false
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => movable.position.y += speed)
        }
    }
    if (keys.down.pressed && lastKey == 'ArrowDown') {
        for (let i = 0; i < boundries.length; i++) {
            const boundary = boundries[i];
            if (rectangularCollision({
                player,
                boundary: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - speed
                    }
                }
            })) {
                console.log('colliding');
                moving = false
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => movable.position.y -= speed)
        }
    }
    if (keys.left.pressed && lastKey == 'ArrowLeft') {
        for (let i = 0; i < boundries.length; i++) {
            const boundary = boundries[i];
            if (rectangularCollision({
                player,
                boundary: {
                    ...boundary, position: {
                        x: boundary.position.x + speed,
                        y: boundary.position.y
                    }
                }
            })) {
                console.log('colliding');
                moving = false
                break;
            }
        }
        if (moving)
            movables.forEach((movable) => movable.position.x += speed)
    }
    if (keys.right.pressed && lastKey == 'ArrowRight') {
        for (let i = 0; i < boundries.length; i++) {
            const boundary = boundries[i];
            if (rectangularCollision({
                player,
                boundary: {
                    ...boundary, position: {
                        x: boundary.position.x - speed,
                        y: boundary.position.y
                    }
                }
            })) {
                console.log('colliding');
                moving = false
                break;
            }
        }
        if (moving)
            movables.forEach((movable) => movable.position.x -= speed)
    }
}
animate()
addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.up.pressed = true
            lastKey = 'ArrowUp'
            player.moving = true
            player.image = player.images.up
            break;
        case 'ArrowDown':
            keys.down.pressed = true
            lastKey = 'ArrowDown'
            player.moving = true
            player.image = player.images.down
            break;
        case 'ArrowLeft':
            keys.left.pressed = true
            lastKey = 'ArrowLeft'
            player.moving = true
            player.image = player.images.left
            break;
        case 'ArrowRight':
            keys.right.pressed = true
            lastKey = 'ArrowRight'
            player.moving = true
            player.image = player.images.right
            break;
        default:
            break;
    }
})

addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.up.pressed = false
            player.moving = false
            break;
        case 'ArrowDown':
            keys.down.pressed = false
            player.moving = false
            break;
        case 'ArrowLeft':
            keys.left.pressed = false
            player.moving = false
            break;
        case 'ArrowRight':
            keys.right.pressed = false
            player.moving = false
            break;
        default:
            break;
    }

})
