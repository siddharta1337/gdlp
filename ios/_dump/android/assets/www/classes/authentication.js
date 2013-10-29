function Authentication(){}

 
Authentication.prototype.userLogin = function(){
		//$.mobile.changePage('#navigation')

		var _userName = $("#login_username").val()
		var _userPass = $("#login_password").val()

		$.ajax({
			type: "POST",
			url: app.WS_URL+"session",
			dataType: 'json',
			data: '{ "username": "'+_userName +'", "password": "'+_userPass+'"}' ,
			contentType: "application/json; charset=utf-8",
			success:  function (response){
 
				
				if(response.Success == true ){
					console.log("--- User loged IN ---")
					app.authentication.successLogin()
					 

				}else if(response.Success == false ){

					app.authentication.failedLogin()
					 
				}else{
					console.log("no leo")
				}
				console.log(response)
				 
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

Authentication.prototype.successLogin = function() {
	localStorage.setItem("userLoggedSuccess","true")
	$.mobile.changePage('#navigation');
};

Authentication.prototype.veriftyPreviousLogins = function() {

    
    
    //$.mobile.changePage('#navigation');
 
	var status = localStorage.getItem("userLoggedSuccess");
    
	if ( status == "true") {
         
		 $.mobile.changePage('#navigation');
        
	}else{
        
		$.mobile.changePage('#login');

	}
    
     
	
}


Authentication.prototype.FBlogin = function(){
	// $.mobile.changePage('#navigation')
}

//Basic User Account: testuser@bluetechnologygroup.com(password: testing123)
//Admin User Account:  adminuser@bluetechnologygroup.com(password: testing123)
