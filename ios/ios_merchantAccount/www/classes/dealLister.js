// JavaScript Document

function DealList() {
	/// escucha cuando se abre esta pagina
	this.init()

	var container = $('#wrapper');
	this.myScroll = new iScroll('wrapper', {
		onScrollEnd: function() {
			container.trigger('scroll');
		}
	});


}

/// local properties
DealList.prototype.listItemsFilter;
DealList.prototype.currentIndent;
DealList.prototype.currentFilters = {};
DealList.prototype._tempOutput


DealList.prototype.init = function() {

	$("#dealList").on("pagecreate", function() {
		//app.dealList.filterItems.check()
		app.dealList.buildFilter()
	})



	// check elements on show
	$("#dealList").on("pageshow", function() {

		localStorage.setItem("dealList_activeTable", "offersNow");


		app.dealList.verifyData()

		///check wich section is active
		/*
                 if( localStorage.getItem("dealList_activeTable") == "offersNow"){
					$("#dealList_Available_now").addClass("active")
					$("#dealList_Available_soon").removeClass("active")
				
                }else if( localStorage.getItem("dealList_activeTable") == "offersSoon"){
					$("#dealList_Available_soon").addClass("active")
					$("#dealList_Available_now").removeClass("active")
				}
                 */

		//update scroll
		app.dealList.refreshScroll()
	})


	///
	$("#dealList").on("pagehide", function() {
		//app.dealList.myScroll.destroy()
		//app.dealList.myScroll = null
		//$("#dealList_main").html("")
	})

	$("#dealList").on("pagebeforeshow", function() {
		localStorage.setItem("dealList_activeTable", "offersNow")
		$("#dealList_Available_now").addClass("active")
		$("#dealList_Available_soon").removeClass("active")
		//app.dealList.myScroll = new iScroll('wrapper');
	})
	//myScroll.destroy();



	/// attach button behaviors
	$("#dealList .availability .box").on('tap', function() {


		// change styles & set new data

		if ($(this).attr("id") == "dealList_Available_now") {
			localStorage.setItem("dealList_activeTable", "offersNow");

			$(this).addClass("active")
			$("#dealList_Available_soon").removeClass("active")

		} else if ($(this).attr("id") == "dealList_Available_soon") {

			localStorage.setItem("dealList_activeTable", "offersSoon");

			$(this).addClass("active")
			$("#dealList_Available_now").removeClass("active")
		}

		/// once everything is ready, show data
		$.mobile.loading("show");

		$("#dealList_main").html("")


		if (app.dealList.currentFilters.offsetRecords == 0) {
			// scroll up only if is the first record
			app.dealList.verifyData()
		} else {
			app.dealList.getOffersformWebService()
		}

	})


	/// create the categories list Items

	this.listItemsFilter = [
		"All Deals",
		"Area",
		"Dining &amp; Nightlife",
		"Health &amp; Beauty",
		"Fitness",
		"Retail &amp; Services",
		"Activities &amp; Events",
		"Special Interest"
	]


	this.listItemsFilterValues = [-1, 0, 4, 6, 5, 7, 3, 1]

	this.currentIndent = 0
};


/// check data on the list are displayed properly everytime
DealList.prototype.verifyData = function() {

	// TODO: define available tab
	// TODO: based on the available tab, check the proper webservice
	// TODO: check the defined sort to call the DB list properly



	/*//verify if its old
	if( this.verifyLastUpdatedate() ){
		///OLD entries
	}else{
		///updated under 24 hours

	}
	* /
	if(localStorage.getItem("latestUpdate_dealList") == null){

		app.dealList.callProperData()

	}else{
    */


	if (app.dealList.verifyDate()) {
		console.log("update from web service!!!")
		app.dealList.getOffersformWebService()
	} else {
		app.dealList.callProperData()
	}



	//}
};

DealList.prototype.callProperData = function() {

	var mainList = $("#dealList_main")
	/// verify there's a rendered list
	if (mainList.html() == "") {


		////

		//app.dealList.getOffersformWebService()

		/**/



		console.log("no data on list")
		/// check if there's Data on DB
		app.database.db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM ' + localStorage.getItem("dealList_activeTable"), [], function(tx2, results) {
				if (results.rows.length == 0) {
					// no results, call web service
					console.log("calling web service")
					app.dealList.getOffersformWebService()

				} else {
					// there are results!
					console.log("resultados en DB, invocando")
					app.database.queryOffersInDB()
				}
			})
		})



	} else {
		//todo ok, si el usuario actualiza, le damos
	}
}

DealList.prototype.getOffersformWebService = function(_filter) {
	///display the loading icon
	$.mobile.loading("show");


	/// prevent details broke
	$("#offerDetails .ui-content").css("padding", '0')


	/// format query params
	var paramData = {}
	paramData.numberOfRecords = 11;

	if (localStorage.getItem("dealList_activeTable") == "offersNow") {
		//xtra = "&exclusiveAvailableNow=true"
		paramData.exclusiveAvailableNow = "true"
	} else {
		//xtra = "&exclusiveComingSoon=true";
		paramData.exclusiveComingSoon = "true"
	}

	/// add Filters (if apply)

	if (_filter != null) {

		//order
		//● sortField: string - default = ""

		// distance
		if (_filter.maxDistance != null) {
			paramData.maxDistance = _filter.maxDistance;
		}

		// category ID
		if (_filter.merchantCategoryID != null) {
			paramData.merchantCategoryID = _filter.merchantCategoryID
		}

		//Pagination

		if (_filter.offsetRecords != null) {
			paramData.offsetRecords = _filter.offsetRecords
		}

		/// location
		if (_filter.latitude != null) {
			paramData.originLat = _filter.latitude
			paramData.originLong = _filter.longitude
		}



	}

	/// store current Filters
	app.dealList.currentFilters = paramData


	// connect with webservice
	console.log("request are")
	console.log(paramData)
	$.ajax({
		type: "GET",
		url: app.WS_URL + "deal?source=mu",
		dataType: 'json',
		data: paramData, //{ "numberOfRecords": 10}  ,
		contentType: "application/json; charset=utf-8",
		success: function(response, status, xhr) {

			/// sync Database and wait for event to render list
			if (response.length > 0) {
				app.database.addItemsToDatabase(response)

				///store date tag
				var dateNow = new Date();
				localStorage.setItem("latestUpdate_dealList", dateNow)

			} else {
				// No data available
				app.dealList.renderNoresults()
				$.mobile.loading("hide");
			}

		},
		beforeSend: function(xhr) {
			//xhr.overrideMimeType("text/plain; charset=x-user-defined");
		},
		error: function(response) {
			/** TODO DEFINE COPY */

			var msg = "Can't connect to server. Please try again later"
			navigator.notification.alert(msg, null, ' ', 'OK')

		}
	});


	// la respuesta conecta con el updateListView
};

DealList.prototype.renderList = function(_data) {

	/// hace un loop sobre los items
	var updatedList = ""

	for (var i = 0; i < _data.length; i++) {

		// display only 10 on the displayed data
		// the 11th is just for pagination
		if (i < 10) {
			_data[i]
			updatedList += this.createItem(_data[i]);
		}
	};



	// adds the extra line when there's more contents
	if (_data.length == 11) {
		//updatedList +=  '<li onClick="showNextPage()" class="dealList_moreDeals"> <span> </span> See Previous Offers <span> </span> </li>';

		updatedList += '<li onClick="app.dealList.showNextPage()" id="dealList_moreDeals"> <span> </span> See More Offers <span> </span> </li>';
	}

	//update html
	if (app.dealList.currentFilters.offsetRecords > 0) {
		$("#dealList_moreDeals").remove()
		$("#dealList_main").append(updatedList)
	} else {
		$("#dealList_main").html(updatedList)
	}


	//clear tap event
	//$("#dealList ul li").off('tap')


	$("img.lazy").show().lazyload({
		threshold: 500,
		container: $("#wrapper")
	});


	// update all links to preserve tap
	app.dealList.refreshListLinks()

	/// scroll refresh
	app.dealList.refreshScroll()

	// finish
	$.mobile.loading("hide");
};

DealList.prototype.renderNoresults = function() {

	$("#dealList_main").html('<li class="errorHeader">No Offers are available.</li>')
	/// scroll refresh
	setTimeout(function() {
		app.dealList.myScroll.refresh()
		if (app.dealList.currentFilters.offsetRecords == 0) {
			// scroll up only if is the first record
			app.dealList.myScroll.scrollTo(0, 0, 0)
		}
		//
	}, 100);
}

DealList.prototype.createItem = function(_itemData) {


	// crea un item y sus los eventos
	var singleItem = ""

	singleItem += '<li class="link" data-itemFullData = "' + app.escapeText(JSON.stringify(_itemData)) + '" >';
	singleItem += '<img class="lazy" src="img/placeholders/img1.png"  data-original="' + app.IMG_URL + _itemData.PreviewImage + '"  width="183" height="240" />';
	//console.log(app.IMG_URL + _itemData.PreviewImage)
	//singleItem += '<img src="img/placeholders/img1.png"  width="183" height="240" />'; //PreviewImage
	singleItem += '<h2>' + app.outputText(_itemData.MerchantName) + '</h2>';
	singleItem += '<p>' + app.outputText(_itemData.Description) + '</p>';
	singleItem += '<p class="dueDate">Use by ' + app.dateConverter(_itemData.EndsOn) + '</p>'; //EndsOn
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
             DealID, Description, EndsOn, MerchantName, PreviewImage
			*/
	return singleItem
};

DealList.prototype.destroyer = function() {

	// se ejecuta cuando el usuario sale de aqui para salvar RAM
};

/** FILTERS **/
DealList.prototype.showFilters = function() {

	$("#scrollerFilter").trigger('focus')
};


/// events

/// add tap events for all new elements
DealList.prototype.refreshListLinks = function() {

	$("#dealList ul li").off('tap')

	$("#dealList ul li").on('tap', function() {

		if (this.hasAttribute("data-itemFullData")) {
			/// parse data into object

			var _info = JSON.parse(app.outputText(this.getAttribute("data-itemFullData")))

			/// send data to DetailsClass
			app.details.itemData = _info;

			$.mobile.changePage("#offerDetails", {
				transition: "slide"
			});
		}

	})
};

DealList.prototype.refreshScroll = function(_scrollOption) {
	setTimeout(function() {
		app.dealList.myScroll.refresh()
		if (_scrollOption == "no") {
			app.dealList.myScroll.scrollTo(0, 0, 0)
		}
	}, 100);
};

DealList.prototype.buildFilter = function() {

	$('#scrollerFilter').mobiscroll({
		theme: 'ios',
		display: 'bottom',
		mode: 'scroller',
		height: 80,
		wheels: [ // Wheel groups array
			[ // First wheel group
				{ // Wheel object
					label: 'Label 1',
					keys: ["ASC", "DESC"],
					values: ['A - Z', 'Z - A'],
				}, { // Wheel object
					label: 'Label 2',
					keys: app.dealList.listItemsFilterValues,
					values: app.dealList.listItemsFilter,
				}, { // Wheel object
					label: 'Label 2',
					keys: [1, 5, 10, 15, 20],
					values: ['1 Mile', '5 Miles', '10 Miles', '15 Miles', '20 Miles'],
				}
			]
		],
		onClose: function(valueText, inst) {
			app.dealList.updateListByFilter(valueText)
		}
	});



	/*
	    $('#show').click(function(){
	        //$('#scrollerFilter').mobiscroll('show');
	                     
	         //$(".ios div.dwo").click(function(e){ console.log(e)  })
	                     
	        return false;
	    });
	    
	    
	    $('#clearTreeList').click(function () {
	        $('#demo' + '_dummy').val('');
	        return false;
	    });
	     */
};

DealList.prototype.updateListByFilter = function(_rawQuery) {

	var output = {}

	/// process the query
	var arrayQuery = _rawQuery.split(" ")

	/// build the WS query

	// process categories
	if (arrayQuery[1] > 0) {
		output.merchantCategoryID = arrayQuery[1];
	}

	if (arrayQuery[2] > 0) {
		output.maxDistance = arrayQuery[2];
	}
	//

	/// reset pagination to 0
	this.currentIndent = 0
	this.currentFilters.offsetRecords = 0



	/// call new Data and send it to render
	/// comment this line if GEOLOCATION is active
	this.getOffersformWebService(output)


	//////////////////////////// GEOLOCATION READY (disabled for testing purposes ) ////////////////

				this._tempOutput = output

				/// wait a seccond to hide all


				var wait = setTimeout(function(){

						// now retrieve location
						navigator.geolocation.getCurrentPosition(function(e){
							 
							app.dealList._tempOutput.latitude = e.coords.latitude
							app.dealList._tempOutput.longitude = e.coords.longitude

							app.dealList.getOffersformWebService(app.dealList._tempOutput)
						}, 
						function(){
							console.log("error")
						}
						, { enableHighAccuracy: true } );


				}, 200)
		////////////////////////
};

DealList.prototype.showNextPage = function() {


	if (this.currentIndent == null) {
		// defailt value
		this.currentIndent = 0
	} else {
		//add offset
		this.currentIndent += 10
	}

	/// define current offset to saved filters
	this.currentFilters.offsetRecords = this.currentIndent

	/// call updated WS
	app.dealList.getOffersformWebService(this.currentFilters)

	//app.dealList.myScroll.scrollTo(0, 0, 0)
};

DealList.prototype.showPrevPage = function() {


	if (this.currentIndent < 0) {
		// defailt value
		this.currentIndent = 0
	} else {
		//add offset
		this.currentIndent -= 10
	}

	/// define current offset to saved filters
	this.currentFilters.offsetRecords = this.currentIndent

	/// call updated WS
	app.dealList.getOffersformWebService(this.currentFilters)
}

/// verify Date


DealList.prototype.verifyDate = function(lastUpdate) {

	///TODO fake Date, replace with real values
	var lastUpdate = new Date(localStorage.getItem("latestUpdate_dealList"));

	// define an offset and convert it to miliseconds 
	var dayOffset = 1;
	var millisecondOffset = dayOffset * 60 * 60 * 1000;

	//
	_maxDateToUpdate = new Date()
	_maxDateToUpdate.setTime(lastUpdate.getTime() + millisecondOffset);

	///today
	var today = new Date();
	/*
	    console.log("last upDate: " + lastUpdate )
	    console.log("a esta hora actualiza: " + _maxDateToUpdate )
	    console.log("ahora es: " + today  )
	    */

	/* NO MORE CACHE! :S
	// validar fecha
	if (_maxDateToUpdate.getTime() > today.getTime()) {
		console.log("no update")
		return false;
	} else {
		console.log("update needed")
		return true;
	}
	*/
	return true
};


DealList.prototype.paginationControl = function() {

	///check if is a new page and set scroll

	/// anything between seccnd and not last have a next button

	/// anithung but first page, 

};