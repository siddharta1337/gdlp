function  NavigationScreen(){

	this.filterItems = new FilterItems()

	//this.interVal 
	
}

NavigationScreen.prototype.filterItems

NavigationScreen.prototype.init = function() {

	$("#navigation").on( "pagebeforeshow", function() {
		// TODO: display a dynamic coun
		//alert("display count")

        ///res
        $('#navigation_input').val("")
        app.navigationScreen.filterItems.checkUpdate()
        app.navigationScreen.renderfavCount()

        ///block navigation
        app.navigation._flag = "disabled"
    
	})
    
    $("#navigation").on( "pageshow", function() {

    	 
    	app.navigationScreen.interVal = setTimeout(function () {
			 app.navigationScreen.displaySelectedWS()
		}, 3000);
		 
		console.log("invoca")

		app.navigation._flag = "enabled"
    	
    })

    $("#navigation").on( "pagebeforehide", function() {
    	window.clearTimeout(app.navigationScreen.interVal)
    	console.log("mata")
    })
    
    $("#finderButton").on("click", function(e){
        //alert("------")
        var input = $("#navigation_input")
        
        
        $(".autocomplete-suggestions").css("display","none")

        app.search.searchQuery = input.val()
        input.trigger('blur')

        setTimeout(function () {
	           $.mobile.changePage("#search", { transition: "slide" });
		}, 100);
         
    })

    //// navigator handler 
	    $("#navigation_input").on('focus', function(){
	    	 $("#navigation").on('tap', function(e){
	    	 	console.log(e)
	    	 })
	    		
	    })

	    $("#navigation_input").on('blur', function(){
	    	 $("#navigation").off('tap')	
	    })



    app.navigationScreen.renderfavCount()
	//$("#navigation").on("pagecreate", function(){

		//$.getJSON( app.WS_URL + "deal?source=mu", request, function( data, status, xhr ) {
	    var options, a;
		jQuery(function(){
		   //options = { serviceUrl: app.WS_URL + "deal" ,minChars:2};
		   var filterItems = JSON.parse(localStorage.getItem("filterList"));
		   options = { lookup: filterItems  ,minChars:1};
		   a = $('#navigation_input').autocomplete(options);
		});  
		 

	//})
};

NavigationScreen.prototype.renderfavCount = function() {
	
	var conteo =  localStorage.getItem("numberOfSelectedDeals")

	if( conteo  != null && conteo > 0){
		$("#navigation_selected_count").html("(" + conteo +")")
	}
	
};

NavigationScreen.prototype.displaySelectedWS = function(){

	$.ajax({
		type: "GET",
		url:  app.WS_URL_secure + "clip?count=true",
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		success:  function (response, status){

				if(response.numberOfSelectedDeals != null){

 
 					$("#navigation_selected_count").html("(" + response.numberOfSelectedDeals +")")
 					localStorage.setItem("numberOfSelectedDeals", response.numberOfSelectedDeals)
					 
 					console.log("muestra")
				}

		},
		beforeSend: function (xhr) {                              
			xhr.setRequestHeader('Authorization',  'Bearer ' + localStorage.getItem("accessToken"));
		},
		error: function (response) {
			console.log("error retrieving Deals Number ")//response)
		}
	});
}

