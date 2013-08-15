/// <reference path="http-requester.js" />
/// <reference path="class.js" />
/// <reference path="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha1.js" />
var persisters = (function () {
    var user = localStorage.getItem("user");
    //var sessionKey = localStorage.getItem("sessionKey");
    function saveUserData(userData) {
        localStorage.setItem("user", userData);
        //localStorage.setItem("sessionKey", userData.sessionKey);
        user = userData;
        //sessionKey = userData.sessionKey;
    }
    function clearUserData() {
        localStorage.removeItem("user");
        //localStorage.removeItem("sessionKey");
        user = "";
        //sessionKey = "";
    }

    var MainPersister = Class.create({
        init: function (rootUrl) {
            this.rootUrl = rootUrl;
            this.users = new UserPersister(this.rootUrl);
            this.game = new GamePersister(this.rootUrl);
            this.message = new MessagesPersister(this.rootUrl);
        },
        isUserLoggedIn: function () {
            var isLoggedIn = user != null && user.username != null && user.sessionKey != null;
            return isLoggedIn;
        },
        user: function () {
            return user;
        }
    });
    var UserPersister = Class.create({
        init: function (rootUrl) {
            //...api/user/
            this.rootUrl = rootUrl + "user/";
        },
        login: function (newUser, success, error) {
            var url = this.rootUrl + "login";
            var userData = {
                username: newUser.username,
                authCode: CryptoJS.SHA1(newUser.password).toString(),
                avatar: newUser.avatar
            };

            httpRequester.postJSON(url, userData,
				function (data) {
				    saveUserData(data);
				    success(data);
				}, error);
        },
        register: function (newUser, success, error) {
            var url = this.rootUrl + "register";
            if (user.password == user.repassword) {
                var userData = {
                    username: newUser.username,
                    authCode: CryptoJS.SHA1(newUser.password).toString(),
                    avatar: newUser.avatar
                };
                httpRequester.postJSON(url, userData,
                    function (data) {
                        saveUserData(data);
                        success(data);
                    }, error);
            };
        },
        logout: function (success, error) {
            var url = this.rootUrl + "logout/" + user.sessionKey;
            httpRequester.getJSON(url, function (data) {
                clearUserData();
                success(data);
            }, error)
        }
    });









    var GamePersister = Class.create({
        init: function (url) {
            this.rootUrl = url + "game/";
        },
        create: function (game, success, error) {
            var gameData = {
                title: game.title,
                number: game.number
            };
            if (game.password) {
                gameData.password = CryptoJS.SHA1(game.password).toString();
            }
            var url = this.rootUrl + "create/" + user.sessionKey;
            httpRequester.postJSON(url, gameData, success, error);
        },
        join: function (game, success, error) {
            var gameData = {
                gameId: game.gameId,
                number: game.number
            };
            if (game.password) {
                gameData.password = CryptoJS.SHA1(game.password).toString();
            }
            var url = this.rootUrl + "join/" + user.sessionKey;
            httpRequester.postJSON(url, gameData, success, error);
        },
        start: function (gameId, success, error) {
            var url = this.rootUrl + gameId + "/start/" + user.sessionKey;
            httpRequester.getJSON(url, success, error)
        },
        myActive: function (success, error) {
            var url = this.rootUrl + "my-active/" + user.sessionKey;
            httpRequester.getJSON(url, success, error);
        },
        open: function (success, error) {
            var url = this.rootUrl + "open/" + user.sessionKey;
            httpRequester.getJSON(url, success, error);
        },
        state: function (gameId, success, error) {
            var url = this.rootUrl + gameId + "/state/" + user.sessionKey;
            httpRequester.getJSON(url, success, error);
        }
    });
    var GuessPersister = Class.create({
        init: function () {

        },
        make: function () {

        }
    });
    var MessagesPersister = Class.create({
        init: function (url) {
            this.rootUrl = url + "messages/";
        },
        unread: function (success, error) {
            var url = this.rootUrl + "unread/" + user.sessionKey;
            httpRequester.getJSON(url, success, error);
        },
        all: function (success, error) {
            var url = this.rootUrl + "all/" + user.sessionKey;
            httpRequester.getJSON(url, success, error);
        }
    });
    return {
        get: function (url) {
            return new MainPersister(url);
        }
    };
}());