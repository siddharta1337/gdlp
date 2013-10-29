function Authentication(){}

 
Authentication.prototype.userLogin = function(){
		//$.mobile.changePage('#navigation')

		var _userName = $("#login_username").val()
		var _userPass = $("#login_password").val()
    
        var theData = '{ "UserName": "'+ _userName +'", "Password": "'+_userPass+'", "RememberMe": "", "errors": [] }';
    
		$.ajax({
			type: "POST",
			url: "https://dev.goodloop.org/api/session?source=mu",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: theData,
			success:  function (response, status){
               
               
				
				if(response.Success){
					console.log("--- User loged IN ---")

					app.authentication.successLogin(response.access_token)

					$.ajaxSetup({
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', "Bearer" + ' ' + response.access_token);
                        },
                    });
					 

				}else if(! response.Success){

					app.authentication.failedLogin()
					 
				}else{
					console.log("can't read")
				}
               
				//console.log(response)
				 
			},
			error: function (response) {
				console.log("no")//response)
				console.log(response)
				app.authentication.failedLogin()
			}
		});
}

Authentication.prototype.failedLogin = function(){
	$("#login_username").val("")
	$("#login_password").val("")
	alert("Wrong username or password.\nPlease Try Again")
}

Authentication.prototype.successLogin = function(_token) {

	//console.log("listo para salir, vamos a navigation");
	localStorage.setItem("accessToken",_token)

	if($.mobile.activePage.attr( 'id' ) == "login"){
		$.mobile.changePage('#navigation');
	} 

 

};

Authentication.prototype.veriftyPreviousLogins = function() {
 
	var status = localStorage.getItem("accessToken");
    
	if ( status ==null) {
		$.mobile.changePage('#login');
	}else{
		$.mobile.changePage('#navigation');
	}
};
 
Authentication.prototype.FBlogin = function(_token){
	// a user has been succesfully authenticated on FB, get permissions on Goodloop
	 var theData = '{ "AccessToken": "' + _token + '" }';


	$.ajax({
    	type: "POST",
        url: app.WS_URL_secure + "access?source=mu",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: theData,
        success: function (result, status) {

        		
        		//console.log(result);
                if (result.Success) {

                	
                	app.authentication.successLogin(result.access_token)
                	//console.log("registrandome en goodloop--------------------")

                	
                    $.ajaxSetup({
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', result.token_type + ' ' + result.access_token);
                        },
                    });
                    
                    

                } else {
                                    // show errors here             
                   // alert(result.Message);

                }
        },
        error: function (blah) {

                	//show error              
                   // alert(blah.responseText);

                }
    });
};

//Basic User Account: testuser@bluetechnologygroup.com(password: testing123)
//  test1@ironlime.com / testing123

//Admin User Account:  adminuser@bluetechnologygroup.com(password: testing123)
