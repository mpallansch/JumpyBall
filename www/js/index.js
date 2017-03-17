var app = {
    initialize: function() {
        if (window.cordova) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        } else {
            $(document).ready(this.onDeviceReady);
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
        
        app.engine = new gameEngine();
        app.engine.init();  
        
        $(window).on('hashchange', app.navigate);
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
                obj[el.id] = el;
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
        switch (window.location.hash) {
            case '#level-select-page':
                app.loadLevelSelectPage();
                break;
            case '#options-page':
                app.loadOptionsPage();
                break;
            case '#game-page':
                app.loadGamePage();
                break;
            default:
                app.viewPage(window.location.hash);
                break;
        }

    },
    viewPage: function(id) {
        app.$loading.hide();
        app.$pages.css('display', 'none');
        if (id !== '') {
            $(id).css('display', 'block');
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
                a.attr('href', '?level=' + index + '#game-page');
            }
            li.append(a);
            app.$levelList.append(li);

        });
        app.viewPage('#level-select-page');
    },
    loadOptionsPage: function() {
        app.$characterList.empty();
        app.characters.forEach(function(character, index) {
            var el = $('<li/>');
            character.hidden = false;
            el.data('index', index);
            el.append(character);
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
        app.viewPage('#options-page');
    },
    loadGamePage: function(){
        if(app.qs['level']){
            app.engine.loadLevel(parseInt(app.qs['level']));
        } else {
            app.engine.loadLevel(0);
        }
        app.$levelTitle.text('Level ' + (app.qs['level'] || 0));
        app.viewPage('#game-page');
    }
};

app.initialize();
