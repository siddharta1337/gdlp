function  NavigationScreen(){

}

NavigationScreen.prototype.init = function() {

	$("#navigation").on( "pagebeforeshow", function() {
		// TODO: display a dynamic coun
		//alert("display count")
	})

	//$("#navigation").on("pagecreate", function(){

		//$.getJSON( app.WS_URL + "deal?source=mu", request, function( data, status, xhr ) {
	    var options, a;
		jQuery(function(){
		   options = { serviceUrl: app.WS_URL + "deal" };
		   a = $('#navigation_input').autocomplete(options);
		});  
		 

	//})
};