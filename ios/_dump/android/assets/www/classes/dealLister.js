// JavaScript Document

function DealList(){
	/// escucha cuando se abre esta pagina
	this.init()
	this.myScroll;
	this.myScroll = new iScroll('wrapper');


}

DealList.prototype.init = function() {

		$("#dealList").on("pagecreate",function(){
			app.dealList.buildFilter()
		})
		// al abir revisa que existan elementos
		$("#dealList").on( "pageshow", function() {
			
			app.dealList.verifyData()

			///check wich section is active

			if( localStorage.getItem("dealList_activeTable") == "offersNow"){
				$("#dealList_Available_now").addClass("active")
				$("#dealList_Available_soon").removeClass("active")
			}else if( localStorage.getItem("dealList_activeTable") == "offersSoon"){
				$("#dealList_Available_soon").addClass("active")
				$("#dealList_Available_now").removeClass("active")
			}

			
		})

		/// attach button bejaviors
		$( "#dealList .availability .box" ).on( 'tap', function(){
			

			// change styles & set new data

			if( $(this).attr("id") == "dealList_Available_now" ){
				localStorage.setItem("dealList_activeTable","offersNow");

				$(this).addClass("active")
				$("#dealList_Available_soon").removeClass("active")

			}else if( $(this).attr("id") == "dealList_Available_soon"){

				localStorage.setItem("dealList_activeTable","offersSoon");

				$(this).addClass("active")
				$("#dealList_Available_now").removeClass("active")
			}

			/// once everything is ready, show data
			$.mobile.loading( "show" );

			$("#dealList_main").html("")
			app.dealList.verifyData()
 


		})
};

/// check data on the list are displayed properly everytime
DealList.prototype.verifyData = function() {

	// TODO: define available tab
	// TODO: based on the available tab, check the proper webservice
	// TODO: check the defined sort to call the DB list properly

	


	var mainList =  $("#dealList_main")

	/// verify there's a rendered list
	if( mainList.html() == ""){

			console.log("no data on list")
			/// check if there's Data on DB
			app.database.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM '+ localStorage.getItem("dealList_activeTable"), [], function(tx2, results){
					if(results.rows.length == 0){
						// no results, call web service
						console.log("calling web service")
						app.dealList.getOffersformWebService()
					}else{
						// there are results!
			 			 console.log("resultados en DB, invocando")
			 			app.database.queryOffersInDB()
					}
				})
			})

	}else{
		//alert( "todo ok, si el usuario actualiza, le damos" )
	}
};

 
DealList.prototype.getOffersformWebService = function() {
    ///comienza la carga
	$.mobile.loading( "show" );

	var xtra = ""
	if(localStorage.getItem("dealList_activeTable") == "offersNow"){
		xtra = "&exclusiveAvailableNow=true"
	}else{
		xtra = "&exclusiveComingSoon=true";
	}
    
	// se conecta con el websrvice
	$.ajax({
			type: "GET",
			url: app.WS_URL+"deal?source=mu" + xtra,
			dataType: 'json',
			data:  { "numberOfRecords": 10}  ,
			contentType: "application/json; charset=utf-8",
			success:  function (response, status, xhr){
				console.log(xhr)

	 			           
                /// sync Database and wait for event to render list
                if(response.length > 0){
                    app.database.addItemsToDatabase(response)
                }else{
                    console.log("no info from webservice")
                }
				 
			},
			beforeSend: function ( xhr ) {
				xhr.overrideMimeType("text/plain; charset=x-user-defined");
			},
			error: function (response) {
                /** TODO DEFINE COPY */
				 alert("Can't connect to server. Please try again later")
				 
			}
		});


	// la respuesta conecta con el updateListView
};

DealList.prototype.renderList = function(_data) {
    
    console.log("i have data")
    console.log(_data)
    
    
    
    /// hace un loop sobre los items
    var updatedList = ""

    for (var i = 0; i < _data.length; i++) {
    	_data[i]
    	updatedList += this.createItem(_data[i]);
    };

     $("#dealList_main").html(updatedList)

	app.dealList.refreshListLinks()

	/// scroll refresh
	setTimeout(function () {
	           app.dealList.myScroll.refresh()
	}, 100);


	 $.mobile.loading( "hide" );

    
    
    
    
	/*
     // procesa los datos
     
     var updatedList = ""
     
     for (var i = _data.length - 1; i >= 0; i--) {
     _data[i]
     updatedList += this.createItem(_data[i]);
     };
     
     // incluye todos los items
     /**TODO debe revisar los datos que hay, borrar lo viejo y actualizar lo nuevo* /
    $("ul.mainList").html(updatedList)
    
    
	//refresca la vista
	setTimeout(function () {
               app.dealList.myScroll.refresh()
               }, 100);
    
	/// refresca los listeners
	app.dealList.refreshListLinks()
    
	/// quita el loader
	$.mobile.loading( "hide" );
    */
};

DealList.prototype.createItem = function(_itemData) {
	// crea un item y sus los eventos
	var singleItem = ""

		singleItem += '<li class="link" data-itemFullData = "'+ app.escapeText( JSON.stringify(_itemData) ) +'" >';
        singleItem += '<img src="img/placeholders/img1.png"  />'; //PreviewImage
        singleItem += '<h2>'+app.outputText(_itemData.MerchantName)+'</h2>';
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
             DealID, Description, EndsOn, MerchantName, PreviewImage
			*/
	return singleItem
};

DealList.prototype.destroyer = function() {
	// se ejecuta cuando el usuario sale de aqui para salvar RAM
};


/** FILTERS **/

DealList.prototype.showFilters = function() {
	$("#demo_dummy").trigger('focus')
};


/// events

/// add tap events for all new elements
DealList.prototype.refreshListLinks = function() {
    
	$("#dealList ul li").on('tap', function(){
                  
                  if( this.hasAttribute("data-itemFullData") ){
                  /// parse data into object
                   
                    var _info = JSON.parse( app.outputText( this.getAttribute("data-itemFullData") )  )
                  
                    /// send data to DetailsClass
                    app.details.itemData = _info;
                  
                    $.mobile.changePage("#offerDetails", { transition: "slide" });
                  }
                  
    })
};


DealList.prototype.buildFilter = function() {
	
	$('#demo').mobiscroll().treelist({
        theme: 'ios',
        display: 'bottom',
        mode: 'scroller',
        labels: ['Region', 'Country', 'City'],
        inputClass: 'i-txt'
    });    
    $('#show').click(function(){
        $('#demo').mobiscroll('show');
        return false;
    });
    $('#clearTreeList').click(function () {
        $('#demo' + '_dummy').val('');
        return false;
    }); 

    //alert("me llaman")

};
