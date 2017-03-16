var app = {
    initialize: function() {
        if (window.cordova) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        } else {
            $(document).ready(this.onDeviceReady);
        }
    },
    onDeviceReady: function() {
        app.$pages = $('.page');
        app.$loading = $('#loading-modal');
        app.$resources = $('#resources');
        
        app.$levelList = $('#level-list');
        
        $(window).on('hashchange', app.navigate);
        
        app.loadResources();
        console.log(app.resources);
        app.loadUserData();
        app.navigate();
        
        
        var canvas;
        var ctx;
        var width;
        var height;
        var thickness;
        var smallest;
        var level1blocks;
        var level2blocks;
        var level3blocks;
        var level4blocks;
        var level5blocks;
        var level6blocks;
        var level7blocks;
        var level8blocks;
        var level9blocks;
        var level10blocks;
        var levels;
        var finishes;
        var frameRate;
        var engine;
        var timer;
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
        var chars;
        var fontSize;
        var hammertouch;

        function init() {
            
            document.addEventListener("backbutton", stopRunning, false);
            document.addEventListener("pause", stopRunning, false);
            watch = navigator.accelerometer ? navigator.accelerometer.watchAcceleration(accSuccess, accError, {frequency: 25}) : undefined;
            canvas = document.getElementById("game-canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx = canvas.getContext('2d');

            width = canvas.width;
            height = canvas.height;
            if (width <= height) {
                smallest = width;
            }
            else {
                smallest = height;
            }
            radius = smallest * (1 / 24);
            thickness = smallest * (2 / 60);

            //first block must be the block the player starts on
            level1blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(0, height * (2 / 3), width * (1 / 3), thickness), new block(width * (2 / 3), height * (2 / 3), width * (2 / 3), thickness), new block(0, height * (1 / 3), width * (1 / 6), thickness), new block(width / 2, height / 3, width / 2, thickness));
            level2blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(0, height * (5 / 6), width * (1 / 6), thickness), new block(width * (5 / 6), height * (5 / 6), width * (1 / 6), thickness), new block(0, height / 2, width * (3 / 4), thickness), new block(width * (11 / 12), height / 2, width / 12, thickness), new block(0, height / 6, width / 6, thickness), new block(width / 3, height / 6, width / 3, thickness), new block(width * (5 / 6), height / 6, width / 6, thickness));
            level3blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2, height / 6, thickness, height * (5 / 6)), new block(width / 6, height * (3 / 4), width * (2 / 3), thickness), new block(0, height / 3, width / 6, thickness), new block(width / 3, height * (7 / 12), width / 6, thickness));
            level4blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width * (5 / 12), height * (7 / 12), width / 6, thickness), new block(width / 20, 0, thickness, height / 6));
            level5blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 3, height / 3, thickness, height * (2 / 3)), new block(width / 2, height / 4, thickness, height * (3 / 4)), new block(width * (2 / 3), height / 3, thickness, height * (2 / 3)), new block(width / 6, height * (3 / 4), width / 6, thickness), new block(0, height / 2, width / 6, thickness));
            level6blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2 - width / 12, height * 2 / 3, width / 6, thickness), new block(width * 2 / 3, height / 2, width / 6, thickness), new block(width / 2 - width / 12, height / 4, width / 6, thickness), new block(width / 12 - thickness, 0, thickness, height / 6));
            level7blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(0, height * 2 / 3, width / 3, thickness), new block(width / 3, height / 3, width / 3, thickness), new block(width * 7 / 12, 0, thickness, height / 6), new block(width - thickness - smallest / 12, height / 3, thickness + smallest / 12, thickness), new block(width - thickness - smallest / 12, height / 6, thickness, height / 6));
            level8blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(0, height * 2 / 3, width / 3, thickness), new block(width * 2 / 3, height * 2 / 3, width / 3, thickness), new block(width / 3, height / 3, width / 3, thickness), new block(width / 2 - smallest / 24 - thickness - smallest / 120, 0, thickness, height / 6), new block(width / 2 + smallest / 24 + smallest / 120, 0, thickness, height / 6));
            level9blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 3, height / 4, thickness, height * 3 / 4), new block(0, height * 11 / 18, width / 6, thickness));
            level10blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width * 11 / 24, height * 7 / 12, width / 12, thickness));
            level11blocks = new Array(new block(0, height - thickness, width / 2 + thickness, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2, height * 2 / 3, thickness, height / 3), new block(0, height / 3, width / 6, thickness));
            level12blocks = new Array(new block(0, height - thickness, width / 6, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2 - smallest / 12, height - thickness, smallest / 12, thickness), new block(width / 6, height * 2 / 3, thickness, height / 3), new block(width * 5 / 6 - thickness, height * 2 / 3, thickness, height / 3), new block(width / 6 + thickness, height * 2 / 3, width * 2 / 3 - width / 4, thickness), new block(width / 3, height * 3 / 4, width / 3, thickness), new block(width / 2, height * 3 / 4, thickness, height / 4));
            level13blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(0, height * 5 / 6, width * 2 / 3, thickness), new block(width * 5 / 6, height * 5 / 6, width / 6, thickness), new block(width * 5 / 6, height / 6, thickness, height * 2 / 3), new block(width * 2 / 3 - thickness, height * 2 / 3, thickness, height / 6), new block(0, height * 2 / 3, width / 2, thickness), new block(width / 2 - thickness, height / 6, thickness, height / 6 - height / 24), new block(width / 2 - thickness, height / 3 + height / 24, thickness, height / 3 - height / 24), new block(0, height / 6, width / 12, thickness));
            level14blocks = new Array(new block(0, height - thickness, width / 4, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 4, height * 5 / 6, thickness, height / 6), new block(width / 2, height * 2 / 3, thickness, height / 3), new block(width * 3 / 4, height * 7 / 12, thickness, height * 5 / 12), new block(0, height * 2 / 3, width / 4, thickness), new block(width / 4, height / 6, thickness, height / 2 + thickness), new block(width / 2, height / 12, thickness, height / 2), new block(width * 3 / 4, height / 6, thickness, height / 3), new block(width * 11 / 12, height / 4, width / 12, thickness));
            level15blocks = new Array(new block(0, height - thickness, width / 4, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2, height * 3 / 4, thickness, height / 4), new block(width / 4, height / 2, thickness, thickness), new block(width * 3 / 4, height / 4, thickness, thickness));
            level16blocks = new Array(new block(0, height - thickness, width / 2, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2 - thickness - smallest / 12, height / 12, thickness, height * 11 / 12), new block(width / 2 - smallest / 12, height / 12, width / 2, thickness), new block(width / 12, height * 5 / 6, thickness, thickness), new block(width / 6, height * 2 / 3, thickness, thickness), new block(width / 12, height / 2, thickness, thickness), new block(width / 6, height / 3, thickness, thickness), new block(width / 12, height / 6, thickness, thickness), new block(width - smallest - thickness, height / 12, thickness, height / 2));
            level17blocks = new Array(new block(0, height - thickness, width / 6, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2, height * 7 / 12, thickness, thickness), new block(width * 5 / 6, 0, thickness, height * 5 / 6), new block(width * 5 / 6, height * 11 / 12, thickness, height / 12));
            level18blocks = new Array(new block(0, height - thickness, width / 6, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 3, height * 5 / 6, thickness, thickness), new block(width * 2 / 3, height * 5 / 6, thickness, thickness), new block(0, height * 2 / 3, width * 2 / 3 - smallest / 20, thickness), new block(width * 2 / 3 + smallest / 20, height * 2 / 3, width / 3 - smallest / 20, thickness), new block(width * 2 / 3 - smallest / 20 - thickness, height / 6, thickness, height / 3), new block(width * 2 / 3 + smallest / 20, height / 6, thickness, height / 3));
            level19blocks = new Array(new block(0, height - thickness, width / 12, thickness), new block(-thickness, 0, thickness, height), new block(0, -thickness, width, thickness), new block(width, 0, thickness, height), new block(width / 2, height - thickness, thickness, thickness), new block(0, height * 5 / 6, width / 2 + 2 * thickness, thickness), new block(width / 2 + 2 * thickness + smallest / 8, height * 5 / 6, width * 3 / 4 - width / 2 - 2 * thickness - smallest / 8, thickness), new block(width * 3 / 4, height * 2 / 3, thickness, height / 3), new block(width * 3 / 4, height * 2 / 3, width / 8 + thickness, thickness), new block(width * 7 / 8, height / 6, thickness, height / 2), new block(width / 2, height / 6, width * 3 / 8, thickness), new block(width / 4, height / 4, width / 12, thickness), new block(width * 3 / 4 + thickness, height - thickness, width / 12 - thickness, thickness));
            level20blocks = new Array(new block(0, height - thickness, width, thickness), new block(0, height * 2 / 3, width, thickness), new block(0, height / 3, width, thickness));
            level21blocks = new Array(new block(0, height - thickness, width, thickness), new block(-thickness, height * 2 / 3, thickness, height / 3), new block(0, height * 2 / 3, width / 3, thickness), new block(width * 2 / 3, height * 2 / 3, width / 3, thickness), new block(0, height / 3, width, thickness), new block(width, -height, thickness, height * 2), new block(width / 2, 0, thickness, height / 3));
            level22blocks = new Array(new block(0, height - thickness, width, thickness), new block(0, -thickness, width, thickness), new block(-thickness, height * 3 / 4, thickness, height / 4), new block(width, 0, thickness, height / 2), new block(0, height / 4, width, thickness), new block(0, height * 2 / 4, width, thickness), new block(0, height * 3 / 4, width, thickness));
            level23blocks = new Array(new block(0, height - thickness, width / 6, thickness), new block(width, height * 5 / 6, thickness, height / 6), new block(width * 5 / 6, height, width / 6, thickness), new block(-thickness, height * 3 / 4, thickness, height / 4), new block(0, height * 3 / 4, width * 5 / 6, thickness), new block(width / 12, height / 2, width * 5 / 6, thickness), new block(0, height / 4, width, thickness), new block(0, -thickness, width, thickness));
            level24blocks = new Array(new block(0, height - thickness, width / 2 - smallest / 20, thickness), new block(0, 0, thickness, height / 2 - smallest / 20), new block(0, height / 2 + smallest / 20, thickness, height / 2), new block(width / 2 + smallest / 20, height - thickness, width / 2, thickness), new block(width - thickness, 0, thickness, height / 2 - smallest / 20), new block(width - thickness, height / 2 + smallest / 20, thickness, height / 2), new block(0, 0, width / 2 - smallest / 20, thickness), new block(width / 2 + smallest / 20, 0, width / 2, thickness), new block(width / 2 - smallest / 20 - thickness, height / 2 + smallest / 20, thickness, height / 2), new block(width * 3 / 4, height / 4, width / 4, thickness), new block(width / 4, height * 3 / 4, width / 4 - smallest / 20 - thickness, thickness));
            level25blocks = new Array(new block(0, height - thickness, width / 4, thickness), new block(-thickness, height * 11 / 12, thickness, height / 12), new block(-width / 4, -thickness, width / 2, thickness), new block(width - thickness, height * 7 / 12, thickness, height / 6), new block(width * 3 / 4, height * 7 / 12 + height / 6, width / 4, thickness), new block(0, height * 2 / 3, width / 4, thickness), new block(width / 4, height * 2 / 3, thickness, height / 3), new block(0, height / 3, width / 4, thickness), new block(width / 4, 0, thickness, height * 7 / 12 + thickness), new block(width / 4 + thickness, height * 7 / 12, width / 2, thickness), new block(width / 2, height * 7 / 12, thickness, height / 3), new block(width / 2, height - thickness, width / 3, thickness), new block(width * 3 / 4, height * 5 / 12, thickness, height / 3), new block(width / 4 + thickness, height * 5 / 12, width / 2 - thickness, thickness), new block(width * 3 / 4, -height / 3, thickness, height / 3 + smallest / 6 + thickness), new block(width * 3 / 4 + thickness, smallest / 6, smallest / 12, thickness), new block(width * 3 / 4 + thickness + smallest / 12, -height / 2, thickness, height / 2 + smallest / 6 + thickness));
            levels = new Array(level1blocks, level2blocks, level3blocks, level4blocks, level5blocks, level6blocks, level7blocks, level8blocks, level9blocks, level10blocks, level11blocks, level12blocks, level13blocks, level14blocks, level15blocks, level16blocks, level17blocks, level18blocks, level19blocks, level20blocks, level21blocks, level22blocks, level23blocks, level24blocks, level25blocks);
            finishes = new Array(new block(width * (25 / 600), height * (1 / 3) - smallest / 12, smallest / 12, smallest / 12), new block(width / 2, height / 6 - smallest / 12, smallest / 12, smallest / 12), new block(width * (32 / 60), height - thickness - smallest / 12, smallest / 12, smallest / 12), new block(width / 20 + thickness, height / 3, smallest / 12, smallest / 12), new block(width * (32 / 60), height - thickness - smallest / 12, smallest / 12, smallest / 12), new block(width / 12, height / 3, smallest / 12, smallest / 12), new block(width - smallest / 12, height / 3 - smallest / 12, smallest / 12, smallest / 12), new block(width / 2 - smallest / 24, 0, smallest / 12, smallest / 12), new block(width / 2, height / 2, smallest / 12, smallest / 12), new block(width / 6, height / 6, smallest / 12, smallest / 12), new block(width / 2 - smallest / 12, 0, smallest / 12, smallest / 12), new block(width / 2 - smallest / 12, height - smallest / 12 - thickness, smallest / 12, smallest / 12), new block(width - smallest / 12, height / 2, smallest / 12, smallest / 12), new block(width / 4 - smallest / 12, height / 2, smallest / 12, smallest / 12), new block(width / 2 - smallest / 12, 0, smallest / 12, smallest / 12), new block(width / 2 - smallest / 12, height - thickness - smallest / 12, smallest / 12, smallest / 12), new block(width * 11 / 12, height * 5 / 6, smallest / 12, smallest / 12), new block(width * 2 / 3 - smallest / 24, height / 4, smallest / 12, smallest / 12), new block(width * 3 / 4 + thickness, height * 2 / 3 + thickness, smallest / 12, smallest / 12), new block(width / 2 - smallest / 24, 0, smallest / 12, smallest / 12), new block(width - smallest / 12, height / 3 - smallest / 12, smallest / 12, smallest / 12), new block(width - smallest / 12, height / 4 - smallest / 12, smallest / 12, smallest / 12), new block(width / 2 - smallest / 24, 0, smallest / 12, smallest / 12), new block(width / 2 - smallest / 24, height, smallest / 12, smallest / 12), new block(width * 3 / 4 + thickness, smallest / 12, smallest / 12, smallest / 12));
            retrieve();

            frameRate = 1000 / 60;
            engine = new gameEngine();
            level = 0;
            playerX = width / 12;
            playerY = height * 11 / 12 - thickness - radius;
            ground = false;
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
            gradient = ctx.createLinearGradient(0, height, 0, 0);
            gradient.addColorStop(0, "#2222FF");
            gradient.addColorStop(1, "#0000FF");

            chars = new Array(app.resources.images.ball, app.resources.images.nyan, app.resources.images.pacman, app.resources.images.doge, app.resources.images.troll, app.resources.images.cage, app.resources.images.yyouno, app.resources.images.accepted, app.resources.images.lol, app.resources.images.didthere);

            fontSize = parseInt((width + height) / 2 * (2 / 60));
            ctx.font = fontSize + "pt Times New Roman";

            hammertouch = Hammer(canvas).on("touch", function(event) {
                x = event.gesture.center.pageX;
                y = event.gesture.center.pageY;
                if (ismenu) {
                    if (x < width * 2 / 3 && x > width / 3 && y > height * 5 / 12 && y < height * 5 / 12 + height / 12) {
                        ismenu = false;
                        islevelselect = true;
                        levelSelect();
                    }
                    if (x < width * 2 / 3 && x > width / 3 && y > height * 7 / 12 && y < height * 7 / 12 + height / 12) {
                        ismenu = false;
                        instructions();
                    }
                    if (x < width * 2 / 3 && x > width / 3 && y > height * 3 / 4 && y < height * 3 / 4 + height / 12) {
                        ismenu = false;
                        optionsMenu();
                    }
                }
                else if (islevelselect) {
                    if (x < smallest / 8 && y < height && y > height - smallest / 8 && pageNum > 0) {
                        pageNum--;
                        levelSelect();
                    }
                    if (x < width && x > width - smallest / 8 && y < height && y > height - smallest / 8 && (pageNum + 1) * 5 < levels.length) {
                        pageNum++;
                        levelSelect();
                    }
                    if (x < width && x > width - smallest / 8 && y < smallest / 8 && y > 0) {
                        islevelselect = false;
                        menu();
                    }
                    if (x < width * 2 / 3 && x > width / 3) {
                        if (y < height * 6 / 7 && y > height / 7) {
                            if (pageNum * 5 + Math.floor((y - height / 7) / ((height * 6 / 7 - height / 7) / 5)) < levels.length && app.userData.unlocks[pageNum * 5 + Math.floor((y - height / 7) / ((height * 6 / 7 - height / 7) / 5))] === true) {
                                level = pageNum * 5 + Math.floor((y - height / 7) / ((height * 6 / 7 - height / 7) / 5));
                                islevelselect = false;
                                playing = true;
                                playerX = width / 12;
                                playerY = height - thickness - radius;
                                hVel = 0;
                                vVel = 0;
                                blockOn = 0;
                                ground = true;
                                app.resources.audio.soundtrack.pause();
                                play();
                            }
                        }
                    }

                }
                else if (isoptions) {
                    if (x < smallest / 8 && y < height && y > height - smallest / 8 && oPageNum > 0) {
                        oPageNum--;
                        optionsMenu();
                    }
                    if (x < width && x > width - smallest / 8 && y < height && y > height - smallest / 8 && (oPageNum + 1) * 5 < chars.length) {
                        oPageNum++;
                        optionsMenu();
                    }
                    if (x < width && x > width - smallest / 8 && y < smallest / 8 && y > 0) {
                        isoptions = false;
                        menu();
                    }
                    if (x < width * 2 / 3 && x > width / 3) {
                        if (y < height * 6 / 7 && y > height / 7) {
                            if (oPageNum * 5 + Math.floor((y - height / 7) / ((height * 6 / 7 - height / 7) / 5)) < chars.length) {
                                app.userData.charIndex = oPageNum * 5 + Math.floor((y - height / 7) / ((height * 6 / 7 - height / 7) / 5));
                                store(1);
                                optionsMenu();
                            }
                        }
                    }

                }
                else if (instructing) {
                    if (x < width && x > width - smallest / 8 && y < smallest / 8 && y > 0) {
                        instructing = false;
                        menu();
                    }
                }
                else if (playing) {
                    if (x < smallest / 8 && x > 0 && y > 0 && y < smallest / 8) {
                        playerX = width / 12;
                        playerY = height - thickness - radius;
                        hVel = 0;
                        vVel = 0;
                        blockOn = 0;
                        ground = true;
                    }
                    else if (x < width && x > width - smallest / 8 && y < smallest / 8 && y > 0) {
                        playing = false;
                        menu();
                    }
                    else if (ground === true) {
                        app.resources.audio.pew.play();
                        ground = false;
                        vVel = -height / 60;
                    }
                }
            });

            menu();
        }

        function gameEngine() {
            this.draw = function() {
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
                ctx.drawImage(chars[app.userData.charIndex], playerX - radius, playerY - radius, 2 * radius, 2 * radius);
                ctx.fillText("Level: " + (level + 1), width * (2 / 3), height / 12);
                ctx.drawImage(app.resources.images.restart, 0, 0, smallest / 8, smallest / 8);
                ctx.drawImage(app.resources.images.home, width - smallest / 8, 0, smallest / 8, smallest / 8);
            };

            this.calculatePos = function() {
                if (ground) {
                    hVel -= 50 * accX / width;
                    var collision = engine.collision(playerX + hVel, playerY);
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
                    var collision = engine.collision(playerX + hVel, playerY + vVel);
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
            };

            this.collision = function(x, y) {
                var blocks = levels[level];
                var collision = -1;
                for (i = 0; i < blocks.length; i++) {
                    if ((blocks[i].x + blocks[i].width) > (x - radius) && blocks[i].x < (x + radius) && (blocks[i].y + blocks[i].height) > (y - radius) && blocks[i].y < (y + radius)) {
                        collision = i;
                    }
                }
                return collision;
            };

            this.atFinish = function() {
                if (playerX - radius >= finishes[level].x - width / 60 && playerX + radius <= finishes[level].x + width / 60 + finishes[level].width && playerY + radius <= finishes[level].y + finishes[level].height + height / 60 && playerY - radius >= finishes[level].y - height / 60) {
                    if (level < levels.length - 1) {
                        app.resources.audio.cheering.play();
                        level++;
                        app.userData.unlocks[level] = true;
                        store(0);
                        playerX = width / 12;
                        playerY = height - thickness - radius;
                        hVel = 0;
                        vVel = 0;
                        blockOn = 0;
                        ground = true;
                    }
                    else {
                        app.resources.audio.cheering.play();
                        playing = false;
                        win();
                    }
                }
            };
        }


        function menu() {
            app.resources.audio.soundtrack.play();
            ismenu = true;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(app.resources.images.title, width / 4, height / 6, width / 2, height / 12);
            ctx.drawImage(app.resources.images.toplay, width / 4, height * 5 / 12, width / 2, height / 12);
            ctx.drawImage(app.resources.images.instructbutton, width / 4, height * 7 / 12, width / 2, height / 12);
            ctx.drawImage(app.resources.images.options, width / 4, height * 3 / 4, width / 2, height / 12);
            app.resources.audio.soundtrack.play();
        }

        function levelSelect() {
            islevelselect = true;
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            for (i = pageNum * 5; i < pageNum * 5 + 5; i++) {
                if (app.userData.unlocks[i]) {
                    ctx.fillStyle = "#00FF00";
                    ctx.fillRect(width / 3, height * (i % 5) / 7 + height / 7, width / 3, height * 3 / 28);
                }
                else {
                    ctx.fillStyle = "#008800";
                    ctx.fillRect(width / 3, height * (i % 5) / 7 + height / 7, width / 3, height * 3 / 28);
                }
            }
            ctx.fillStyle = "Red";
            for (i = pageNum * 5; i < pageNum * 5 + 5; i++) {
                ctx.fillText((i + 1), width / 2, height * (i % 5) / 7 + height / 7 + height * 3 / 56);
            }
            ctx.drawImage(app.resources.images.home, width - smallest / 8, 0, smallest / 8, smallest / 8);
            ctx.drawImage(app.resources.images.left, 0, height - smallest / 8, smallest / 8, smallest / 8);
            ctx.drawImage(app.resources.images.right, width - smallest / 8, height - smallest / 8, smallest / 8, smallest / 8);
            ctx.drawImage(app.resources.images.levselect, width / 4, height / 24, width / 2, height / 12);
        }

        function optionsMenu() {
            isoptions = true;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            for (i = oPageNum * 5; i < oPageNum * 5 + 5; i++) {
                if (i === app.userData.charIndex) {
                    ctx.fillStyle = "#00FF00";
                    ctx.fillRect(width / 3, height * (i % 5) / 7 + height / 7, width / 3, height * 3 / 28);
                }
                else {
                    ctx.fillStyle = "#008800";
                    ctx.fillRect(width / 3, height * (i % 5) / 7 + height / 7, width / 3, height * 3 / 28);
                }
            }
            for (i = oPageNum * 5; i < oPageNum * 5 + 5; i++) {
                ctx.drawImage(chars[i], width / 2 - radius, height * (i % 5) / 7 + height / 7 + height * 1 / 28, 2 * radius, 2 * radius);
            }
            ctx.drawImage(app.resources.images.home, width - smallest / 8, 0, smallest / 8, smallest / 8);
            ctx.drawImage(app.resources.images.left, 0, height - smallest / 8, smallest / 8, smallest / 8);
            ctx.drawImage(app.resources.images.right, width - smallest / 8, height - smallest / 8, smallest / 8, smallest / 8);
            ctx.drawImage(app.resources.images.charselect, width / 4, height / 24, width / 2, height / 12);
        }

        function instructions() {
            instructing = true;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(app.resources.images.instruct, 0, height / 2 - width / 2, width, width);
            ctx.drawImage(app.resources.images.home, width - smallest / 8, 0, smallest / 8, smallest / 8);
        }

        function block(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        function play() {
            if (playing) {
                engine.calculatePos();
                engine.draw();
                engine.atFinish();
                setTimeout(play, frameRate);
            }
        }

        function win() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "Red";
            ctx.drawImage(app.resources.images.winimg, width / 4, height * 5 / 12, width / 2, height / 6);
        }

        function accSuccess(acceleration) {
            accX = acceleration.x;
        }

        function accError() {
            alert("Accelerometer Error");
        }

        function store(x) {
            if (x === 0) {
                localStorage.setItem("unlocks", JSON.stringify(unlocks));
            }
            if (x === 1) {
                localStorage.setItem("charIndex", charIndex.toString());
            }
        }

        function retrieve() {
            
        }

        function stopRunning() {
            navigator.app.exitApp();
        }

        init();
    },
    loadResources: function(folder, obj){
        if(!folder){
            folder = app.$resources;
        }
        if(!obj){
            app.resources = {};
            obj = app.resources;
        }
        folder.children().each(function(index, el){
            if($(el).hasClass('folder')){
                obj[el.id] = {};
                app.loadResources($(el),obj[el.id]);
            } else {
                obj[el.id] = el;
            }
        });
    },
    loadUserData: function(){
        app.userData = {};
        app.userData.unlocks = JSON.parse(localStorage.getItem("unlocks")) || [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
        app.userData.charIndex = parseInt(localStorage.getItem("charIndex")) || 0;
    },
    storeUserData: function(name){
        if(name && app.userData[name]){
            localStorage.setItem(name, app.userData[name]);
        } else {
            for(var data in app.userData){
                if(app.userData.hasOwnProperty(data)){
                    localStorage.setItem(name, app.userData[data]);
                }
            }
        }
    },
    updateQueryString: function(){
        app.qs = {};
        var array = window.location.search.substr(1).split('&');
        var keyVal;
        array.forEach(function(el, index){
            keyVal = el.split('=', 2);
            if(keyVal.length === 1){
                app.qs[keyVal[0]] = "";
            } else {
                app.qs[keyVal[0]] = keyVal[1];
            }
        });
    },
    navigate: function(e) {
        app.$loading.show();
        app.updateQueryString();
        switch(window.location.hash){
            case '#level-select-page':
                app.loadLevelSelectPage();
                break;
            case '#options-page':
                app.loadOptionsPage();
                break;
            default:
                app.viewPage(window.location.hash);
                break;
        }
        
    },
    viewPage: function(id) {
        app.$loading.hide();
        app.$pages.css('display','none');
        if(id !== '') {
            $(id).css('display','block');
        } else {
            window.location.hash = "#menu-page";
        }
    }, 
    loadLevelSelectPage: function(){
        app.$levelList.empty();
        app.userData.unlocks.forEach(function(element, index){
            app.$levelList.append('<li>' + (element ? '<a href="#game-page">' : '') + (index + 1) + ' ' + (element ? 'enabled' : 'disabled') + (element ? '</a>' : '') + '</li>');

        });
        app.viewPage('#level-select-page');
    }, 
    loadOptionsPage: function(){
        console.log('loadOptionsPage');
        app.viewPage('#options-page');
    }
};

app.initialize();
