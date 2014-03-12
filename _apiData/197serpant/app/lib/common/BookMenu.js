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

BookMenu.prototype.menuContainer

/// inner methods

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
			var _URL =  Alloy.Globals.storyFolderRoot + "bookshelfData/" + _ID + "_menu.json";
			var file = Titanium.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, _URL);
			var data = file.read()

		/// parse data if available

			if(data.text==""){
				Ti.API.info("error reading JSON file for menu");
				this.jsonData = false;
			}else{
				this.jsonData = JSON.parse(data.text);
			}

		/// now that have data from file, render the menu

			this.populateTable();
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
				image: Alloy.Globals.storyFolderRoot + "bookshelfData/thumbnails/" + this.jsonData.data[i].thumb_en 
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
				
				e.source.getParent().fireEvent("selectedBook", evtData);


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

		remove remainig traces of the app
	**/
	BookMenu.prototype.clear = function() {
		
		this.removeEventListener('jsonReady', this.populateTable );
		this.menuContainer.removeEventListener('selectedBook', this.selectedBookHandler);
	};


module.exports = BookMenu;