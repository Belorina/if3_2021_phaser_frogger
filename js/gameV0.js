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
//deadFrog;
let left, right, up, down;

let heart;
let tweenHeart;
let nbrCar;
let auto = [];
let onWelcomeScreen = true;


function init() {

}

function preload() {
    this.load.image('background', './assets/images/FroggerBackground.png');
    this.load.image('frog', './assets/images/Frog.png');
    this.load.image('mumFrog', './assets/images/smileymumfrog.png');
    this.load.image('heart', './assets/images/heart.png');
    this.load.image('deadFrog', './assets/images/deadFrog.png');
    this.load.image('car0', './assets/images/car.png');
    this.load.image('car1', './assets/images/snowCar.png');
    this.load.image('car2', './assets/images/F1-1.png');
    this.load.image('welcomeScreen', './assets/images/TitleScreen.png');
    this.load.image('startGame', './assets/images/playButton.webp');

}

function create() {
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    BG = this.add.image(0, 0, 'background');
    BG.setOrigin(0, 0);

    frog = this.add.image(240, 300, 'frog');
    mumFrog = this.add.image(Phaser.Math.Between(0, 460), 0, 'mumFrog');

    heart = this.add.image(240, 160, 'heart');
    heart.setScale(0, 0);
    tweenHeart = this.tweens.add({
        targets: heart,
        scale: 3.5,
        duration: 1000,
        ease: 'Linear',
        loop: 0,
        paused: true,
    });

    nbrCar = 60;

    for (let a = 0; a < 3; a++) {
        for (let i = 0; i < nbrCar; i++) {
            let index = i + a * 10;
            let randomSpace = Phaser.Math.Between(- 20, 20);
            let randomCar = Phaser.Math.Between(0, 2);

            auto[index] = this.physics.add.image(-50 + i * 50 + randomSpace, 192 + a * 32, 'car' + randomCar);
            auto[index].setOrigin(0.0);
            auto[index].setVelocity(100, 0);

        }
    }

    for (let a = 0; a < 3; a++) {
        for (let i = 0; i < nbrCar; i++) {
            let index = i + 30 + a * 10;
            let randomSpace = Phaser.Math.Between(-20, 20);
            let randomCar = Phaser.Math.Between(0, 2);
            auto[index] = this.physics.add.image(500 + i * 50 + randomSpace, 64 + a * 32, 'car' + randomCar);
            auto[index].setOrigin(0.0);
            auto[index].setAngle(180);
            auto[index].setVelocity(-100, 0);
        }
    }

    deadFrog = this.add.image(240, 160, 'deadFrog');
    deadFrog.setScale(0.0);
    tweenDeadFrog = this.tweens.add({
        targets: deadFrog,
        scale: 4.0,
        alpha: 0,
        duration: 1000,
        ease: 'Linear',
        yoyo: false,
        loop: 2,
        paused: true,
    });

    welcomeScreen = this.add.image(0, 0, 'welcomeScreen');
    welcomeScreen.setOrigin(0, 0);
    welcomeScreen.setScale(0.7);
    playButton = this.add.image(420, 260, 'startGame').setInteractive();
    playButton.setScale(0.1);
    playButton.on('pointerdown', startGame);

    //firstCar = this.add.image(100, 200, "firstCar");



}

function update() {

    if (!onWelcomeScreen) {

        // FROG MOVEMENTS & SCREEN LIMITE & ORIENTATION
        if (Phaser.Input.Keyboard.JustDown(down) && frog.y < 304) frog.y += 16, frog.setAngle(180);
        if (Phaser.Input.Keyboard.JustDown(up) && frog.y > 16) frog.y -= 16, frog.setAngle(0);
        if (Phaser.Input.Keyboard.JustDown(left) && frog.x > 16) frog.x -= 16, frog.setAngle(270);
        if (Phaser.Input.Keyboard.JustDown(right) && frog.x < 464) frog.x += 16, frog.setAngle(90);

    }


    // COLLISION DETECT WITH FROG & MUMFROG
    if (Phaser.Geom.Intersects.RectangleToRectangle(frog.getBounds(), mumFrog.getBounds())) {
        //frog.x = -100;  // pour qu il ya  qu'une collision 
        tweenHeart.play();
        frog.x = 241;
        frog.y = 296;
    };

    for (let i = 0; i < nbrCar; i++) {
        if (i < 30 && auto[i].x > 500) auto[i].x = -40;
        if (i >= 30 && auto[i].x < -50) auto[i].x = 500;
        if (Phaser.Geom.Intersects.RectangleToRectangle(frog.getBounds(), auto[i].getBounds())) {
            tweenDeadFrog.play();
            frog.x = 241;
            frog.y = 296;
        }
    }



}

function startGame(){
    welcomeScreen.setVisible(false);
    playButton.setVisible(false);
    onWelcomeScreen = false;
}