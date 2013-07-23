function FacebookAuth() {
    
    if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
    if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
    

FacebookAuth.prototype.FB = FB
    
    FB.Event.subscribe('auth.login', function(response) {
      
      if (app.facebookAuth.FBStatus != "active"){
          //FacebookAuth.prototype.retrieveUserInfo()
          //alert("Facebook active")
          //alert(response.authResponse.accessToken)

         
          app.authentication.FBlogin(response.authResponse.accessToken)
          app.facebookAuth.FBStatus = "active"

      }else{
          if(localStorage.getItem("accessToken") != null){
              $.mobile.changePage('#navigation');
          }else{
              console.log("----- not ready")
          }
      } 


    });
    

    FB.Event.subscribe('auth.logout', function(response) {

      //alert('auth.logout event');
    });
    
    FB.Event.subscribe('auth.sessionChange', function(response) {
            
      // alert('auth.sessionChange event');                   
    });

    
    FB.Event.subscribe('auth.statusChange', function(response) {
        
        // alert('auth.statusChange event');
    });
}


///// propiedades
FacebookAuth.prototype.friendIDs = [];
FacebookAuth.prototype.fdata;
FacebookAuth.prototype.FB
FacebookAuth.prototype.fbData;
FacebookAuth.prototype.FBStatus = "logout"


/// inicializa el objeto de FP
FacebookAuth.prototype.init = function() {

    FacebookAuth.prototype.FB.init({
      appId: "439418256142420" , //"526516804062354",
      nativeInterface: CDV.FB,
      useCachedDialogs: false

    });
};
 
///// abre la ventana de Login de Facebook
FacebookAuth.prototype.login = function() {
    
    FacebookAuth.prototype.FB.login(
          function(response) {
                
                

               if (response.authResponse.session_key && app.facebookAuth.FBStatus != "active") {

                    console.log("acceso a facebook")
                    app.authentication.FBlogin(response.authResponse.accessToken) 
                    app.facebookAuth.FBStatus = "active"

                    //response.authResponse.session_key.userID
                                    // expiresIn
                                    // expirationTime
                                    // accessToken
                                    
                 } else {
                     //alert('not logged in');
                 }
                 
                ///esto se ejecuta la primera vez del login
                FacebookAuth.prototype.retrieveUserInfo()
                         //apps.authentication.forceLogin()
                },
                { scope: "email" });
}

/// se conecta a FB y obtiene la informacion base del usuario
FacebookAuth.prototype.retrieveUserInfo = function() {
     
    FacebookAuth.prototype.FB.api('/me', {
                                  fields: 'id, name, email,link,picture'
                                  }, function(response) {
                                        FacebookAuth.prototype.fbData = response
                                        FacebookAuth.prototype.FBStatus = "active";
                                        //apps.users.checkIfUserExistsAndHaveEmail("facebookID", app.facebookAuth.fbData.id);
                                  });
}


/// Saca la informacion de los contactos
FacebookAuth.prototype.friends = function() {
    FB.api('/me/friends', {
           fields: 'id, name, picture'
           }, function(response) {
           if (response.error) {
           alert(JSON.stringify(response.error));
           } else {
           
           var data = document.getElementById('data');
           FacebookAuth.prototype.fdata = response.data;
           //console.log("fdata: " + fdata);
           response.data.forEach(function(item) {
                                 var d = document.createElement('div');
                                 d.innerHTML = '<img src="' + item.picture.data.url + '" width="20" height="20"/>' + item.name;
                                 data.appendChild(d);
                                 console.log(item)
                                 
                                 });
           }
           var friends = response.data;
           console.log(friends.length);
           for (var k = 0; k < 15 && k < 50; k++) {
           var friend = friends[k];
           var index = 1;
           
           FacebookAuth.prototype.friendIDs[k] = friend.id;
           //friendsInfo[k] = friend;
           }
           console.log("friendId's: " + FacebookAuth.prototype.friendIDs);
           });
}




///////////////// Funciones de respaldo, ninguna en uso /////

/// cierra la sesion ( no esta en uso)
FacebookAuth.prototype.logout = function() {
    FacebookAuth.prototype.FB.logout(function(response) {
                                     alert('logged out');
                                     });
}

///poste en el muro ( no esta en uso)
FacebookAuth.prototype.facebookWallPost = function(_name, _link, _picture, _caption, _description ) {
    console.log('Debug 1');
    var params = {
    method: 'feed',
    name: _name, //'Facebook Dialogs',
    link: _link, //'https://developers.facebook.com/docs/reference/dialogs/',
    picture: _picture, //'http://fbrell.com/f8.jpg',
    caption: _caption, //'Reference Documentation',
    description: _description //'Dialogs provide a simple, consistent interface for applications to interface with users.'
    };
    console.log(params);
    FB.ui(params, function(obj) {
          console.log(obj);
          });
}

/// postea en el muro de un amigo (no esta en uso)
FacebookAuth.prototype.publishStoryFriend = function() {
    randNum = Math.floor(Math.random() * FacebookAuth.prototype.friendIDs.length);
    
    var friendID = FacebookAuth.prototype.friendIDs[randNum];
    if (friendID == undefined) {
        alert('please click the me button to get a list of friends first');
    } else {
        console.log("friend id: " + friendID);
        console.log('Opening a dialog for friendID: ', friendID);
        var params = {
        method: 'feed',
        to: friendID.toString(),
        name: 'Facebook Dialogs',
        link: 'https://developers.facebook.com/docs/reference/dialogs/',
        picture: 'http://fbrell.com/f8.jpg',
        caption: 'Reference Documentation',
        description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
        };
        FB.ui(params, function(obj) {
              console.log(obj);
              });
    }
}

/// obtiene el estado del usuario (no esta en uso)
FacebookAuth.prototype.getLoginStatus = function() {
    FB.getLoginStatus(function(response) {
                      if (response.status == 'connected') {
                      // alert('logged in');
                      } else {
                      //alert('not logged in');
                      }
                      });
}



