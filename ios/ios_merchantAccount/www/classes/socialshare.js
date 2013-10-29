
function Socialshare (){
	this.itemData = {}
}

Socialshare.prototype.email = function() {

	//console.log("=-=-=-=-=-=-=-=-=-")
	//console.log(this.itemData)

	var emailSubject = this.itemData.Description //"Greetings%20from%20Cupertino!"
	var emailBody = this.itemData.Description + "  \n \n  " +this.itemData.DetailLink; //Wish%20you%20were%20here!"

	$("#shared_email").attr("href", "mailto:%20?subject="+ emailSubject +"&body="+emailBody)
};

Socialshare.prototype.twitter = function() {

	///remove previous listeners
	$("#shared_twitter").off("tap")

	$("#shared_twitter").on("tap", function(){

		var _URL =  app.details.socialshare.itemData.DetailLink
		
        var image
        if(app.details.itemData.ThumbImage != null){
            image = app.IMG_URL +  app.details.itemData.ThumbImage
        }else{
            image = app.IMG_URL +  app.details.itemData.PreviewImage
        }

		var text = app.outputText(app.details.socialshare.itemData.Description);

		
		window.plugins.twitter.composeTweet(
			function(s){ console.log("tweet success"); },
			function(e){ console.log("tweet failure: " + e); },
			text, 
			{
				urlAttach:_URL,
				imageAttach:image
			});

		 //window.open("http://twitter.com/home?status=having a great time" , '_blank', 'location=yes');
	})
};

Socialshare.prototype.facebok = function() {
	
	$("#shared_facebook").off("tap")

	$("#shared_facebook").on("tap", function(){

		var URL = app.details.socialshare.itemData.DetailLink

		var image
		if(app.details.itemData.ThumbImage != null){
			image = app.IMG_URL +  app.details.itemData.ThumbImage
		}else{
			image = app.IMG_URL +  app.details.itemData.PreviewImage
		}

		

		var text =  app.outputText(app.details.socialshare.itemData.Description) ;

		var title =  app.outputText(app.details.socialshare.itemData.MerchantName) ;

		app.facebookAuth.facebookWallPost( title , URL , image, "Good Loop", text )
	})
		
}

Socialshare.prototype.sms = function(){

	$("#shared_message").off("tap")

	$("#shared_message").on("tap", function(){

		var URL = app.details.socialshare.itemData.DetailLink
		var image = app.IMG_URL +  app.details.itemData.PreviewImage
		var text =  app.outputText(app.details.socialshare.itemData.Description) ;
		var title =  app.outputText(app.details.socialshare.itemData.MerchantName) ;


		window.plugins.smsComposer.showSMSComposer(' ', text + " " + URL );

	})
}

/// enable behavior for each button
Socialshare.prototype.enableButtons = function(_data){

	this.itemData = _data

	/// twiter

	this.email()

	this.twitter()
	this.facebok()
	this.sms()

}

