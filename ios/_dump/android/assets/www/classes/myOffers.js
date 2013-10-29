function MyOffers(){
	this.init()
}

MyOffers.prototype.init = function(first_argument) {
	// attach behaviosfor page display
	$("#myOffers").on( "pageshow", function() {
		
		if( localStorage.getItem("myOffers_activeTab") == "ready"){
				$("#myOffers_readyToUse").addClass("active")
				$("#dmyOffers_alreadyUsed").removeClass("active")
			}else if( localStorage.getItem("myOffers_activeTab") == "already"){
				$("#myOffers_alreadyUsed").addClass("active")
				$("#myOffers_readyToUse").removeClass("active")
			}

			$.mobile.loading( "show" );
			app.database.queryMyOffersInDB()

	})

	//// attach tab events for box buttons
	$( "#myOffers .availability .box" ).on( 'tap', function(){

		if( $(this).attr("id") == "myOffers_readyToUse" ){
			localStorage.setItem("myOffers_activeTab","ready");

			$(this).addClass("active")
			$("#myOffers_alreadyUsed").removeClass("active")

		}else if( $(this).attr("id") == "myOffers_alreadyUsed"){

			localStorage.setItem("myOffers_activeTab","already");

			$(this).addClass("active")
			$("#myOffers_readyToUse").removeClass("active")
		}

		$.mobile.loading( "show" );
		/// after tap, refresh list
		app.database.queryMyOffersInDB()

	})
};

MyOffers.prototype.renderValues = function(_data) {
	
	///my offers render from database onlu

	console.log("i have data")
    console.log(_data)
    
    
    
    /// hace un loop sobre los items
    var updatedList = ""

    for (var i = 0; i < _data.length; i++) {
    	_data[i]
    	updatedList += this.createItem(_data[i]);
    };

     $("#myOffers_main").html(updatedList)

	this.refreshListLinks()

	/// scroll refresh
	setTimeout(function () {
	           app.dealList.myScroll.refresh()
	}, 100);


	 $.mobile.loading( "hide" );


};

MyOffers.prototype.createItem = function(_itemData) {
	// crea un item y sus los eventos
	var singleItem = ""

		singleItem += '<li class="link" data-itemFullData = "'+ app.escapeText( JSON.stringify(_itemData) ) +'" >';
        //singleItem += '<img src="img/placeholders/img1.png"  />';
        singleItem += '<h2>'+app.outputText(_itemData.DealName)+'</h2>';
        singleItem += '<p>'+ app.outputText(_itemData.Description)+'</p>';
        singleItem += '<p class="dueDate">Use by ' + app.dateConverter(_itemData.EndsOn)+ '</p>'; //EndsOn
        singleItem += '</li>';
        

        // TODO: delete this text
			/*
			AvailableClips: 5
			ClipDurationDays: 1
			DealID: 80
			DealName: "1/2 Bloody Mary Bill"
			Description: "Get half off of the total Bloody Mary bill Mon-Thurs. "
			DetailLink: "/detail/80"
			EndsOn: "3/17/2014"
			EstimatedValue: 30
			InstancesAvailableToUser: 0
			LocationClusterID: 22
			MerchantCategoryID: 4
			MerchantName: "City Diner"
			Popularity: 0
			PreviewImage: "img-offers/2013/32/80.jpg"
			SimultaneousClipsAllowed: 5
			StartsOn: "1/18/2013"
			TotalRedemptionsAllowed: 5000
			*/
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

