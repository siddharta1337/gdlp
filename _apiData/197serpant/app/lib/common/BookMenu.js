function BookMenu(_planetID){
	
	//this.screenTitle = _titleTarget;
	//this.screenText = _textTarget;

	this.menuContainer = Ti.UI.createScrollView({
		top:13,
		left: 100,
		width:450,
		height: 755,
		contentWidth: 450,
		contentHeight: 'auto',
		showVerticalScrollIndicator: false,
		showHorizontalScrollIndicator: false,
	});

	this.parseJsonDoc(_planetID);

	this.menuContainer.addEventListener('selectedBook', this.selectedBookHandler);
}

var FileDownloader = require('/common/FileDownloader');

BookMenu.prototype.menuContainer

/// inner methods

	BookMenu.prototype.loadThumbnails = function(_callbackThumbsLoaded,_loadingScreen) {
		
		_loadingScreen.visible = 1;

		var thumbnailsList = []

		for (var i = 0; i < this.jsonData.data.length; i++) {

			/// select the thumbnail according to the language
			var lang_sufix = (Titanium.Locale.currentLanguage=="en")? this.jsonData.data[i].thumb_en : this.jsonData.data[i].thumb_es;
			
			thumbnailsList.push ( "bookshelfData/" + lang_sufix )

		};


		var downloader = new FileDownloader()
			downloader.setLoaderScreen(_loadingScreen)

		var list = downloader.makeQueue( thumbnailsList , "bookshelfData");

			
			downloader.downloadMultiFile(list ,function(e,o){
				_loadingScreen.children[0].width = o+"%"
			}, function(){
				_callbackThumbsLoaded();
				_loadingScreen.visible = 0;
			})
		
		downloader = null;
		thumbnailsList = null
		list = null
		lang_sufix = null
		
	};


	/**

		return the menu container
	**/
	BookMenu.prototype.getTable = function() {

		return this.menuContainer;
	};


	/**
		Check the menu map file for this planet exists
		if is available return menu data
		otherwise return false
	**/
	BookMenu.prototype.parseJsonDoc = function(_ID) {

		// retrieve and read the file
			var _URL = "bookshelfData/" + _ID + "_menu.json";
			var file = Titanium.Filesystem.getFile( Titanium.Filesystem.applicationDataDirectory , _URL);
			var data = file.read()

		/// parse data if available

			if(data.text==""){
				Ti.API.info("error reading JSON file for menu");
				this.jsonData = false;
			}else{
				this.jsonData = JSON.parse(data.text);
			}

		/// now that have data from file, render the menu			
	};


	/**

		populate the menu using data from json file
	**/
	BookMenu.prototype.populateTable = function() {

		var tableData = [];
		var topPos = 0;
		var rowCount


		for (var i = 0; i < this.jsonData.data.length; i++) {

			var row = Ti.UI.createImageView({
				width:225,
				height:297,
				top: topPos,
				image: Titanium.Filesystem.applicationDataDirectory + "bookshelfData/" + this.jsonData.data[i].thumb_en 
			});

			/// set rows position
				if ((i%2) == 0 ){
					row.left = 0
				}else{
					row.left = 226
					topPos = topPos + 298;
				}

			row.bookData = this.jsonData.data[i]
			/// attach Events

			row.addEventListener('click', function(e){

				/// send item data to parent
				
				var evtData = {
					bookData:e.source.bookData
				}
				
				var evento = e.source.getParent().fireEvent("selectedBook", evtData);



			})

			this.menuContainer.add(row);

		};
	};

	/**
		event handler
		Send Book data to bookshelf screen when icon is clicked 
	**/
	BookMenu.prototype.selectedBookHandler = function(e) {

		/// looks like a repeated function, but it is used to improve performance DO NOT REMOVE IT!
		var evtData = {
			bookData:e.bookData
		}
		
		e.source.getParent().fireEvent("showBookDetails",evtData);
	};

	/**
	*/
	BookMenu.prototype.getPreloader = function(first_argument) {
		
	};


	/**

		remove remainig traces of the app
	**/
	BookMenu.prototype.clear = function() {
		
		//this.removeEventListener('jsonReady', this.populateTable );
		this.menuContainer.removeEventListener('selectedBook', this.selectedBookHandler);

		this.menuContainer.removeAllChildren()

		this.menuContainer = null
		delete 	BookMenu.prototype.menuContainer
	};


module.exports = BookMenu;