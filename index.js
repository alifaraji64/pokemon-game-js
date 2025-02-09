const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

const speed = 5
const OFFSET = {
    x: -750,
    y: -350
}
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}

const battleZoneMap = []
for (let i = 0; i < battleZoneData.length; i += 70) {
    battleZoneMap.push(battleZoneData.slice(i, i + 70))
}


const boundries = [];
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 0) return
        boundries.push(new Boundry({ position: { x: (j * Boundry.scaled) + OFFSET.x, y: (i * Boundry.scaled) + OFFSET.y } }))
    })
})

const battleZones = [];
battleZoneMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 0) return;
        battleZones.push(new Boundry({ position: { x: (j * Boundry.scaled) + OFFSET.x, y: (i * Boundry.scaled) + OFFSET.y } }))
    })
})
console.log(battleZones);



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
    image,
    frames:1
})
const foreground = new Sprite({
    position: {
        ...OFFSET
    },
    image: foregroundImage,
    frames:1
})
const player = new Sprite({
    image: playerImageDown,
    type: 'player',
    position: {
        x: canvas.width / 2 - playerImageDown.width / 8 -20,
        y: canvas.height / 2 - playerImageDown.height / 2
    },
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
const movables = [backgorund, ...boundries, foreground, ...battleZones]
function rectangularCollision({ player, boundary }) {
    return (player.position.x + player.image.width / 4 >= boundary.position.x &&
        player.position.x <= boundary.position.x + boundary.width &&
        player.position.y + player.image.height >= boundary.position.y &&
        player.position.y <= boundary.position.y + boundary.height)
}

let lastKey = ''
const battle = { initiated: false }
function animate() {
    const animationId = requestAnimationFrame(animate)
    movables.forEach(movable => {
        movable.draw()
    })
    console.log(animationId);

    player.draw()
    foreground.draw()
    let moving = true
    if (battle.initiated) return
    if (keys.up.pressed || keys.down.pressed || keys.left.pressed || keys.right.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            const overlappingWidth = Math.min(battleZone.position.x + battleZone.width, player.position.x + player.width) - Math.max(battleZone.position.x, player.position.x)
            const overlappingHeight = Math.min(battleZone.position.y + battleZone.height, player.position.y + player.height) - Math.max(battleZone.position.y, player.position.y)
            const overlappingArea = overlappingHeight * overlappingWidth
            if (rectangularCollision(
                {
                    player,
                    boundary: battleZone
                })) {

                if (overlappingArea > player.width * player.height / 3 && Math.random() < 0.02) {
                    console.log('battle started');
                    battle.initiated = true;
                    cancelAnimationFrame(animationId)
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        repeat: 3,
                        yoyo: true,
                        duration: 0.5,
                        onComplete() {
                            gsap.to('#overlappingDiv', {
                                opacity: 1,
                                onComplete() {
                                    animateBattle()
                                    gsap.to('#overlappingDiv', {
                                        opacity: 0,
                                        duration: 0.4
                                    })
                                }
                            })
                        }
                    })
                    break;
                }
            }
        }
    }
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
                moving = false
                break;
            }
        }
        if (moving)
            movables.forEach((movable) => movable.position.x -= speed)
    }
}
//animate()

const battleBgImg = new Image()
battleBgImg.src = './assets/battleBackground.png'
const battleBackground = new Sprite({ position: { x: 0, y: 0 }, image: battleBgImg,frames:1 })
const draggleImg = new Image()
draggleImg.src = './assets/draggleSprite.png'
const draggle = new Sprite({ position: { x: 800, y: 100 }, image: draggleImg,type:'draggle' })
const embyImg = new Image()
embyImg.src = './assets/embySprite.png'
const emby = new Sprite({ position: { x: 500, y: 300 }, image: embyImg, type:'emby' })
function animateBattle() {
    requestAnimationFrame(animateBattle)
    battleBackground.draw()
    draggle.draw()
    emby.draw()

}
animateBattle()
document.querySelectorAll('button').forEach(button=>{
    button.addEventListener('click',()=>{
        emby.attack({
            attack:{
                name:'Tackle',
                damage:10,
                type:'Normal'
            },
            recipient: draggle
        })
    })
})
addEventListener('click',()=>{

})
addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.up.pressed = true
            lastKey = 'ArrowUp'
            if (battle.initiated) return
            player.moving = true
            player.image = player.images.up
            break;
        case 'ArrowDown':
            keys.down.pressed = true
            lastKey = 'ArrowDown'
            if (battle.initiated) return
            player.moving = true
            player.image = player.images.down
            break;
        case 'ArrowLeft':
            keys.left.pressed = true
            lastKey = 'ArrowLeft'
            if (battle.initiated) return
            player.moving = true
            player.image = player.images.left
            break;
        case 'ArrowRight':
            keys.right.pressed = true
            lastKey = 'ArrowRight'
            if (battle.initiated) return
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
