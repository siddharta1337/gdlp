function MyOffers(){
	this.init()
	this.myScroll = new iScroll('wrapper_myOffers', { 
		useTransition: true,
		onScrollEnd: function () { }
	});
}

MyOffers.prototype.offersTab 
MyOffers.prototype.longInterval 

MyOffers.prototype.init = function(first_argument) {
	
	// attach behaviosfor page display

	$("#myOffers").on( "pagebeforeshow", function() { 
		$("#myOffers_titleNum").html("")//.html("(" + conteo +")")
	})

	$("#myOffers").on( "pageshow", function() {
		
		var param
		if( localStorage.getItem("myOffers_activeTab") == "ready"){
				$("#myOffers_readyToUse").addClass("active")
				$("#myOffers_alreadyUsed").removeClass("active")

				app.myOffers.offersTab  = "ready"

		}else if( localStorage.getItem("myOffers_activeTab") == "already"){

			$("#myOffers_alreadyUsed").addClass("active")
			$("#myOffers_readyToUse").removeClass("active")

			app.myOffers.offersTab  = "already"
		}
			

		//display the selected deal count
			var conteo =  localStorage.getItem("numberOfSelectedDeals")

			if( conteo  != null && conteo > 0){
				$("#myOffers_titleNum").html("")//.html("(" + conteo +")")
			}
			
			$.mobile.loading( "show" );
			app.myOffers.retrieveAllFromWs()
			
			//app.database.queryMyOffersInDB()

		app.myOffers.longInterval = setInterval( function(){
			app.myOffers.retrieveAllFromWs()
			console.log("long interval")
		}, 300000)


	})

	$("#myOffers").on( "pagehide", function() {

		localStorage.setItem("myOffers_activeTab","ready")
		app.myOffers.offersTab  = "ready"

		$("#myOffers_readyToUse").addClass("active")
		$("#myOffers_alreadyUsed").removeClass("active")

		/// clean the interval
		window.clearInterval(app.myOffers.longInterval)

	})
	//// attach tab events for box buttons
	$( "#myOffers .availability .box" ).off("tap")
	$( "#myOffers .availability .box" ).on( 'tap', function(){

		if( $(this).attr("id") == "myOffers_readyToUse" ){
			localStorage.setItem("myOffers_activeTab","ready");

			$(this).addClass("active")
			$("#myOffers_alreadyUsed").removeClass("active")
			app.myOffers.offersTab  = "ready"

			console.log("ready to use")

		}else if( $(this).attr("id") == "myOffers_alreadyUsed"){

			localStorage.setItem("myOffers_activeTab","already");

			$(this).addClass("active")
			$("#myOffers_readyToUse").removeClass("active")

			app.myOffers.offersTab  = "already"

			console.log("already redeemed")
		}

		$.mobile.loading( "show" );
		app.myOffers.retrieveAllFromWs()
		/// after tap, refresh list
		//app.database.queryMyOffersInDB()
	})
};

/// retrieve all clips info
MyOffers.prototype.retrieveAllFromWs = function() {

		var sendData = {}
			sendData.source = "mu"


		if(app.myOffers.offersTab  == "already"){
			sendData.redeemed = "true"

		}else{
			 //sendData.redeemed = "false"
			 delete sendData.redeemed //= "false"
		}


		

		$.ajax({
			type: "GET",
			url:  app.WS_URL_secure + "clip",
			dataType: 'json',
			data: sendData,
			contentType: "application/json; charset=utf-8",
			success:  function (response, status){

				/// sync Database and wait for event to render list
					if(response.length > 0){

						 app.myOffers.renderValues(response)


						 app.myOffers.verifyDataDisplayed()

					}else{
						// No data available, please try again later
						//
						app.myOffers.showError()


					}
					
					//console.log(response)

			},
			beforeSend: function (xhr) {                              
				xhr.setRequestHeader('Authorization',  'Bearer ' + localStorage.getItem("accessToken"));
			},
			error: function (response) {
				console.log("error retrieving clip")
				console.log(response)
				$.mobile.loading( "hide" );
			}
  		});
};

/// process clips info
MyOffers.prototype.renderValues = function(_data) {
	
    var updatedList = ""

    for (var i = 0; i < _data.length; i++) {
    	_data[i]
    	updatedList += this.createItem(_data[i]);
    };

    $("#myOffers_main").html(updatedList)

	this.refreshListLinks()

	/// scroll refresh	
	app.myOffers.refreshScroll()

	/// update the selected clips count
	localStorage.setItem("numberOfSelectedDeals", _data.length)

	$("#myOffers_titleNum").html("(" + _data.length  +")")

	 $.mobile.loading( "hide" );
};

MyOffers.prototype.verifyDataDisplayed = function() {
	
	//verify if there are displayed items
	if( $("#myOffers_titleNum").html() != "" && localStorage.getItem("numberOfSelectedDeals") != null ){

		// if theres more than one it checks the html data
		if( $("#myOffers_main").html() == "" && localStorage.getItem("numberOfSelectedDeals") > 0){
			app.myOffers.refreshListLinks()
			//$(".wrapper").css("z-index","1")
		}

	}
};

MyOffers.prototype.createItem = function(_itemData) {

	// create the item object
	var singleItem = ""

	/// adding a status label
	_itemData.status = "selected"

	/// create the item
		singleItem += '<li class="link" data-itemFullData = "'+ app.escapeText( JSON.stringify(_itemData) ) +'" >';
        //singleItem += '<img src="img/placeholders/img1.png"  />';
        singleItem += '<h2>'+app.outputText(_itemData.MerchantName )+'</h2>';
        singleItem += '<p>'+ app.outputText(_itemData.Description)+'</p>';
        singleItem += '<p class="dueDate">Use by ' + app.dateConverter(_itemData.EndsOn)+ '</p>'; //EndsOn
        singleItem += '</li>';
         
	return singleItem
};


MyOffers.prototype.refreshListLinks = function() {
    
	$("#myOffers_main li").on('tap', function(){
                  
                  if( this.hasAttribute("data-itemFullData") ){
                  /// parse data into object
                   
                    var _info = JSON.parse( app.outputText( this.getAttribute("data-itemFullData") )  )
                  
                    /// send data to DetailsClass
                    app.details.itemData = _info;
                  
                    $.mobile.changePage("#offerDetails", { transition: "slide" });
                  }
                  
    })
};
/*

MyOffers.prototype.refreshScroll = function() {
	setTimeout(function () {
		app.myOffers.myScroll.refresh()
		app.myOffers.myScroll.scrollTo(0, 0, 0)
	}, 100);
};
*/
MyOffers.prototype.refreshScroll = function() {
	setTimeout(function () {
	    app.myOffers.myScroll.refresh()
	    app.myOffers.myScroll.scrollTo(0, 0, 0)
	    $("#myOffers .wrapper").css("z-index","1")
	}, 100);
};


MyOffers.prototype.refreshOnResume = function() {

	app.myOffers.retrieveAllFromWs()
	console.log("refresh my offers from WS")	
};

MyOffers.prototype.showError = function(){
	$("#myOffers_main").html('<li class="errorHeader"> No Offers Found </li>')
	$.mobile.loading( "hide" );
}
 