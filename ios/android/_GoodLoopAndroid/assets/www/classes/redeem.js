function Redeem(){

	this.init();

}

Redeem.prototype.init = function() {

	///refresh contents every time
	$("#redeemDeal").on( "pagebeforeshow", function() {
		app.redeem.buildPage()
	})

  $("#redeemDeal").on( "pageshow", function() {
    //$("#redeem_qrcode").attr("src", app.details.itemData.QrCodeUrl )
    $("#redeem_qrCode").html('<img id="redeem_qrcode" src="'+app.details.itemData.QrCodeUrl +'" width="282" height="282"  />')
    

  })

  $("#redeemDeal").on( "pagehide", function() {
    //$("#redeem_qrcode").attr("src", "")
    $("#redeem_qrCode").html()
    //<img id="redeem_qrcode" width="282" height="282"  />
  })


    
    $("#redeemDeal_withCode").on("tap", function(){
       navigator.notification.prompt(
                                     ' ',  // message
                                     onPrompt,                  // callback to invoke
                                     'Redemption Code',            // title
                                     ['Cancel','Submit']              // buttonLabels
                                     );
       
       function onPrompt(results) {
         
         app.redeem.sendCode(results.input1)
       }
    })
};


Redeem.prototype.buildPage = function() {
	
	// format info
	$("#redeemDeal_name").html( app.outputText( app.details.itemData.MerchantName ) )
	$("#redeemDeal_name_main").html( app.outputText( app.details.itemData.MerchantName ) )
	// TODO: 
    //$("#offerDetails_image").attr("src", this.itemData.PreviewImage)
  $("#redeemDeal_details").html( app.outputText( app.details.itemData.Description) )

  

     //var fname=prompt("Please enter your name:","Your name")
  		//document.getElementById("msg").innerHTML="Greetings " + fname
    
    /*
    $("#offerDetails_name").html( app.outputText( this.itemData.MerchantName ) )
    $("#offerDetails_image").attr("src", app.IMG_URL + this.itemData.PreviewImage)
    $("#offerDetails_details").html( app.outputText( this.itemData.Description) )
    $("#offerDetails_due").html(app.dateConverter(this.itemData.EndsOn) )
     */
  
};


Redeem.prototype.sendCode = function(_code) {
    
    var theData = '{ "offercode" : "'+ app.escapeText(_code) +'"  }';
    
    if(_code!=""){
      $.ajax({
          type: "POST",
          url: app.WS_URL+"offercode?source=mu",
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          data: theData,

          success:  function (response, status){
              
            console.log("------------------")
            console.log(response)

            navigator.notification.alert(response.msg,null,'Redeem Code','OK')

             
          },
          error: function (response) {
            console.log("no")//response)
            console.log(response)
          }
      });
    }
};