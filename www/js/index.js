var app = {
    initialize: function() {
        if (window.cordova) {
            document.addEventListener('deviceready', app.onDeviceReady, false);
        } else {
            $(document).ready(app.onDeviceReady);
        }
    },
    onDeviceReady: function() {
        app.loadResources();
        app.loadUserData();

        app.$pages = $('.page');
        app.$loading = $('#loading-modal');

        app.$levelList = $('#level-list');

        app.$characterList = $('#character-list');
        
        app.$levelTitle = $('#level-title');
        app.$resetButton = $('#reset-button');

        app.characters = [app.resources.images.ball, app.resources.images.nyan, app.resources.images.pacman, app.resources.images.doge, app.resources.images.troll, app.resources.images.cage, app.resources.images.yyouno, app.resources.images.accepted, app.resources.images.lol, app.resources.images.didthere];
        app.level = 0;
        
        app.engine = new gameEngine();
        app.engine.init();  
        
        $(window).on('hashchange', app.navigate);
        $(document).on('click', 'a', app.click);
        document.addEventListener('backbutton', app.pause);
        document.addEventListener('pause', app.pause);
        app.$resetButton.on('click', app.engine.reset);
        
        app.navigate();
    },
    loadResources: function(folder, obj) {
        if (!folder) {
            folder = $('#resources');
        }
        if (!obj) {
            app.resources = {};
            obj = app.resources;
        }
        folder.children().each(function(index, el) {
            if ($(el).hasClass('folder')) {
                obj[el.id] = {};
                app.loadResources($(el), obj[el.id]);
            } else {
                if(el.nodeName === 'AUDIO'&& typeof(Media) !== 'undefined'){
                    obj[el.id] = new Media(el.src);
                } else {
                    obj[el.id] = el;
                }
            }
        });
    },
    loadUserData: function() {
        app.userData = {};
        app.userData.unlocks = JSON.parse(localStorage.getItem("unlocks")) || [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
        app.userData.charIndex = parseInt(localStorage.getItem("charIndex")) || 0;
    },
    storeUserData: function(name) {
        if (name && app.userData[name]) {
            localStorage.setItem(name, (typeof app.userData[name] === 'object') ? JSON.stringify(app.userData[name]) : app.userData[name]);
        } else {
            for (var data in app.userData) {
                if (app.userData.hasOwnProperty(data)) {
                    localStorage.setItem(name, (typeof app.userData[name] === 'object') ? JSON.stringify(app.userData[name]) : app.userData[name]);
                }
            }
        }
    },
    updateQueryString: function() {
        app.qs = {};
        var array = window.location.search.substr(1).split('&');
        var keyVal;
        array.forEach(function(el) {
            keyVal = el.split('=', 2);
            if (keyVal.length === 1) {
                app.qs[keyVal[0]] = "";
            } else {
                app.qs[keyVal[0]] = keyVal[1];
            }
        });
    },
    navigate: function() {
        app.$loading.show();
        app.updateQueryString();
        app.engine.stopPlaying();
        switch (window.location.hash) {
            case '#level-select-page':
                app.loadLevelSelectPage();
                break;
            case '#character-select-page':
                app.loadCharacterSelectPage();
                break;
            case '#game-page':
                app.loadGamePage();
                break;
            case '#menu-page':
                app.resources.audio.soundtrack.play();
            default:
                app.viewPage(window.location.hash);
                break;
        }

    },
    viewPage: function(id) {
        app.$loading.hide();
        app.$pages.removeClass('current');
        if (id !== '') {
            $(id).addClass('current');
        } else {
            window.location.hash = "#menu-page";
        }
    },
    loadLevelSelectPage: function() {
        app.$levelList.empty();
        app.userData.unlocks.forEach(function(unlocked, index) {
            var li = $('<li/>');
            var a = $('<a/>');
            a.text(index + 1);
            if (unlocked) {
                li.addClass('unlocked');
                a.data('level', index);
                a.click(function(){
                    app.level = a.data('level');
                    window.location.hash = '#game-page';
                });
            }
            li.append(a);
            app.$levelList.append(li);

        });
        app.viewPage('#level-select-page');
    },
    loadCharacterSelectPage: function() {
        app.$characterList.empty();
        app.characters.forEach(function(character, index) {
            var el = $('<li/>');
            var a = $('<a/>');
            character.hidden = false;
            el.data('index', index);
            el.append(a.append(character));
            if (index === app.userData.charIndex) {
                el.addClass('current');
            } else {
                el.click(function() {
                    el.addClass('current');
                    app.$characterList.find('li').eq(app.userData.charIndex).removeClass('current');
                    app.userData.charIndex = el.data('index');
                    app.storeUserData('charIndex');
                });
            }
            app.$characterList.append(el);
        });
        app.viewPage('#character-select-page');
    },
    loadGamePage: function(){
        app.engine.loadLevel();
        app.engine.play();
        app.$levelTitle.text('Level ' + (app.level + 1)); 
        app.viewPage('#game-page');
    },
    click: function(){
        if(app.resources){
            app.resources.audio.click.play();
        }
    },
    pause: function(){
        app.resources.audio.soundtrack.pause();
    }
};

app.initialize();
