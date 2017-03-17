function gameEngine() {
    var canvas;
    var ctx;
    var width;
    var height;
    var thickness;
    var smallest;
    var levels;
    var finishes;
    var level;
    var playerX;
    var radius;
    var playerY;
    var ground;
    var vVel;
    var hVel;
    var blockOn;
    var pageNum;
    var oPageNum;
    var playing;
    var inmenu;
    var isoptions;
    var islevelselect;
    var instructing;
    var watch;
    var accX;
    var gradient;

    this.init = function() {
        playerX = width / 12;
        playerY = height * 11 / 12 - thickness - radius;
        ground = false;
        accX = 0;
        vVel = 0;
        hVel = 0;
        blockOn = 0;
        pageNum = 0;
        oPageNum = 0;
        playing = false;
        inmenu = false;
        isoptions = false;
        islevelselect = false;
        instructing = false;

        canvas = document.getElementById("game-canvas");
        ctx = canvas.getContext('2d');
        
        bindEvents();
        size();
    };

    this.loadLevel = function(index) {
        level = index;
        playerX = width / 12;
        playerY = height - thickness - radius;
        hVel = 0;
        vVel = 0;
        blockOn = 0;
        ground = true;
        app.resources.audio.soundtrack.pause();
        if(!playing){
            playing = true;
            play();
        }
        window.location.hash = '#game-page';
    };
    
    this.reset = function(){
        playerX = width / 12;
        playerY = height - thickness - radius;hVel = 0;
        vVel = 0;
        blockOn = 0;
        ground = true;
    };

    function bindEvents() {
        watch = navigator.accelerometer ? navigator.accelerometer.watchAcceleration(accSuccess, accError, {frequency: 25}) : undefined;
        document.addEventListener("backbutton", stopRunning);
        document.addEventListener("pause", stopRunning);
        canvas.addEventListener('click', jump);
        window.addEventListener('resize', size);
        window.addEventListener('keydown', function(e) {
            switch (e.keyCode) {
                case 32:
                    jump();
                    break;
                case 37:
                    accX = 20;
                    break;
                case 39:
                    accX = -20;
                    break;
            }
        });
        window.addEventListener('keyup', function(e) {
            accX = 0;
        });
    }
    
    function size(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        width = canvas.width;
        height = canvas.height;
        smallest = (width <= height) ? width : height;
        radius = smallest * (1 / 24);
        thickness = smallest * (2 / 60);
        
        gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, "#2222FF");
        gradient.addColorStop(1, "#0000FF");

        //first block must be the block the player starts on
        levels = [
            [new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(0, height * (2 / 3), width * (1 / 3), thickness), new block(width * (2 / 3), height * (2 / 3), width * (2 / 3), thickness), new block(0, height * (1 / 3), width * (1 / 6), thickness), new block(width / 2, height / 3, width / 2, thickness)],
            [new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(0, height * (5 / 6), width * (1 / 6), thickness), new block(width * (5 / 6), height * (5 / 6), width * (1 / 6), thickness), new block(0, height / 2, width * (3 / 4), thickness), new block(width * (11 / 12), height / 2, width / 12, thickness), new block(0, height / 6, width / 6, thickness), new block(width / 3, height / 6, width / 3, thickness), new block(width * (5 / 6), height / 6, width / 6, thickness)],
            [new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2, height / 6, thickness, height * (5 / 6)), new block(width / 6, height * (3 / 4), width * (2 / 3), thickness), new block(0, height / 3, width / 6, thickness), new block(width / 3, height * (7 / 12), width / 6, thickness)],
            [new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width * (5 / 12), height * (7 / 12), width / 6, thickness), new block(width / 20, 0, thickness, height / 6)],
            [new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 3, height / 3, thickness, height * (2 / 3)), new block(width / 2, height / 4, thickness, height * (3 / 4)), new block(width * (2 / 3), height / 3, thickness, height * (2 / 3)), new block(width / 6, height * (3 / 4), width / 6, thickness), new block(0, height / 2, width / 6, thickness)],
            [new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2 - width / 12, height * 2 / 3, width / 6, thickness), new block(width * 2 / 3, height / 2, width / 6, thickness), new block(width / 2 - width / 12, height / 4, width / 6, thickness), new block(width / 12 - thickness, 0, thickness, height / 6)],
            [new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(0, height * 2 / 3, width / 3, thickness), new block(width / 3, height / 3, width / 3, thickness), new block(width * 7 / 12, 0, thickness, height / 6), new block(width - thickness - smallest / 12, height / 3, thickness + smallest / 12, thickness), new block(width - thickness - smallest / 12, height / 6, thickness, height / 6)],
            [new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(0, height * 2 / 3, width / 3, thickness), new block(width * 2 / 3, height * 2 / 3, width / 3, thickness), new block(width / 3, height / 3, width / 3, thickness), new block(width / 2 - smallest / 24 - thickness - smallest / 120, 0, thickness, height / 6), new block(width / 2 + smallest / 24 + smallest / 120, 0, thickness, height / 6)],
            [new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 3, height / 4, thickness, height * 3 / 4), new block(0, height * 11 / 18, width / 6, thickness)],
            [new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width * 11 / 24, height * 7 / 12, width / 12, thickness)],
            [new block(0, height - thickness, width / 2 + thickness, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2, height * 2 / 3, thickness, height / 3), new block(0, height / 3, width / 6, thickness)],
            [new block(0, height - thickness, width / 6, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2 - smallest / 12, height - thickness, smallest / 12, thickness), new block(width / 6, height * 2 / 3, thickness, height / 3), new block(width * 5 / 6 - thickness, height * 2 / 3, thickness, height / 3), new block(width / 6 + thickness, height * 2 / 3, width * 2 / 3 - width / 4, thickness), new block(width / 3, height * 3 / 4, width / 3, thickness), new block(width / 2, height * 3 / 4, thickness, height / 4)],
            [new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(0, height * 5 / 6, width * 2 / 3, thickness), new block(width * 5 / 6, height * 5 / 6, width / 6, thickness), new block(width * 5 / 6, height / 6, thickness, height * 2 / 3), new block(width * 2 / 3 - thickness, height * 2 / 3, thickness, height / 6), new block(0, height * 2 / 3, width / 2, thickness), new block(width / 2 - thickness, height / 6, thickness, height / 6 - height / 24), new block(width / 2 - thickness, height / 3 + height / 24, thickness, height / 3 - height / 24), new block(0, height / 6, width / 12, thickness)],
            [new block(0, height - thickness, width / 4, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 4, height * 5 / 6, thickness, height / 6), new block(width / 2, height * 2 / 3, thickness, height / 3), new block(width * 3 / 4, height * 7 / 12, thickness, height * 5 / 12), new block(0, height * 2 / 3, width / 4, thickness), new block(width / 4, height / 6, thickness, height / 2 + thickness), new block(width / 2, height / 12, thickness, height / 2), new block(width * 3 / 4, height / 6, thickness, height / 3), new block(width * 11 / 12, height / 4, width / 12, thickness)],
            [new block(0, height - thickness, width / 4, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2, height * 3 / 4, thickness, height / 4), new block(width / 4, height / 2, thickness, thickness), new block(width * 3 / 4, height / 4, thickness, thickness)],
            [new block(0, height - thickness, width / 2, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2 - thickness - smallest / 12, height / 12, thickness, height * 11 / 12), new block(width / 2 - smallest / 12, height / 12, width / 2, thickness), new block(width / 12, height * 5 / 6, thickness, thickness), new block(width / 6, height * 2 / 3, thickness, thickness), new block(width / 12, height / 2, thickness, thickness), new block(width / 6, height / 3, thickness, thickness), new block(width / 12, height / 6, thickness, thickness), new block(width - smallest - thickness, height / 12, thickness, height / 2)],
            [new block(0, height - thickness, width / 6, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2, height * 7 / 12, thickness, thickness), new block(width * 5 / 6, 0, thickness, height * 5 / 6), new block(width * 5 / 6, height * 11 / 12, thickness, height / 12)],
            [new block(0, height - thickness, width / 6, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 3, height * 5 / 6, thickness, thickness), new block(width * 2 / 3, height * 5 / 6, thickness, thickness), new block(0, height * 2 / 3, width * 2 / 3 - smallest / 20, thickness), new block(width * 2 / 3 + smallest / 20, height * 2 / 3, width / 3 - smallest / 20, thickness), new block(width * 2 / 3 - smallest / 20 - thickness, height / 6, thickness, height / 3), new block(width * 2 / 3 + smallest / 20, height / 6, thickness, height / 3)],
            [new block(0, height - thickness, width / 12, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2, height - thickness, thickness, thickness), new block(0, height * 5 / 6, width / 2 + 2 * thickness, thickness), new block(width / 2 + 2 * thickness + smallest / 8, height * 5 / 6, width * 3 / 4 - width / 2 - 2 * thickness - smallest / 8, thickness), new block(width * 3 / 4, height * 2 / 3, thickness, height / 3), new block(width * 3 / 4, height * 2 / 3, width / 8 + thickness, thickness), new block(width * 7 / 8, height / 6, thickness, height / 2), new block(width / 2, height / 6, width * 3 / 8, thickness), new block(width / 4, height / 4, width / 12, thickness), new block(width * 3 / 4 + thickness, height - thickness, width / 12 - thickness, thickness)],
            [new block(0, height - thickness, width, thickness), new block(0, height * 2 / 3, width, thickness), new block(0, height / 3, width, thickness)],
            [new block(0, height - thickness, width, thickness), new block(-thickness, height * 2 / 3, thickness, height / 3), new block(0, height * 2 / 3, width / 3, thickness), new block(width * 2 / 3, height * 2 / 3, width / 3, thickness), new block(0, height / 3, width, thickness), new block(width, -height, thickness, height * 2), new block(width / 2, 0, thickness, height / 3)],
            [new block(0, height - thickness, width, thickness), new block(0, -thickness, width, thickness), new block(-thickness, height * 3 / 4, thickness, height / 4), new block(width, 0, thickness, height / 2), new block(0, height / 4, width, thickness), new block(0, height * 2 / 4, width, thickness), new block(0, height * 3 / 4, width, thickness)],
            [new block(0, height - thickness, width / 6, thickness), new block(width, height * 5 / 6, thickness, height / 6), new block(width * 5 / 6, height, width / 6, thickness), new block(-thickness, height * 3 / 4, thickness, height / 4), new block(0, height * 3 / 4, width * 5 / 6, thickness), new block(width / 12, height / 2, width * 5 / 6, thickness), new block(0, height / 4, width, thickness), new block(0, -thickness, width, thickness)],
            [new block(0, height - thickness, width / 2 - smallest / 20, thickness), new block(0, 0, thickness, height / 2 - smallest / 20), new block(0, height / 2 + smallest / 20, thickness, height / 2), new block(width / 2 + smallest / 20, height - thickness, width / 2, thickness), new block(width - thickness, 0, thickness, height / 2 - smallest / 20), new block(width - thickness, height / 2 + smallest / 20, thickness, height / 2), new block(0, 0, width / 2 - smallest / 20, thickness), new block(width / 2 + smallest / 20, 0, width / 2, thickness), new block(width / 2 - smallest / 20 - thickness, height / 2 + smallest / 20, thickness, height / 2), new block(width * 3 / 4, height / 4, width / 4, thickness), new block(width / 4, height * 3 / 4, width / 4 - smallest / 20 - thickness, thickness)],
            [new block(0, height - thickness, width / 4, thickness), new block(-thickness, height * 11 / 12, thickness, height / 12), new block(-width / 4, -thickness, width / 2, thickness), new block(width - thickness, height * 7 / 12, thickness, height / 6), new block(width * 3 / 4, height * 7 / 12 + height / 6, width / 4, thickness), new block(0, height * 2 / 3, width / 4, thickness), new block(width / 4, height * 2 / 3, thickness, height / 3), new block(0, height / 3, width / 4, thickness), new block(width / 4, 0, thickness, height * 7 / 12 + thickness), new block(width / 4 + thickness, height * 7 / 12, width / 2, thickness), new block(width / 2, height * 7 / 12, thickness, height / 3), new block(width / 2, height - thickness, width / 3, thickness), new block(width * 3 / 4, height * 5 / 12, thickness, height / 3), new block(width / 4 + thickness, height * 5 / 12, width / 2 - thickness, thickness), new block(width * 3 / 4, -height / 3, thickness, height / 3 + smallest / 6 + thickness), new block(width * 3 / 4 + thickness, smallest / 6, smallest / 12, thickness), new block(width * 3 / 4 + thickness + smallest / 12, -height / 2, thickness, height / 2 + smallest / 6 + thickness)]
        ];
        finishes = new Array(new block(width * (25 / 600), height * (1 / 3) - smallest / 12, smallest / 12, smallest / 12), new block(width / 2, height / 6 - smallest / 12, smallest / 12, smallest / 12), new block(width * (32 / 60), height - thickness - smallest / 12, smallest / 12, smallest / 12), new block(width / 20 + thickness, height / 3, smallest / 12, smallest / 12), new block(width * (32 / 60), height - thickness - smallest / 12, smallest / 12, smallest / 12), new block(width / 12, height / 3, smallest / 12, smallest / 12), new block(width - smallest / 12, height / 3 - smallest / 12, smallest / 12, smallest / 12), new block(width / 2 - smallest / 24, 0, smallest / 12, smallest / 12), new block(width / 2, height / 2, smallest / 12, smallest / 12), new block(width / 6, height / 6, smallest / 12, smallest / 12), new block(width / 2 - smallest / 12, 0, smallest / 12, smallest / 12), new block(width / 2 - smallest / 12, height - smallest / 12 - thickness, smallest / 12, smallest / 12), new block(width - smallest / 12, height / 2, smallest / 12, smallest / 12), new block(width / 4 - smallest / 12, height / 2, smallest / 12, smallest / 12), new block(width / 2 - smallest / 12, 0, smallest / 12, smallest / 12), new block(width / 2 - smallest / 12, height - thickness - smallest / 12, smallest / 12, smallest / 12), new block(width * 11 / 12, height * 5 / 6, smallest / 12, smallest / 12), new block(width * 2 / 3 - smallest / 24, height / 4, smallest / 12, smallest / 12), new block(width * 3 / 4 + thickness, height * 2 / 3 + thickness, smallest / 12, smallest / 12), new block(width / 2 - smallest / 24, 0, smallest / 12, smallest / 12), new block(width - smallest / 12, height / 3 - smallest / 12, smallest / 12, smallest / 12), new block(width - smallest / 12, height / 4 - smallest / 12, smallest / 12, smallest / 12), new block(width / 2 - smallest / 24, 0, smallest / 12, smallest / 12), new block(width / 2 - smallest / 24, height, smallest / 12, smallest / 12), new block(width * 3 / 4 + thickness, smallest / 12, smallest / 12, smallest / 12));
    }

    function block(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    function play() {
        calculatePos();
        draw();
        atFinish();
        if (playing) {
            window.requestAnimationFrame(play);
        }
    }

    function jump() {
        if (playing && ground === true) {
            app.resources.audio.pew.play();
            ground = false;
            vVel = -height / 60;
        }
    }

    function draw() {
        var blocks = levels[level];
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "Green";
        for (i = 0; i < blocks.length; i++) {
            ctx.fillRect(blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
        }
        ctx.fillStyle = "Red";
        ctx.fillRect(finishes[level].x, finishes[level].y, finishes[level].width, finishes[level].height);
        ctx.drawImage(app.characters[app.userData.charIndex], playerX - radius, playerY - radius, 2 * radius, 2 * radius);
    }

    function calculatePos() {
        if (ground) {
            hVel -= 50 * accX / width;
            var collision = calculateCollision(playerX + hVel, playerY);
            if (collision === -1) {
                playerX += hVel;
            }
            else {
                if (hVel > 0) {
                    playerX = levels[level][collision].x - radius;
                    hVel = 0;
                }
                else {
                    playerX = levels[level][collision].x + levels[level][collision].width + radius;
                    hVel = 0;
                }
            }
            var onBlock = levels[level][blockOn];
            if (playerX + radius <= onBlock.x || playerX - radius >= onBlock.x + onBlock.width) {
                ground = false;
            }
        }
        else {
            vVel += height / 3000;
            var collision = calculateCollision(playerX + hVel, playerY + vVel);
            if (collision === -1) {
                hVel -= 50 * accX / width;
                playerX += hVel;
                playerY += vVel;
            }
            else if (collision === 0) {
                vVel = 0;
                playerY = height - thickness - radius;
                ground = true;
                blockOn = 0;
            }
            else {
                if ((playerY + vVel - radius) < levels[level][collision].y + levels[level][collision].height && (playerY + vVel - radius) > levels[level][collision].y + levels[level][collision].height - thickness * 3 / 2 && vVel < 0) {
                    vVel = 0;
                    playerY = levels[level][collision].y + levels[level][collision].height + radius;
                }
                else if ((playerY + vVel + radius) < levels[level][collision].y + thickness * 3 / 2 && (playerY + vVel + radius) > levels[level][collision].y && vVel > 0) {
                    vVel = 0;
                    playerY = levels[level][collision].y - radius;
                    ground = true;
                    blockOn = collision;
                }
                else {
                    playerY += vVel;
                    hVel -= 50 * accX / width;
                    if ((playerX + hVel + radius) < levels[level][collision].x + thickness * 3 / 2 && (playerX + hVel + radius) > levels[level][collision].x && hVel >= 0) {
                        hVel = 0;
                        playerX = levels[level][collision].x - radius;
                    }
                    else if ((playerX + hVel - radius) < levels[level][collision].x + levels[level][collision].width && (playerX + hVel - radius) > levels[level][collision].x + levels[level][collision].width - thickness * 3 / 2 && hVel <= 0) {
                        hVel = 0;
                        playerX = levels[level][collision].x + levels[level][collision].width + radius;
                    }
                }
            }
        }
        if (playerY > height * 5 / 4 || playerX < -width / 2 || playerX > width * 3 / 2) {
            app.resources.audio.falling.play();
        }
    }

    function calculateCollision(x, y) {
        var blocks = levels[level];
        var collision = -1;
        for (var i = 0; i < blocks.length; i++) {
            if ((blocks[i].x + blocks[i].width) > (x - radius) && blocks[i].x < (x + radius) && (blocks[i].y + blocks[i].height) > (y - radius) && blocks[i].y < (y + radius)) {
                collision = i;
            }
        }
        return collision;
    }

    function atFinish() {
        if (playerX - radius >= finishes[level].x - width / 60 && playerX + radius <= finishes[level].x + width / 60 + finishes[level].width && playerY + radius <= finishes[level].y + finishes[level].height + height / 60 && playerY - radius >= finishes[level].y - height / 60) {
            if (level < levels.length - 1) {
                app.resources.audio.cheering.play();
                level++;
                app.userData.unlocks[level] = true;
                app.storeUserData('unlocks');
                window.location.href = '#level-select-page';
            }
            else {
                app.resources.audio.cheering.play();
                window.location.href = '#win-page';
            }
            playing = false;
        }
    }

    function accSuccess(acceleration) {
        accX = acceleration.x;
    }

    function accError() {
        alert("Accelerometer Error");
    }

    function stopRunning() {
        navigator.app.exitApp();
    }
}