var ui = (function () {

    function buildLoginForm() {
        var html =
            '<div id="content">' +
    '<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">' +
        '<li class="active"><a href="#red" data-toggle="tab">Login</a></li>' +
        '<li><a href="#orange" data-toggle="tab">Register</a></li>' +
    '</ul>' +
    '<div id="my-tab-content" class="tab-content">' +
        '<div class="tab-pane active" id="red">' +
             '<input type="text" name="userLog" id="userLog" placeholder="Username" />' +
             '<input type="password" name="passLog" id="passLog" placeholder="Password"/>' +
             '<input type="submit" id="bttn-login" value="Login" />' +
        '</div>' +
        '<div class="tab-pane" id="orange">' +
           	 '<input type="text" name="userReg" id="userReg" placeholder="Username" />' +
             '<input type="password" name="passReg" id="passReg" placeholder="Password" />' +
             '<input type="password" name="rePassReg" id="rePassReg" placeholder="Retype Password" />' +
             '<input type="submit" id="bttn-register" value="Register" />' +
        '</div>' +
    '</div>' +
'</div>';
        return html;
    }

    function buildChatUI(username) {
        var html =
        '<div id="main" data-role="page" id="page1">' +
	        '<div data-theme="b" data-role="header">' +
	            '<img src="' + localStorage.getItem("avatar") + '" width="60" height="60" no-repeat />' +
	            '<a id="changeAvatar" href="#" data-role="button" data-inline="true" data-theme="b">Change</a>' +
	            '<h3>Welcome ' + username + '</h3>' +
	            '<a id="bttn-logout" href="#" data-role="button" data-inline="true" data-theme="b">Logout</a>' +
	        '</div>' +
	        '<div id="footer" data-theme="b" data-role="footer" data-position="fixed">' +
	            '<h3> Web Chat</h3>' +
	        '</div>' +
	    '</div>';
        return html;
    }

    function addChatUsers(data) {
        var username = localStorage.getItem("username");
        var chats = "";
        var users = '<div id="users" data-role="content" style="width:250px;">' +
        '<div id="acc-container" data-role="collapsible-set" data-theme="b" data-content-theme="a">';
        for (var i = 0; i < data.length; i++) {
            if (username != data[i].username) {
                users += '<button class="otherUsers"><img src="http://png.findicons.com/files/icons/2166/oxygen/64/kbugbuster.png"  width="40" height="40"/><span>' + data[i].username + '</span></button>';
                chats += '<div id="textFields" class="chat" name="' + data[i].username + '">' +
                        '<textarea id="received"></textarea>' +
                        '<textarea id="send"></textarea>' +
                        '<a href="#" data-role="button" data-inline="true" data-theme="b" style="margin-top:-35px">Send</a>' +
                    '</div>';
            }
        }

        users += '</div></div>';

        $("#footer").before(users);
        $("#users").after(chats);
    }



    // function buildOpenGamesList(games) {
    // 	var list = '<ul class="game-list open-games">';
    // 	for (var i = 0; i < games.length; i++) {
    // 		var game = games[i];
    // 		list +=
    // 			'<li data-game-id="' + game.id + '">' +
    // 				'<a href="#" >' +
    // 					$("<div />").html(game.title).text() +
    // 				'</a>' +
    // 				'<span> by ' +
    // 					game.creatorNickname +
    // 				'</span>' +
    // 			'</li>';
    // 	}
    // 	list += "</ul>";
    // 	return list;
    // }

    // function buildActiveGamesList(games) {
    // 	var gamesList = Array.prototype.slice.call(games, 0);
    // 	gamesList.sort(function (g1, g2) {
    // 		if (g1.status == g2.status) {
    // 			return g1.title > g2.title;
    // 		}
    // 		else {
    // 			if (g1.status == "in-progress") {
    // 				return -1;
    // 			}
    // 		}
    // 		return 1;
    // 	});

    // 	var list = '<ul class="game-list active-games">';
    // 	for (var i = 0; i < gamesList.length; i++) {
    // 		var game = gamesList[i];
    // 		list +=
    // 			'<li class="game-status-' + game.status + '" data-game-id="' + game.id + '" data-creator="' + game.creatorNickname + '">' +
    // 				'<a href="#" class="btn-active-game">' +
    // 					$("<div />").html(game.title).text() +
    // 				'</a>' +
    // 				'<span> by ' +
    // 					game.creatorNickname +
    // 				'</span>' +
    // 			'</li>';
    // 	}
    // 	list += "</ul>";
    // 	return list;
    // }

    // function buildGuessTable(guesses) {
    // 	var tableHtml =
    // 		'<table border="1" cellspacing="0" cellpadding="5">' +
    // 			'<tr>' +
    // 				'<th>Number</th>' +
    // 				'<th>Cows</th>' +
    // 				'<th>Bulls</th>' +
    // 			'</tr>';
    // 	for (var i = 0; i < guesses.length; i++) {
    // 		var guess = guesses[i];
    // 		tableHtml +=
    // 			'<tr>' +
    // 				'<td>' +
    // 					guess.number +
    // 				'</td>' +
    // 				'<td>' +
    // 					guess.cows +
    // 				'</td>' +
    // 				'<td>' +
    // 					guess.bulls +
    // 				'</td>' +
    // 			'</tr>';
    // 	}
    // 	tableHtml += '</table>';
    // 	return tableHtml;
    // }

    // function buildGameState(gameState) {
    // 	var html =
    // 		'<div id="game-state" data-game-id="' + gameState.id + '">' +
    // 			'<h2>' + gameState.title + '</h2>' +
    // 			'<div id="blue-guesses" class="guess-holder">' +
    // 				'<h3>' +
    // 					gameState.blue + '\'s gueesses' +
    // 				'</h3>' +
    // 				buildGuessTable(gameState.blueGuesses) +
    // 			'</div>' +
    // 			'<div id="red-guesses" class="guess-holder">' +
    // 				'<h3>' +
    // 					gameState.red + '\'s gueesses' +
    // 				'</h3>' +
    // 				buildGuessTable(gameState.redGuesses) +
    // 			'</div>' +
    // 	'</div>';
    // 	return html;
    // }

    // function buildMessagesList(messages) {
    // 	var list = '<ul class="messages-list">';
    // 	var msg;
    // 	for (var i = 0; i < messages.length; i += 1) {
    // 		msg = messages[i];
    // 		var item =
    // 			'<li>' +
    // 				'<a href="#" class="message-state-' + msg.state + '">' +
    // 					msg.text +
    // 				'</a>' +
    // 			'</li>';
    // 		list += item;
    // 	}
    // 	list += '</ul>';
    // 	return list;
    // }

    return {
        loginForm: buildLoginForm,
        chatUI: buildChatUI,
        addChatUsers: addChatUsers,
        // openGamesList: buildOpenGamesList,
        // activeGamesList: buildActiveGamesList,
        // gameState: buildGameState,
        // messagesList: buildMessagesList
    }

}());

