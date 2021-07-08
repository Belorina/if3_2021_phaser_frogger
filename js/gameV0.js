let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: true
    },
    autoCenter: true
};


let game = new Phaser.Game(config);
let BG;
let frog, mumFrog;

let left, right, up, down;

let heart;
let tweenHeart;


function init() {

}

function preload() {
    this.load.image('background', './assets/images/FroggerBackground.png');
    this.load.image('frog', './assets/images/Frog.png');
    this.load.image('mumFrog', './assets/images/smileymumfrog.png');
    this.load.image('heart', './assets/images/heart.png');


}

function create() {
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    BG = this.add.image(0, 0, 'background');
    BG.setOrigin(0, 0);
    BG.setScale(1);

    frog = this.add.image(240, 300, 'frog');
    mumFrog = this.add.image(Phaser.Math.Between(0, 460), 0, 'mumFrog');
    mumFrog.setOrigin(0, 0);

    heart = this.add.image(240, 160, 'heart');
    heart.setScale(0,0);
    tweenHeart = this.tweens.add({
        targets: heart,
        scale: 3.5,
        duration: 1000,
        ease: 'Linear',
        loop: 0,
        paused: true,
    });
    



}

function update() {
    // FROG MOVEMENTS & SCREEN LIMITE & ORIENTATION
    if (Phaser.Input.Keyboard.JustDown(down) && frog.y < 304) frog.y += 16, frog.setAngle(180);
    if (Phaser.Input.Keyboard.JustDown(up) && frog.y > 16) frog.y -= 16, frog.setAngle(0);
    if (Phaser.Input.Keyboard.JustDown(left) && frog.x > 16) frog.x -= 16, frog.setAngle(270);
    if (Phaser.Input.Keyboard.JustDown(right) && frog.x < 464) frog.x += 16, frog.setAngle(90);

    // COLLISION DETECT WITH FROG & MUMFROG
    if (Phaser.Geom.Intersects.RectangleToRectangle(frog.getBounds(), mumFrog.getBounds())){
        //frog.x = -100;  // pour qu il ya  qu'une collision 
        tweenHeart.play();
    };

}