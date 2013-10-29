// JavaScript Document

function Details(){
	this.init()
  this.myScroll;
  this.myScroll = new iScroll('wrapperDetails');
}
 
Details.prototype.itemData = {};

Details.prototype.init = function() {
	

	$("#offerDetails").on( "pagebeforeshow", function() {
		app.details.buildPage()

    setTimeout(function () {
             app.details.myScroll.refresh()
    }, 100);


	})

  /// attach tab event from select buttom

  $("#redeemDeal_main_button").on("tap", function(){
    app.details.mainbuttonDisplay($(this))
    return false
  })

  $("#shareButton").on("tap", function(){
    $("#shareOverlay").css("display","block")
    return false
  })

};

Details.prototype.buildPage = function() {
	//console.log(this.itemData.DealID)
	// format info
	$("#offerDetails_name").html( app.outputText( this.itemData.MerchantName ) )
    $("#offerDetails_image").attr("src", app.IMG_URL + this.itemData.PreviewImage)
    $("#offerDetails_details").html( app.outputText( this.itemData.Description) )
    $("#offerDetails_due").html(app.dateConverter(this.itemData.EndsOn) ) 
    this.callWSData()
};

Details.prototype.callWSData = function(){
    
    $.ajax({
           type: "GET",
           url: app.WS_URL + "deal/"+ app.details.itemData.DealID+"?source=mu",
           dataType: 'json',
           
           contentType: "application/json; charset=utf-8",
           success:  function (response, status, xhr){
           console.log(response)

             $("#offerDetails_offersLeft").html(response.AvailableClips + " / " + response.SimultaneousClipsAllowed)
           
           /// sync Database and wait for event to render list
             if(response.length == 0){
              //app.database.updateItemInDatabase(response)
             

             } 
           
           },
           error: function (response) {
           /** TODO DEFINE COPY */
           alert("Can't connect to server. Please try again later")
           
           }
           });
};

/// changes the mainButon accordin to user settings
Details.prototype.mainbuttonDisplay = function(_target){

  // change class to seleted
  _target.addClass("selected");

}




 