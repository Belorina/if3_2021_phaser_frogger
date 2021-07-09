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

// bugs to fix 
// pos mum not rndom ? 


let game = new Phaser.Game(config);
let BG;
let frog, mumFrog;
let deadFrog;
let left, right, up, down;

let heart;
let tweenHeart;
let nbrCar;
let auto = [];
let welcomeScreen, playButton;
let onWelcomeScreen = true;

let counter;
let timerText, countdownTimer, scoreText;
let savedFrog;
let jumpSound, smashedSound, traficSound;


function init() {

}

function preload() {
    this.load.image('background', './assets/images/FroggerBackground.png');
    this.load.image('frog', './assets/images/Frog.png');
    this.load.image('mumFrog', './assets/images/mumfrog.png');
    this.load.image('heart', './assets/images/heart.png');
    this.load.image('deadFrog', './assets/images/deadFrog.png');
    this.load.image('car0', './assets/images/car.png');
    this.load.image('car1', './assets/images/snowCar.png');
    this.load.image('car2', './assets/images/F1-1.png');
    this.load.image('welcomeScreen', './assets/images/TitleScreen.png');
    this.load.image('startGame', './assets/images/playButton.webp');

    this.load.audio('jump', './assets/audio/coaac.wav');
    this.load.audio('smashed', './assets/audio/smashed.wav');
    this.load.audio('trafic', './assets/audio/trafic.wav');

}

function create() {
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    BG = this.add.image(0, 0, 'background');
    BG.setOrigin(0, 0);

    frog = this.add.image(241, 296, 'frog');
    deadFrog = this.add.image(-100, -100, 'deadFrog');
    let numCaseMumFrog = Phaser.Math.Between(0, 25);
    mumFrog = this.add.image(numCaseMumFrog * 16, 0, 'mumFrog');
    mumFrog.setOrigin(0, 0);

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

    timerText = this.add.text(455, 0, "", { fontFamily: 'carterone', fontSize: 18, color: '#000000' });
    countdownTimer = this.time.addEvent({
        delay: 1000,
        callback: countdown,
        callbackScope: this,
        repeat: -1,
        paused: true
    });


    nbrCar = 60;

    for (let a = 0; a < 3; a++) {
        for (let i = 0; i < 10; i++) {
            let index = i + a * 10;
            let randomSpace = Phaser.Math.Between(- 15, 15);
            let randomCar = Phaser.Math.Between(0, 2);

            auto[index] = this.physics.add.image(-50 + i * 55 + randomSpace, 192 + a * 32, 'car' + randomCar);
            auto[index].setOrigin(0.0);
            auto[index].setVelocity(100, 0);

        }
    }

    for (let a = 0; a < 3; a++) {
        for (let i = 0; i < 10; i++) {
            let index =  30 + i + a * 10;
            let randomSpace = Phaser.Math.Between(-15, 15);
            let randomCar = Phaser.Math.Between(0, 2);
            auto[index] = this.physics.add.image(480 + i * 55 + randomSpace, 64 + a * 32, 'car' + randomCar);
            auto[index].setOrigin(0.0);
            auto[index].setAngle(180);
            auto[index].setVelocity(-100, 0);
        }
    }


    welcomeScreen = this.add.image(0, 0, 'welcomeScreen');
    welcomeScreen.setOrigin(0, 0);
    welcomeScreen.setScale(0.7);
    playButton = this.add.image(420, 260, 'startGame').setInteractive();
    playButton.setScale(0.1);
    playButton.on('pointerdown', startGame);

    scoreText = this.add.text(100, 200, "", { fontFamily: 'carterone', fontSize: 18, color: '#000000' });


    //firstCar = this.add.image(100, 200, "firstCar");

    jumpSound = this.sound.add('jump');
    smashedSound = this.sound.add('smashed');
    traficSound = this.sound.add('trafic');

}

function update() {

    if (!onWelcomeScreen) {

        // FROG MOVEMENTS & SCREEN LIMITE & ORIENTATION
        if (Phaser.Input.Keyboard.JustDown(down) && frog.y < 304) frog.y += 16, frog.setAngle(180), jumpSound.play();
        if (Phaser.Input.Keyboard.JustDown(up) && frog.y > 16) frog.y -= 16, frog.setAngle(0), jumpSound.play();
        if (Phaser.Input.Keyboard.JustDown(left) && frog.x > 16) frog.x -= 16, frog.setAngle(270), jumpSound.play();
        if (Phaser.Input.Keyboard.JustDown(right) && frog.x < 464) frog.x += 16, frog.setAngle(90), jumpSound.play();

    }


    // COLLISION DETECT WITH FROG & MUMFROG
    if (Phaser.Geom.Intersects.RectangleToRectangle(frog.getBounds(), mumFrog.getBounds())) {
        frog.x = -100;  // pour qu il ya  qu'une collision 
        tweenHeart.play();
        setTimeout(newFrog, 1000);
        savedFrog++;
    }

    for (let i = 0; i < nbrCar; i++) {
        if (i < 30 && auto[i].x > 500) auto[i].x = -50;
        if (i >= 30 && auto[i].x < -50) auto[i].x = 500;
        if (Phaser.Geom.Intersects.RectangleToRectangle(frog.getBounds(), auto[i].getBounds())) {
            deadFrog.setPosition(frog.x, frog.y);
            //tweenDeadFrog.play();
            frog.x = -100;
            setTimeout(newFrog, 3000);
            smashedSound.play();

        }
    }
}

function startGame() {
    welcomeScreen.setVisible(false);
    playButton.setVisible(false);
    onWelcomeScreen = false;
    countdownTimer.paused = false;
    savedFrog = 0;
    counter = 60;
    traficSound.play({ loop: true });
}

function countdown() {
    counter--;
    timerText.text = counter;
    if (counter == 0) gameOver();
}

function newFrog() {
    frog.setPosition(241, 296);
    deadFrog.setPosition(-100, -100);
}

function gameOver() {
    countdownTimer.paused = true;
    welcomeScreen.setVisible(true);
    playButton.setVisible(true);
    scoreText.text = "Vous avez sauvé " + savedFrog + " grenouille(s)";
}