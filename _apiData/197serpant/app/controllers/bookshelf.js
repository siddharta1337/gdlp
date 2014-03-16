
//var SlideShow = require('/common/SlideShow');
var BookMenu = require('/common/BookMenu');
var BookDetails = require('/common/BookDetails');

// setup vars
	var args = arguments[0] || {};
	var currentItem = args.currentItem;
	var _menu
	var bookDetails
	var _storyData

$.bookshelf.addEventListener('open', init)
$.bookshelf.addEventListener('showBookDetails', showDetails)
$.bookshelf_play.addEventListener('click', loadStory);

// start the slide
function init(){
	//alert( "init book" )
	_menu = new BookMenu( args.currentItem.id );

	

	_menu.loadThumbnails( thumbsLoaded , $.loading )

	$.bookshelf.add( _menu.getTable() );

	function thumbsLoaded (){

		
			_menu.populateTable();

			$.bookshelf.removeEventListener('open', init)


			bookDetails = new BookDetails();
			
			//$.bookshelf.remove(loader)

			$.bookshelf.add( bookDetails.getContainer() )
	}
}

/// close the window and release memory
function closeBookshelf(){

		// clear Screen

		$.bookshelf.removeEventListener('open', init)
		$.bookshelf.removeEventListener('showBookDetails', showDetails)
		$.bookshelf_play.removeEventListener('click', loadStory);

		$.bookshelf.removeAllChildren()

		_menu.clear()
		_menu = null
		bookDetails = null
		_storyData = null

		BookMenu = null
		BookDetails = null

		delete BookMenu;
		delete BookDetails;

		delete _menu;
		delete bookDetails;
		delete _storyData;

		// send info to planetScreen
		var net = Ti.App.fireEvent('backPlanet');
		net = null


		/// close this window
		$.bookshelf.close();
}

/// show book details
function showDetails(e){
	//alert(e.bookData)
	//var bookDetails = new BookDetails(e.bookData);
	$.bookshelf_play.visible = true;
	$.thumbnail.visible = true;

	bookDetails.setData(e.bookData)

	_storyData = e.bookData.storyID;
	
	bookDetails.showDetails()
}

function loadStory(e){

	if(_storyData){
		//alert(_storyData)
		var storyViewer= Alloy.createController('storyViewer', {storyID:_storyData}).getView();

		if(Ti.Platform.name == "android"){
			storyViewer.open({
				fullscreen:true,
				navBarHidden : true,
			});
		}else{

			storyViewer.open({
				fullscreen:true,
				navBarHidden : true,
				exitOnClose:true
			});
		}
	}	
}

/// play sound on load
function playLoopAudio(){
	//alert("FIX - BOOKSHELF:98")
	player = Ti.Media.createSound({url:"/audio/storyOfTheSea.mp3", looping:true});
	player.looping = true; 
	player.play();	
}

/// play background audio
function stopLoopAudio(){
	Ti.App.fireEvent('stopSlideShow');
	player.stop();
	player = null;
}

/// show subscribe 
function suscribe(){

	var animation = Titanium.UI.createAnimation({ opacity:1, duration: 600 });

	$.aboutImage.touchEnabled = true;
	$.aboutImage.zIndex = 100
	$.aboutImage.animate(animation);
	$.aboutImage.addEventListener('click', function(){
		var animationx = Titanium.UI.createAnimation({ opacity:0, duration: 600 });
		$.aboutImage.animate(animationx );
		$.aboutImage.touchEnabled = false;
	})
}
