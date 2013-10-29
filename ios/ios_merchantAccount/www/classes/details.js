
function Details(){
  this.init()
  
  this.socialshare = new Socialshare()

  this.myScroll = new iScroll('wrapperDetails');
};
 
Details.prototype.itemData = {};

Details.prototype.init = function() {
  

    $("#offerDetails").on( "pagebeforeshow", function(event, ui) {
      
             $("#offerDetails .ui-content").css("padding",'13px 18px')

              // reset thumbnail
              app.details.itemData.ThumbImage = null

              

              if ( $(ui.prevPage).attr("id")  == "myOffers" || $(ui.prevPage).attr("id")  == "search"  || $(ui.prevPage).attr("id")  == "dealList"  ){
                app.details.buildPage()
              }else{
                console.log("page not loaded")
              }

              app.details.myScroll.scrollTo(0, 0, 0)

              setTimeout(function () {
                         
                         app.details.myScroll.refresh()

              }, 100);

              

              if(app.details.itemData.status == null){

                app.details.itemData.status = "unselected"

              }else if (app.details.itemData.status == "selected") {
                $("#redeemDeal_main_button").addClass("selected");
              
              }

              ///extra check
              if(app.details.itemData.IsSelected == true){
                 $("#redeemDeal_main_button").addClass("selected");
              }

              console.log("======")
              console.log(app.details.itemData)

                
             
    })


    //// kill previous scroll
    $("#offerDetails").on( "pageshow", function() {
        $("#offerDetails .ui-content").css("padding",'13px 18px')
        //app.dealList.myScroll.destroy()
        //app.dealList.myScroll = null
    })

    $("#offerDetails").on( "pagehide", function(event, ui) {
            $("#redeemDeal_main_button").removeClass("selected");
            //$("#offerDetails_image").attr("src", "img/placeholders/details_placeholder.png")
            if ( $(ui.nextPage).attr("id")  == "myOffers"){
              $("#offerDetails_image_container").html("")
            }
            
            //$("#offerDetails .ui-content").css("padding",'0')

            //hide the map
            $("#offerDetails_map").css("display", "none")

            // hide details
            $("#offer_address").css("display", "none")
            $("#offer_finePrint").css("display", "none")
             

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
           
              console.log(response)
              
              if(mode == "dealMode"){
                // update availability
                $("#offerDetails_offersLeft").html(response.AvailableClips + " / " + response.SimultaneousClipsAllowed)
                
                // update image ?
                //$("#offerDetails_image").attr("src", app.IMG_URL + response.PreviewImage)
                $("#offerDetails_image_container").html( '<img src="' + app.IMG_URL + response.PreviewImage+'" width="600" height="300"  />')


                //$("#offerDetails_image_container img").addClass("show")
              }else{
                $("#offerDetails_image_container").html( '<img src="' + app.IMG_URL + app.details.itemData.PreviewImage+'" width="600" height="300"  />')
              }

              ///store previous image as thumb and current as main image
                app.details.itemData.ThumbImage = app.details.itemData.PreviewImage;
                app.details.itemData.PreviewImage = response.PreviewImage
                app.details.itemData.DetailLink = response.DetailLink


              if(response.IsSelected == true){
                 $("#redeemDeal_main_button").addClass("selected");
                 app.details.itemData.status = "selected"
              }

              //// build address
              if(response.MerchantAddress != null && response.MerchantAddress != "" ){
                  var address = ""
                      address += "<p>" + response.MerchantAddress + '</p>';
                      address += "<p>" + response.MerchantCity + ', ' + response.MerchantState  + ', ' + response.MerchantZip  +'</p>';
                 
                      if(response.MerchantWebsite != null){
                       // ":null,"MerchantPhone":"314-781-0900"

                       address += '<a href="'+response.MerchantWebsite +'"> Company Website </a>'
                      }

                      if(response.MerchantPhone != null){
                          address += '<a href="tel:'+response.MerchantPhone+'">'+response.MerchantPhone+'</a>'
                      }

                  $("#offer_address").html(address ).css("display", "block")

              }
              //// build finePrint
              if(response.FinePrint != null && response.FinePrint != ""){
                  var _fineprint = ""
                      _fineprint += "<strong>The Fine Print</strong>";
                      _fineprint += "<p>" + response.FinePrint +'</p>';
                  
                  $("#offer_finePrint").html( _fineprint ).css("display", "block")
              }

              if(response.QrCodeUrl != null){
                  app.details.itemData.QrCodeUrl = response.QrCodeUrl
                  //console.log(response.QrCodeUrl)
              }

              if(response.OfferCode!=null){
                app.details.itemData.OfferCode = response.OfferCode

              }

              console.log("invocado el QR")

              app.details.myScroll.refresh()

              app.details.renderMap(response);
           
           },
           beforeSend: function (xhr) {                              

              xhr.setRequestHeader('Authorization',  'Bearer ' + localStorage.getItem("accessToken"));
              
           },
           error: function (response) {
           /** TODO DEFINE COPY */
     

            var  msg = "Can't connect to server. Please try again later"
            navigator.notification.alert( msg , null,' ','OK')
           
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

Details.prototype.renderMap = function(_data) {



  var mapOptions = {
    zoom: 17, 
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('offerDetails_map'),
      mapOptions);

  //console.log(_data.MerchantAddress)
  var address = _data.MerchantAddress + ", " + _data.MerchantCity + ", " + _data.MerchantState ;
 
  var geocoder = new google.maps.Geocoder();
  
  google.maps.event.trigger(map, 'resize');

  geocoder.geocode( { 'address': address}, function(results, status) {
    
    
    if (status == google.maps.GeocoderStatus.OK) {
      $("#offerDetails_map").css("display", "block")
      
      //map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });

      
      google.maps.event.trigger(map, 'resize');
      map.setCenter(results[0].geometry.location);
    
    app.details.myScroll.refresh()

    } else {
      //alert('Geocode was not successful for the following reason: ' + status);
      

    }

  });



  
  //$("#offerDetails_map")
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

        app.details.itemData.status = "selected"
        app.details.callWSData()
         
      },

      beforeSend: function (xhr) {                              

          xhr.setRequestHeader('Authorization',  'Bearer ' + localStorage.getItem("accessToken"));
          console.log(xhr);
      },

      error: function (response) {
        console.log(response)

        var  msg = "We are out of the " + app.outputText( app.details.itemData.MerchantName ) + "  offer today. Please check back tomorrow for this great offer."

        navigator.notification.alert( msg , null,'Not Available','OK')

       //  navigator.notification.alert(message, null, [title], [buttonName])
       // "We are out of the St. Louis Zoo offer today. Please check back tomorrow for this great offer."

        //console.log(response)
      }
    });


  /// on success, add to local DB
  //app.details.addRecordToDB()
};

Details.prototype.addRecordToDB = function(){

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