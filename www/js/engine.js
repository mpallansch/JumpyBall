function gameEngine() {
    var engine = this;
    var canvas;
    var ctx;
    var width;
    var height;
    var thickness;
    var smallest;
    var levels;
    var finishes;
    var finishWidthTol;
    var finishHeightTol;
    var interval;
    var $blocks;
    var level;
    var playerX;
    var playerY;
    var minY;
    var radius;
    var radiusNeg;
    var diameter;
    var ground;
    var vVel;
    var hVel;
    var gravity;
    var angle;
    var blockOn;
    var pageNum;
    var oPageNum;
    var playing;
    var inmenu;
    var isoptions;
    var islevelselect;
    var instructing;
    var gamma;
    var accX;
    var accUnitPos;
    var accUnitNeg;
    var accUnitGamma;
    var rightEdge;
    var leftEdge;
    var topEdge;
    var bottomEdge;
    var threeHalvesThickness;
    var threeHalvesWidth;
    var fiveFourthsHeight;
    var negHalfWidth;
    var twoPi = 2 * Math.PI;

    this.init = function() {
        ground = false;
        accX = 0;
        vVel = 0;
        hVel = 0;
        angle = 0;
        blockOn = 0;
        pageNum = 0;
        oPageNum = 0;
        playing = false;
        inmenu = false;
        isoptions = false;
        islevelselect = false;
        instructing = false;

        $blocks = $('#blocks');
        canvas = document.getElementById("game-canvas");
        ctx = canvas.getContext('2d');
        
        size();
    };

    this.loadLevel = function() {
        level = app.level;
        playerX = width / 12;
        playerY = height - thickness - radius;
        hVel = 0;
        vVel = 0;
        blockOn = 0;
        ground = true;
        app.resources.audio.soundtrack.pause();
        
        $blocks.empty();
        levels[level].forEach(function(block){
            $blocks.append($('<div/>').addClass('block').css({
                left: block.x,
                top: block.y,
                width: block.width,
                height: block.height
            }));
        });
        $blocks.append($('<div/>').addClass('finish').css({
            left: finishes[level].x,
            top: finishes[level].y,
            width: finishes[level].width,
            height: finishes[level].height
        }));
    };
    
    this.reset = function(){
        playerX = width / 12;
        playerY = height - thickness - radius;
        hVel = 0;
        vVel = 0;
        blockOn = 0;
        ground = true;
    };
   
    this.play = function() {
        playing = true;
        bindEvents();
        size();
        draw();
        interval = setInterval(function(){
            calculatePos();
            atFinish();
            if(!playing){
                clearInterval(interval);
            }
        }, 25);
    };
    
    this.stopPlaying = function(){
        removeEvents();
        playing = false;
    };

    function bindEvents() {
        canvas.addEventListener('click', jump);
        window.addEventListener('resize', size);
        window.addEventListener('deviceorientation', acceleromoter);
        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);
    }
    
    function removeEvents(){
        canvas.removeEventListener('click', jump);
        window.removeEventListener('resize', size);
        window.removeEventListener('deviceorientation', acceleromoter);
        window.removeEventListener('keydown', keydown);
        window.removeEventListener('keyup', keyup);
    }
    
    function keydown(e){
        switch (e.keyCode) {
            case 32:
                jump();
                break;
            case 37:
                accX = accUnitPos;
                break;
            case 39:
                accX = accUnitNeg;
                break;
        }
    }
    
    function keyup(){
        accX = 0;
    }
    
    
    function size(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        width = canvas.width;
        height = canvas.height;
        smallest = (width <= height) ? width : height;
        radius = smallest * (1 / 24);
        radiusNeg = -1 * radius;
        diameter = radius * 2;
        thickness = smallest * (2 / 60);
        finishWidthTol = width / 60;
        finishHeightTol = height / 60;
        accUnitPos = width / 1000;
        accUnitNeg = width / -1000;
        accUnitGamma = width / -6000;
        gravity = height / 3000;
        minY = height - thickness - radius;
        threeHalvesThickness = thickness * 3 / 2;
        threeHalvesWidth = width * 3 / 2;
        fiveFourthsHeight = height * 5 / 4;
        negHalfWidth = width / -2;

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
        finishes = [
            new block(width * (25 / 600), height * (1 / 3) - smallest / 12, smallest / 12, smallest / 12, true), 
            new block(width / 2, height / 6 - smallest / 12, smallest / 12, smallest / 12, true), 
            new block(width * (32 / 60), height - thickness - smallest / 12, smallest / 12, smallest / 12, true), 
            new block(width / 20 + thickness, height / 3, smallest / 12, smallest / 12, true), 
            new block(width * (32 / 60), height - thickness - smallest / 12, smallest / 12, smallest / 12, true), 
            new block(width / 12, height / 3, smallest / 12, smallest / 12, true), 
            new block(width - smallest / 12, height / 3 - smallest / 12, smallest / 12, smallest / 12, true), 
            new block(width / 2 - smallest / 24, 0, smallest / 12, smallest / 12, true), 
            new block(width / 2, height / 2, smallest / 12, smallest / 12, true), 
            new block(width / 6, height / 6, smallest / 12, smallest / 12, true), 
            new block(width / 2 - smallest / 12, 0, smallest / 12, smallest / 12, true), 
            new block(width / 2 - smallest / 12, height - smallest / 12 - thickness, smallest / 12, smallest / 12, true), 
            new block(width - smallest / 12, height / 2, smallest / 12, smallest / 12, true), 
            new block(width / 4 - smallest / 12, height / 2, smallest / 12, smallest / 12, true), 
            new block(width / 2 - smallest / 12, 0, smallest / 12, smallest / 12, true), 
            new block(width / 2 - smallest / 12, height - thickness - smallest / 12, smallest / 12, smallest / 12, true), 
            new block(width * 11 / 12, height * 5 / 6, smallest / 12, smallest / 12, true), 
            new block(width * 2 / 3 - smallest / 24, height / 4, smallest / 12, smallest / 12, true), 
            new block(width * 3 / 4 + thickness, height * 2 / 3 + thickness, smallest / 12, smallest / 12, true), 
            new block(width / 2 - smallest / 24, 0, smallest / 12, smallest / 12, true), 
            new block(width - smallest / 12, height / 3 - smallest / 12, smallest / 12, smallest / 12, true), 
            new block(width - smallest / 12, height / 4 - smallest / 12, smallest / 12, smallest / 12, true), 
            new block(width / 2 - smallest / 24, 0, smallest / 12, smallest / 12, true), 
            new block(width / 2 - smallest / 24, height, smallest / 12, smallest / 12, true), 
            new block(width * 3 / 4 + thickness, smallest / 12, smallest / 12, smallest / 12, true)
        ];
        
        engine.loadLevel();
        engine.reset();
    }

    function block(x, y, width, height, finish) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xEdge = x + width;
        this.yEdge = y + height;
        if(finish){
            this.finishLeftEdge = this.x - finishWidthTol;
            this.finishRightEdge = this.xEdge + finishWidthTol;
            this.finishTopEdge = this.y - finishHeightTol;
            this.finishBottomEdge = this.yEdge + finishHeightTol;
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
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.translate(playerX, playerY);
        ctx.rotate(angle);
        ctx.drawImage(app.characters[app.userData.charIndex], radiusNeg, radiusNeg, diameter, diameter);
        ctx.restore();
        if (playing) {
            window.requestAnimationFrame(draw);
        }
    }

    function calculatePos() {
        if(gamma){
            accX = gamma * accUnitGamma;
        }
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
            vVel += gravity;
            var collision = calculateCollision(playerX + hVel, playerY + vVel);
            if (collision === -1) {
                hVel -= 50 * accX / width;
                playerX += hVel;
                playerY += vVel;
            }
            else if (collision === 0) {
                vVel = 0;
                playerY = minY;
                ground = true;
                blockOn = 0;
            }
            else {
                if ((topEdge = playerY + vVel - radius) < levels[level][collision].y + levels[level][collision].height && topEdge > levels[level][collision].y + levels[level][collision].height - threeHalvesThickness && vVel < 0) {
                    vVel = 0;
                    playerY = levels[level][collision].y + levels[level][collision].height + radius;
                }
                else if ((bottomEdge = playerY + vVel + radius) < levels[level][collision].y + threeHalvesThickness && bottomEdge > levels[level][collision].y && vVel > 0) {
                    vVel = 0;
                    playerY = levels[level][collision].y - radius;
                    ground = true;
                    blockOn = collision;
                }
                else {
                    playerY += vVel;
                    hVel -= 50 * accX / width;
                    if ((rightEdge = playerX + hVel + radius) < levels[level][collision].x + threeHalvesThickness && rightEdge > levels[level][collision].x && hVel >= 0) {
                        hVel = 0;
                        playerX = levels[level][collision].x - radius;
                    }
                    else if ((leftEdge = playerX + hVel - radius) < levels[level][collision].x + levels[level][collision].width && leftEdge > levels[level][collision].x + levels[level][collision].width - threeHalvesThickness && hVel <= 0) {
                        hVel = 0;
                        playerX = levels[level][collision].x + levels[level][collision].width + radius;
                    }
                }
            }
        }
        angle += (hVel * .03);
        if(angle > twoPi){
            angle -= twoPi;
        }
        if(angle < 0) {
            angle += twoPi;
        }
        if (playerY > fiveFourthsHeight || playerX < negHalfWidth || playerX > threeHalvesWidth) {
            app.resources.audio.falling.play();
        }
    }

    function calculateCollision(x, y) {
        var blocks = levels[level];
        var collision = -1;
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].xEdge > (x - radius) && blocks[i].x < (x + radius) && blocks[i].yEdge > (y - radius) && blocks[i].y < (y + radius)) {
                collision = i;
            }
        }
        return collision;
    }

    function atFinish() {
        if (playerX - radius >= finishes[level].finishLeftEdge && playerX + radius <= finishes[level].finishRightEdge && playerY + radius <= finishes[level].finishBottomEdge && playerY - radius >= finishes[level].finishTopEdge) {
            if (level < levels.length - 1) {
                level++;
                blockOn = 0;
                app.resources.audio.cheering.play();
                app.userData.unlocks[level] = true;
                app.storeUserData('unlocks');
                window.location.href = '#level-select-page';
            }
            else {
                app.resources.audio.cheering.play();
                window.location.href = '#win-page';
            }
            engine.stopPlaying();
        }
    }

    function acceleromoter(acceleration) {
        gamma = acceleration.gamma;
    }
}