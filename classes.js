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
    constructor({ position, velocity, image, type = 'background',images }) {
        this.position = position
        this.image = image
        this.type = type
        this.frames = 4;
        this.framePortion = 0
        this.elapsed = 0;
        this.moving = false
        this.images = images
    }
    draw() {
        if (this.type == 'player') {
            this.position.x = canvas.width / 2 - this.image.width / 8;
            this.position.y = canvas.height / 2 - this.image.height / 2;

            c.drawImage(this.image,
                this.framePortion * (this.image.width / 4),
                0,
                this.image.width / 4,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width / 4,
                this.image.height,
            )
            this.elapsed++;
            if (!this.moving) return
            if (this.elapsed % 10 == 0) {
                if (this.framePortion < this.frames - 1) {
                    this.framePortion++
                }
                else this.framePortion = 0;
            }


        }
        else {
            c.drawImage(this.image, this.position.x, this.position.y)
        }
    }
}