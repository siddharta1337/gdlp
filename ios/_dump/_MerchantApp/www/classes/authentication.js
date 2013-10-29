function Authentication() {
	this.returnUrl
	this.init()
}

Authentication.prototype.init = function() {
	
	/// add the last email on start
	$("#login").on("pagebeforeshow", function(){
		var email = localStorage.getItem("userName_email")
		if( email != null){
			$("#login_username").val(email)
		}
	})

	$("#logout_code_button").click(function() {
		app.authentication.logout()
	})
};


Authentication.prototype.userLogin = function() {
	//$.mobile.changePage('#navigation')

	var _userName = $("#login_username").val()
	var _userPass = $("#login_password").val()

	///stores the user email
	localStorage.setItem("userName_email", _userName)

	var theData = '{ "UserName": "' + _userName + '", "Password": "' + _userPass + '", "RememberMe": "", "errors": [] }';

	$.ajax({
		type: "POST",
		url: app.WS_URL_secure + "session?source=mu",
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		data: theData,
		success: function(response, status) {



			if (response.Success) {
				console.log("--- User loged IN ---")

				app.authentication.returnUrl = response.ReturnUrl


				app.authentication.successLogin(response.access_token)

				$.ajaxSetup({
					dataType: 'json',
					contentType: "application/json; charset=utf-8",
					beforeSend: function(xhr) {
						xhr.setRequestHeader('Authorization', "Bearer" + ' ' + response.access_token);
					},
				});


			} else if (!response.Success) {

				app.authentication.failedLogin()

			} else {
				console.log("can't read")
			}

			//console.log(response)

		},
		error: function(response) {
			//console.log("no")//response)
			console.log(response)
			app.authentication.failedLogin()
		}
	});
}

Authentication.prototype.failedLogin = function() {
	//$("#login_username").val("")
	$("#login_password").val("")
	var msg = "Wrong username or password.\nPlease Try Again"
	navigator.notification.alert(msg, null, ' ', 'OK')
}

Authentication.prototype.successLogin = function(_token) {


	localStorage.setItem("accessToken", _token)

	if ($.mobile.activePage.attr('id') == "login") {


		///user is ready to use the app.


		// veryfy if orgCode is OK

		if (app.authentication.returnUrl == "/welcome") {
			$.mobile.changePage('#codeOrg');
		} else {
			$.mobile.changePage('#navigation');
		}


	}
};

Authentication.prototype.veriftyPreviousLogins = function() {
   
	var status = localStorage.getItem("accessToken");

	if (status == null) {
		$.mobile.changePage('#login');
	} else {
		$.mobile.changePage('#navigation');
	}
};

Authentication.prototype.FBlogin = function(_token) {
	// a user has been succesfully authenticated on FB, get permissions on Goodloop
	var theData = '{ "AccessToken": "' + _token + '" }';


	$.ajax({
		type: "POST",
		url: app.WS_URL_secure + "access?source=mu",
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		data: theData,
		success: function(result, status) {



			if (result.Success) {


				app.authentication.successLogin(result.access_token)
				//console.log("registrandome en goodloop--------------------")

				app.authentication.returnUrl = result.ReturnUrl


				$.ajaxSetup({
					dataType: 'json',
					contentType: "application/json; charset=utf-8",
					beforeSend: function(xhr) {
						xhr.setRequestHeader('Authorization', result.token_type + ' ' + result.access_token);
					},
				});



			} else {
				// show errors here             


			}
		},
		error: function(e) {
			//show error              
		}
	});
};

Authentication.prototype.logout = function() {

	/// kill local storage
	localStorage.removeItem("accessToken")
	localStorage.removeItem("cdv_fb_session")
	localStorage.setItem("latestUpdate_filterItems", "January 1, 2013  00:00:00")


	//// facebook logout
	app.facebookAuth.logout()

	//// user logout
	this.sessionEnd()

	// now go to login page
	$.mobile.changePage('#login');
};

Authentication.prototype.sessionEnd = function() {
	$.ajax({
		type: "DELETE",
		url: app.WS_URL_secure + "session?source=mu",
		dataType: 'json',
		contentType: "application/json; charset=utf-8",

		success: function(response, status) {
			console.log("user logout")
		},
		error: function(response) {
			console.log("problem loggin out")
		}
	});
};

Authentication.prototype.accountrecovery = function() {
	var emailAddress = $("#forgot_email").val()
	var theData = '{ "UserName": "' + emailAddress + '"}';

	if (emailAddress == "") {
		var msg = "Please insert a valid email address."
		navigator.notification.alert(msg, null, ' ', 'OK')
		return false
	} else {

		$.mobile.loading("show");
	}

	$.ajax({
		type: "POST",
		url: app.WS_URL + "accountrecovery?source=mu",
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		data: theData,
		success: function(response) {

			if (response.Success == true) {
				var msg = "Please check your email for password recovery instructions."
				navigator.notification.alert(msg, function() {
					$("#forgot_email").val("")
					$.mobile.changePage("#login")
				}, 'Password Recovery', 'OK')

			} else {
				var msg = "Please insert a registered email address."
				navigator.notification.alert(msg, null, ' ', 'OK')
			}
			$.mobile.loading("hide");

		},
		error: function(response) {

			$.mobile.loading("hide");
		}
	});
};

Authentication.prototype.codeOrgRegister = function() {

	$.mobile.loading("show");

	var orgCodeInput = $("#codeOrg_code").val()

	var theData = '{ "orgcode": "' + orgCodeInput + '"}';



	$.ajax({
		type: "POST",
		url: app.WS_URL + "orgcode?source=mu",
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		data: theData,
		success: function(response) {

			console.log(response)

			if (response.error == true) {

				var msg = response.msg
				navigator.notification.alert(msg, null, 'Organization Code', 'OK')

			} else {

				var msg = response.msg
				navigator.notification.alert("Welcome to " + msg, function() {
					$("#codeOrg_code").val("")
					$.mobile.changePage("#dealList")
				}, 'Organization Code', 'OK')

			}

			$.mobile.loading("hide");

		},
		error: function(response) {

			$.mobile.loading("hide");
		}
	});
};

//Basic User Account: testuser@bluetechnologygroup.com(password: testing123)
//  test1@ironlime.com / testing123

//Admin User Account:  adminuser@bluetechnologygroup.com(password: testing123)