function Redeem(){

	this.init();

}

Redeem.prototype.init = function() {

	///refresh contents every time
	$("#redeemDeal").on( "pagebeforeshow", function() {
		app.redeem.buildPage()
	})
};

Redeem.prototype.buildPage = function() {
	
	// format info
	$("#redeemDeal_name").html( app.outputText( app.details.itemData.DealName ) )
	$("#redeemDeal_name_main").html( app.outputText( app.details.itemData.DealName ) )
	// TODO: 
    //$("#offerDetails_image").attr("src", this.itemData.PreviewImage)
    $("#redeemDeal_details").html( app.outputText( app.details.itemData.Description) )

     //var fname=prompt("Please enter your name:","Your name")
  		//document.getElementById("msg").innerHTML="Greetings " + fname
  
};