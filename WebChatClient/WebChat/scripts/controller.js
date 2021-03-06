﻿/// <reference path="class.js" />
/// <reference path="persister.js" />
/// <reference path="jquery-2.0.2.js" />
/// <reference path="ui.js" />

var controllers = (function () {

    var updateTimer = null;

    var rootUrl = "http://teammilhouse-2.apphb.com/api/";
    var Controller = Class.create({
        init: function () {
            this.persister = persisters.get(rootUrl);
        },
        loadUI: function (selector) {
            if (this.persister.isUserLoggedIn()) {
                this.loadGameUI(selector);


                this.persister.user.allusers(function (data) {
                    ui.addChatUsers(data);

                }, function (err) {
                    console.log("err");
                });

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
        loadGameUI: function (selector) {
            var self = this;
            var username = localStorage.getItem("username");
            var gameUIHtml =
				ui.chatUI(username);
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
                    password: $(selector + " #passLog").val()
                }

                console.log(user.username);
                console.log(user.password);

                self.persister.user.login(user, function () {
                    self.loadGameUI(selector);
                    location.reload();
                }, function (err) {
                    wrapper.find("#error-messages").text(err.responseJSON.Message);
                });
                return false;
            });

            wrapper.on("click", "#bttn-register", function () {
                var user = {
                    username: $(selector).find("#userReg").val(),
                    password: $(selector).find("#passReg").val(),
                    repassword: $(selector + " #rePassReg").val()
                }
                self.persister.user.register(user, function () {
                    self.loadGameUI(selector);
                }, function (err) {
                    wrapper.find("#error-messages").text(err.responseJSON.Message);
                });
                return false;
            });

            wrapper.on("click", "#bttn-logout", function () {
                self.persister.user.logout(function () {
                    self.loadLoginFormUI(selector);
                    //clearInterval(updateTimer);
                }, function (err) {
                });
            });

            wrapper.on("click", ".otherUsers", function () {
                var user = $(this).find("span").text();
                console.log(user);
                $(".chat").css("display", "none");

                $(".otherUsers").removeClass("activated");
                $(this).addClass("activated");

                $("[name='" + user + "']").css("display", "block");
                //$(".chat").css("display", "block");
            });

            wrapper.on("click", "#changeAvatar .ui-btn-inner", function () {
                window.open("uploadFile.html", "blank");
            });

            //wrapper.on("click", "#open-games-container a", function () {
            //    $("#game-join-inputs").remove();
            //    var html =
            //		'<div id="game-join-inputs">' +
            //			'Number: <input type="text" id="tb-game-number"/><br/>' +
            //			'Password: <input type="text" id="tb-game-pass"/><br/>' +
            //			'<button id="btn-join-game">join</button>' +
            //		'</div>';
            //    $(this).after(html);
            //});
            //wrapper.on("click", "#btn-join-game", function () {
            //    var game = {
            //        number: $("#tb-game-number").val(),
            //        gameId: $(this).parents("li").first().data("game-id")
            //    };

            //    var password = $("#tb-game-pass").val();

            //    if (password) {
            //        game.password = password;
            //    }
            //    self.persister.game.join(game);
            //});
            //wrapper.on("click", "#btn-create-game", function () {
            //    var game = {
            //        title: $("#tb-create-title").val(),
            //        number: $("#tb-create-number").val(),
            //    }
            //    var password = $("#tb-create-pass").val();
            //    if (password) {
            //        game.password = password;
            //    }
            //    self.persister.game.create(game);
            //});

            //wrapper.on("click", "#active-games-container li.game-status-full a.btn-active-game", function () {
            //    var gameCreator = $(this).parent().data("creator");
            //    var myNickname = self.persister.nickname();
            //    if (gameCreator == myNickname) {
            //        $("#btn-game-start").remove();
            //        var html =
            //			'<a href="#" id="btn-game-start">' +
            //				'Start' +
            //			'</a>';
            //        $(this).parent().append(html);
            //    }
            //});

            //wrapper.on("click", "#btn-game-start", function () {
            //    var parent = $(this).parent();

            //    var gameId = parent.data("game-id");
            //    self.persister.game.start(gameId, function () {
            //        wrapper.find("#game-holder").html("started");
            //    },
            //	function (err) {
            //	    alert(JSON.stringify(err));
            //	});

            //    return false;
            //});

            //wrapper.on("click", ".active-games .in-progress", function () {
            //    self.loadGame(selector, $(this).parent().data("game-id"));
            //});

            wrapper.on("click", ".send-msg", function () {
                var msg =
                {
                    users: "",
                    message: ""
                };
                var currUser = localStorage.getItem("username");
                var receiver = $(this).attr('id');
                msg.message = currUser + ": ";
                var msgg = $(this).prev("textarea").val();
                msg.message += $(this).prev("textarea").val();



                function strcmp(a, b) {
                    if (a.toString() < b.toString()) return a + "~" + b;
                    if (a.toString() > b.toString()) return b + "~" + a;
                    return 0;
                }
                var string = strcmp(currUser, receiver);

                msg.users = string;
                pubnub.publish({
                    channel: "channel",
                    message: msg
                })
                //var sessionKey = localStorage.getItem("sessionKey");
                //url = "http://http://teammilhouse-2.apphb.com/api/user/send/" + sessionKey;
                //var userData = {
                //    content: msgg,
                //    to:  receiver
                //};
                //httpRequester.postJSON(url, userData,
                //function (data) {
                //    success(data);
                //});


            });
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
        //},
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
