// JavaScript Document

function Search(){
    this.init()
     

    var container = $('#wrapper_search');
    this.myScroll = new iScroll('wrapper_search', { 
        onScrollEnd: function () {
            container.trigger('scroll');
        }
    });


}
Search.prototype.searchQuery;
Search.prototype.uix

Search.prototype.init = function(){
    
    $("#search").on( "pagebeforeshow", function() {
        $(".autocomplete-suggestions").first().addClass("searchPage")    
    })
    
    $("#search").on('pagehide', function(event, ui){

        // clean results only if user start over
        if(ui.nextPage[0].id == "navigation"){

            $(".autocomplete-suggestions").first().removeClass("searchPage")
            app.search.searchQuery = ""
            $("#search_resultList li").off('tap')
            $("#search_main_input").val("")
            $("#search_resultList").html("")
        }     
    })
    
    
    /// si hay busquedas las ejecuta al iniciar
    $("#search").on("pageshow", function(){
        $("#search_main_input").val(app.search.searchQuery)

        if( app.search.searchQuery != ""){
            app.search.queryFind()
        }
        app.search.refreshScroll()
    })

    $("#search_finderButton").on("tap",function(){
        var input = $("#search_main_input")
        input.trigger('blur')
        app.search.searchQuery = input.val()
        app.search.queryFind()
    })
    
    
    
    /// inicializa la autobusqueda
    //var options, a;
    jQuery(function(){
           var filterItems = JSON.parse(localStorage.getItem("filterList"));
           options = { lookup: filterItems  ,minChars:1};
           a = $('#search_main_input').autocomplete(options);
           //options = { serviceUrl: app.WS_URL + "deal" };
           //a = $('#search_main_input').autocomplete(options);
    });
}

Search.prototype.queryFind = function(){

    $.mobile.loading( "show" );

    /// prevent details broke
    $("#offerDetails .ui-content").css("padding",'0')
    
    // se conecta con el websrvice
  	$.ajax({
             type: "GET",
             url: app.WS_URL+"deal?source=mu&searchString=" +app.search.searchQuery,
             dataType: 'json',
             data:  { "numberOfRecords": 17}  ,
             contentType: "application/json; charset=utf-8",
             success:  function (response, status, xhr){
             
             
                 /// sync Database and wait for event to render list
                 if(response.length > 0){
                      app.search.renderList(response)
                 }else{
                      //alert("No data available, please try again later")
                      //$.mobile.loading( "hide" );
                      app.search.showError()
                      
                 }
             
             
             
             },
             beforeSend: function ( xhr ) {
             xhr.overrideMimeType("text/plain; charset=x-user-defined");
             },
             error: function (response) {
             /** TODO DEFINE COPY */
                  //alert("Can't connect to server. Please try again later")
                  app.search.showError()

             }
             });    
}


Search.prototype.getStringFromAutoComplete = function(_data){
    
    app.search.searchQuery = _data.value
    this.queryFind()
}

Search.prototype.renderList = function(_data) {
    
    
    /// hace un loop sobre los items
    var updatedList = ""
    
    for (var i = 0; i < _data.length; i++) {
    	_data[i]
        console.log(_data[i])
    	updatedList += this.createItem(_data[i]);
    };
    
    $("#search_resultList").html(updatedList)

    //clear tap event
    $("#dealList ul li").off('tap')


    $("img.lazy2").show().lazyload({ 
         threshold : 500 ,
        container: $("#wrapper_search")
    });

    
    this.refreshListLinks()
    
     
    /// scroll refresh
    app.search.refreshScroll()
    

    $.mobile.loading( "hide" );

};

Search.prototype.createItem = function(_itemData) {
  	// crea un item y sus los eventos
  	var singleItem = ""
    
    singleItem += '<li class="link" data-itemFullData = "'+ app.escapeText( JSON.stringify(_itemData) ) +'" >';
    //singleItem += '<img src="img/placeholders/img1.png" width="183" height="240" />'; //PreviewImage
    singleItem += '<img class="lazy2" src="img/placeholders/img1.png"  data-original="'+ app.IMG_URL + _itemData.PreviewImage +'"  width="183" height="240" />';
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

Search.prototype.refreshListLinks = function (){
    
    //alert("refresca")
    $("#search_resultList li").on('tap', function(){
             
      if( this.hasAttribute("data-itemFullData") ){
         /// parse data into object

         var _info = JSON.parse( app.outputText( this.getAttribute("data-itemFullData") )  )

         /// send data to DetailsClass
         app.details.itemData = _info;

         $.mobile.changePage("#offerDetails", { transition: "slide" });
      }                           
    })
}

Search.prototype.refreshScroll = function() {
    setTimeout(function () {
        app.search.myScroll.refresh()
        app.search.myScroll.scrollTo(0, 0, 0)
    }, 100);
};

Search.prototype.showError = function() {
    $("#search_resultList").html('<li class="errorHeader"> No Deals Found </li>')
    $.mobile.loading( "hide" );
};

