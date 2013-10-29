// JavaScript Document

function Details(){
	this.init()
  
  this.socialshare = new Socialshare()

  this.myScroll = new iScroll('wrapperDetails');
};
 
Details.prototype.itemData = {};

Details.prototype.init = function() {
	

	$("#offerDetails").on( "pagebeforeshow", function() {
		        app.details.buildPage()

            setTimeout(function () {
                       app.details.myScroll.refresh()
            }, 100);
	})
  

  $("#offerDetails").on( "pagehide", function() {
          $("#redeemDeal_main_button").removeClass("selected");
          //$("#offerDetails_image").attr("src", "img/placeholders/details_placeholder.png")
          $("#offerDetails_image_container").html("")
  })
    
 
  /// attach tab event from select buttom, using click due tap issues
  $("#redeemDeal_main_button").on("click", function(){
      
      app.details.mainbuttonDisplay($(this))

      return false
  })

  $("#shareButton").on("tap", function(){

    $("#shareOverlay").css("display","block")
    $("#shareOverlay").on("tap", function(e){
      if(e.target.id == "shareOverlay"){
        $("#shareOverlay").css("display","none")
      }
    })

    app.details.socialshare.enableButtons(app.details.itemData );

    return false
  })
};

Details.prototype.buildPage = function() {
    //console.log(this.itemData.DealID)
    // format info
    $("#offerDetails_name").html( app.outputText( this.itemData.MerchantName ) )
    //if(this.itemData.PreviewImage != null){
      
      //$("#offerDetails_image").attr("src", app.IMG_URL + this.itemData.PreviewImage)

    $("#offerDetails_image_container").html( '<img src="img/placeholders/details_placeholder.png" width="600" height="300"  />')
      

    //}
    $("#offerDetails_details").html( app.outputText( this.itemData.Description) )
    $("#offerDetails_due").html(app.dateConverter(this.itemData.EndsOn) )

    if(this.itemData.status != null){
        $("#redeemDeal_main_button").addClass("selected");
        // hide availability line
        $(".offersLeft.box").css("display","none")
        
    }else{
       // display availability line (in case is hidden)
       $(".offersLeft.box").css("display","block")
    }


    this.callWSData()


};

Details.prototype.callWSData = function(){
    
  var _URL 
  var mode 
   
  /// change URL if calling a Deal or a Clip
  if(this.itemData.status == null){
    _URL  =  app.WS_URL + "deal/"+ app.details.itemData.DealID+"?source=mu"
    mode = "dealMode"
  }else{
    _URL  =  app.WS_URL + "clip/"+ app.details.itemData.DealID+"?source=mu"
    mode = "clipMode"
  }

    $.ajax({
           type: "GET",
           url: _URL,
           dataType: 'json',
           
           contentType: "application/json; charset=utf-8",
           success:  function (response, status, xhr){
           
              
              if(mode == "dealMode"){
                // update availability
                $("#offerDetails_offersLeft").html(response.AvailableClips + " / " + response.SimultaneousClipsAllowed)
                
                // update image ?
                //$("#offerDetails_image").attr("src", app.IMG_URL + response.PreviewImage)
                $("#offerDetails_image_container").html( '<img src="' + app.IMG_URL + response.PreviewImage+'" width="600" height="300"  />')
                app.details.itemData.PreviewImage = response.PreviewImage

                //$("#offerDetails_image_container img").addClass("show")
              }else{
                $("#offerDetails_image_container").html( '<img src="' + app.IMG_URL + app.details.itemData.PreviewImage+'" width="600" height="300"  />')
              }

              console.log(response)

              if(response.QrCodeUrl != null){
                  app.details.itemData.QrCodeUrl = response.QrCodeUrl
                  //console.log(response.QrCodeUrl)
              } 
           
           },
           beforeSend: function (xhr) {                              

              xhr.setRequestHeader('Authorization',  'Bearer ' + localStorage.getItem("accessToken"));
              
           },
           error: function (response) {
           /** TODO DEFINE COPY */
           //alert("Can't connect to server. Please try again later")
           
           }
           });
};

/// changes the mainButon accordin to user settings
Details.prototype.mainbuttonDisplay = function(_target){

 
  // change class to seleted
    if(_target.hasClass("selected")){

        app.navigation.go("redeemDeal")
    
    }else{
    
        app.details.registerClipWS(this.itemData.DealID);
        //_target.addClass("selected");

    }
 
};

Details.prototype.registerClipWS = function(_dealId) {
  
  
  var theData = '{ "DealID": "'+ _dealId +'" }';
 
 
  /// add info to clipsWS
  $.ajax({
      type: "POST",
      url:  app.WS_URL_secure + "clip?source=mu",
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      data: theData,

      success:  function (response, status){
        

        localStorage.setItem("numberOfSelectedDeals" , response.numberOfSelectedDeals)

        $("#redeemDeal_main_button").addClass("selected");

         
      },

      beforeSend: function (xhr) {                              

          xhr.setRequestHeader('Authorization',  'Bearer ' + localStorage.getItem("accessToken"));
          console.log(xhr);
      },

      error: function (response) {
        console.log("no")//response)
        console.log(response)
      }
    });


  /// on success, add to local DB
  //app.details.addRecordToDB()
};


 

Details.prototype.addRecordToDB = function(){
    
    //alert("guardar")
    //console.log(this.itemData)
    //app.database.addToFavorites(this.itemData)
     
    
    //INSERT OR REPLACE INTO data VALUES (NULL, 1, 2, 3);
    
    /*Object
     DealID: 75
     Description: "Free%20parking%20in%20the%20Zoo%20parking%20lot%2C%20plus%20free%20train%20ride%20for%20two%20adults."
     EndsOn: "2013-09-30T00:00:00"
     MerchantName: "St.%20Louis%20Zoo"
     PreviewImage: "img-offers/2013/27/75.jpg"
     __proto__: Object*/   
};



 