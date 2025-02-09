class Boundry {
    static scaled = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }
    draw() {
        c.fillStyle = 'rgba(255,0,0,0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Sprite {
    constructor({ position, image, type = 'background', frames = 4 }) {
        this.position = position
        this.image = image
        this.type = type
        this.frames = frames;
        this.framePortion = 0
        this.elapsed = 0;
        this.moving = false
        this.width = this.image.width / this.frames
        this.height = this.image.height
    }
    draw() {
        this.width = this.image.width / this.frames
        this.height = this.image.height
        c.drawImage(this.image,
            this.framePortion * (this.width),
            0,
            this.width,
            this.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height,
        )
        this.elapsed++;
        if (!this.moving && (this.type !== 'draggle' && this.type !== 'emby')) return
        if (this.elapsed % 15 == 0) {
            if (this.framePortion < this.frames - 1) {
                this.framePortion++
            }
            else this.framePortion = 0;
        }
    }
    attack({ attack, recipient }) {
        const tl = gsap.timeline()
        tl.to(this.position, {
            x: this.position.x - 20
        }).to(this.position, {
            x: this.position.x + 40,
            duration: 0.1,
            onComplete() {
                gsap.to(recipient.position, { x: recipient.position.x + 10, yoyo: true,repeat:5 })
            }
        }).to(this.position, {
            x: this.position.x
        })
    }
}