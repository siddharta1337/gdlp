var args = arguments[0] || {};
var currentItem = args.currentItem;

//var SlideShow = require('/common/SlideShow');
var BookMenu = require('/common/BookMenu');
var BookDetails = require('/common/BookDetails');

var _menu
var bookDetails
var _storyData

$.bookshelf_play.visible = false;
$.thumbnail.visible = false;

function init(){
	//alert(args.currentItem.id )
	_menu = new BookMenu( args.currentItem.id );

	_menu.loadThumbnails( thumbsLoaded )

	$.bookshelf.add( _menu.getTable() );

	function thumbsLoaded (){

		
			_menu.populateTable();

			

			$.bookshelf.removeEventListener('open', init)


			bookDetails = new BookDetails();
			$.bookshelf.add( bookDetails.getContainer() )

	}


}


$.bookshelf.addEventListener('open', init)

$.bookshelf.addEventListener('showBookDetails', showDetails)

$.bookshelf_play.addEventListener('click', loadStory);


/// close the window and release memory
function closeBookshelf(){

		// clear Screen

		$.bookshelf.removeEventListener('open', init)

		$.bookshelf.removeEventListener('showBookDetails', showDetails)

		$.bookshelf_play.removeEventListener('click', loadStory);

		$.bookshelf.removeAllChildren()
		

		BookMenu = null
		BookDetails = null

		_menu = null
		bookDetails = null
		_storyData = null

		delete BookMenu;
		delete BookDetails;

		delete _menu;
		delete bookDetails;
		delete _storyData;

		// send info to planetScreen
		var net = Ti.App.fireEvent('backPlanet');

		net = null
		delete net
		

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




/*
	var _slideshow;
	var	_pedals;
	 

	function init(){

		$.MainTitle.text = args.currentItem.id;
		$.descriptionText.text = "This is a placeholder for the  >" + args.currentItem.id.toUpperCase() + "< planet. There is no layout yet...use your imagination in here :)  ";

		setPlanet();
		$.aboutImage.touchEnabled = false;
		$.aboutImage.zIndex = 20
		$.bookshelf_slide.touchEnabled = false;

		

		var TO = setTimeout(function(){
			_slideshow = new SlideShow();

			$.bookshelf_slide.add(_slideshow);
		},1000)


			

		_pedals = new PedalMenu( $.MainTitle , $.descriptionText );
		
			$.pedalMenuElement.add(_pedals);



		Ti.App.addEventListener("onShowNewStory",function(e){
			$.bookshelf_play.storyID = e.storyID
			//aqui deberia activar otro slideshow
		})
	 

		$.bookshelf_play.addEventListener('click',function(e){

			if(e.source.storyID){

				var storyViewer= Alloy.createController('storyViewer', {storyID:e.source.storyID}).getView();

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

					
		})
	}


	function setPlanet(){


			//$.planetImage.animate(animationFinal);
			var planetObject = $.planetImage;
			var argsObj = args.currentItem;
			
			planetObject.backgroundImage = argsObj.backgroundImage;
			planetObject.zIndex = 10
			/*
					planetObject.bottom = -(planetObject.height/3);
					planetObject.left = -200;
					planetObject.transform = Ti.UI.create2DMatrix().rotate(49);
			* /
			if(Ti.Platform.name == "android"){
				
				planetObject.bottom = -60;
			}else{
				planetObject.top = "75%";
			}	
	}

	 

	//// add pedals dynamically


	function cerrar(){

		Ti.App.fireEvent('backPlanet');

		_slideshow = null;

		$.bookshelf.close();
	}
*/

//init(); 