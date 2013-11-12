// JavaScript Document
function Navigation(){
    this.linker()
    this.flag = "enabled"


    // attach the flag to pages to prevent double taps
    $('div').on('pageshow', function(){ app.navigation._flag = "enabled" })

}

Navigation.prototype._flag

Navigation.prototype.go = function(_pageID) {
 
	$.mobile.changePage("#"+_pageID, {
                        transition: "slide"
                        });
};


// create links avoiding click event
Navigation.prototype.linker = function(){

	$( ".link" ).on( 'tap', function(){
		if(app.navigation._flag == "enabled"){
			app.navigation._flag = "disabled"
			_pageID = this.getAttribute("data-link");
			$.mobile.changePage("#"+_pageID, { transition: "slide" });
		}
	});
}