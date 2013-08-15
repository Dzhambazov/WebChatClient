/// <reference path="class.js" />
/// <reference path="persister.js" />
/// <reference path="jquery-2.0.2.js" />
/// <reference path="ui.js" />

var controllers = (function () {

    var updateTimer = null;

    var rootUrl = "http://teammilhouse-2.apphb.com/api/";
    var loggedUser = localStorage.getItem("user");
    var Controller = Class.create({
        init: function () {
            this.persister = persisters.get(rootUrl);
        },
        loadUI: function (selector) {
            if (this.persister.isUserLoggedIn()) {
                this.loadGameUI(selector, loggedUser);
            }
            else {
                this.loadLoginFormUI(selector);
            }
            this.attachUIEventHandlers(selector);
        },
        loadLoginFormUI: function (selector) {
            var loginFormHtml = ui.loginForm()
            $(selector).html(loginFormHtml);
        },
        loadGameUI: function (selector, user) {
            var self = this;
            var gameUIHtml =
				ui.chatUI(user);
            $(selector).html(gameUIHtml);

            //this.updateUI(selector);

            //updateTimer = setInterval(function () {
            //    self.updateUI(selector);
            //}, 15000);
        },
        loadGame: function (selector, gameId) {
            this.persister.game.state(gameId, function (gameState) {
                var gameHtml = ui.gameState(gameState);
                $(selector + " #game-holder").html(gameHtml)
            });
        },
        attachUIEventHandlers: function (selector) {
            var wrapper = $(selector);
            var self = this;

            wrapper.on("click", "#bttn-login", function () {
                var user = {
                    username: $(selector + " #userLog").val(),
                    password: $(selector + " #passLog").val(),
                }

                console.log(user.username);
                console.log(user.password);

                self.persister.users.login(user, function (newUser) {
                    loggedUser = newUser;
                    localStorage.setItem("user", JSON.stringify(loggedUser));
                    self.loadGameUI(selector, loggedUser);
                    location.reload();
                }, function (err) {
                    wrapper.find("#error-messages").text(err.responseJSON.Message);
                });
                return false;
            });




            wrapper.on("click", "#bttn-register", function () {
                console.log("wtf");
                var user = {
                    username: $(selector).find("#userReg").val(),
                    password: $(selector).find("#passReg").val(),
                    repassword: $(selector + " #rePassReg").val()
                }
                self.persister.users.register(user, function (newUser) {
                    loggedUser = newUser;
                    localStorage.setItem("user", JSON.stringify(loggedUser));
                    self.loadGameUI(selector, loggedUser);
                }, function (err) {
                    wrapper.find("#error-messages").text(err.responseJSON.Message);
                });
                return false;
            });





            wrapper.on("click", "#bttn-logout", function () {
                self.persister.users.logout(function () {
                    self.loadLoginFormUI(selector);
                    //clearInterval(updateTimer);
                }, function (err) {
                });
            });

            wrapper.on("click", "#changeAvatar", function () {
                window.open('uploadFile.html', '_blank');
            })



            //    wrapper.on("click", "#open-games-container a", function () {
            //        $("#game-join-inputs").remove();
            //        var html =
            //			'<div id="game-join-inputs">' +
            //				'Number: <input type="text" id="tb-game-number"/><br/>' +
            //				'Password: <input type="text" id="tb-game-pass"/><br/>' +
            //				'<button id="btn-join-game">join</button>' +
            //			'</div>';
            //        $(this).after(html);
            //    });
            //    wrapper.on("click", "#btn-join-game", function () {
            //        var game = {
            //            number: $("#tb-game-number").val(),
            //            gameId: $(this).parents("li").first().data("game-id")
            //        };

            //        var password = $("#tb-game-pass").val();

            //        if (password) {
            //            game.password = password;
            //        }
            //        self.persister.game.join(game);
            //    });
            //    wrapper.on("click", "#btn-create-game", function () {
            //        var game = {
            //            title: $("#tb-create-title").val(),
            //            number: $("#tb-create-number").val(),
            //        }
            //        var password = $("#tb-create-pass").val();
            //        if (password) {
            //            game.password = password;
            //        }
            //        self.persister.game.create(game);
            //    });

            //    wrapper.on("click", "#active-games-container li.game-status-full a.btn-active-game", function () {
            //        var gameCreator = $(this).parent().data("creator");
            //        var myNickname = self.persister.nickname();
            //        if (gameCreator == myNickname) {
            //            $("#btn-game-start").remove();
            //            var html =
            //				'<a href="#" id="btn-game-start">' +
            //					'Start' +
            //				'</a>';
            //            $(this).parent().append(html);
            //        }
            //    });

            //    wrapper.on("click", "#btn-game-start", function () {
            //        var parent = $(this).parent();

            //        var gameId = parent.data("game-id");
            //        self.persister.game.start(gameId, function () {
            //            wrapper.find("#game-holder").html("started");
            //        },
            //		function (err) {
            //		    alert(JSON.stringify(err));
            //		});

            //        return false;
            //    });

            //    wrapper.on("click", ".active-games .in-progress", function () {
            //        self.loadGame(selector, $(this).parent().data("game-id"));
            //    });
        },
        //updateUI: function (selector) {
        //    this.persister.game.open(function (games) {
        //        var list = ui.openGamesList(games);
        //        $(selector + " #open-games")
        //			.html(list);
        //    });
        //    this.persister.game.myActive(function (games) {
        //        var list = ui.activeGamesList(games);
        //        $(selector + " #active-games")
        //			.html(list);
        //    });
        //    this.persister.message.all(function (msg) {
        //        var msgList = ui.messagesList(msg);
        //        $(selector + " #messages-holder").html(msgList);
        //    });
        //}
    });
    return {
        get: function () {
            return new Controller();
        }
    }
}());

$(function () {
    var controller = controllers.get();
    controller.loadUI("#container");
});