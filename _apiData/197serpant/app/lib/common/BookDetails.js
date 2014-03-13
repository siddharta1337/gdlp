function BookDetails(_data) {

	this.mainContainer = Ti.UI.createView({
		right:0,
		top:105,
		width:447,
		height:662
	});
}

BookDetails.prototype.setData= function(_data) {
	
	this.bookData = _data;
};


BookDetails.prototype.getContainer = function() {
	
	return this.mainContainer
};


BookDetails.prototype.showDetails = function() {
	this.clearContainer();
	this.renderData();
};

BookDetails.prototype.clearContainer = function() {

	if(this.mainContainer.children.length > 1){
		this.mainContainer.removeAllChildren()
	}
};

BookDetails.prototype.renderData = function() {
	
	///define Custom Font
		var customFont = 'Oldenburg'; // use the friendly-name on iOS
		if(Ti.Platform.osname=='android') {
			// on Android, use the "base name" of the file (name without extension)
			customFont = 'Oldenburg-Regular';
		}


	// add main title
		var title1 = Ti.UI.createLabel({
			text: this.bookData.storyTitle.toString(), //"The Story of the Sea\nPart 1",
			left:30,
			top:20,
			font:{
				fontSize:24,
				fontFamily: customFont
			}
		})

		this.mainContainer.add( title1 )

	// add book text description
		var bookDescription = Ti.UI.createLabel({
			text: this.bookData.intro_en.toString(),
			left:30,
			top:112,
			font:{
				fontSize:12,
				fontFamily: customFont
			}
		})

		this.mainContainer.add( bookDescription )

	///add slideshow

	///add button

};

BookDetails.prototype.createSlideShow = function() {
	
	/// get data from array

	/// add image to container

	/// create interval
		/// display new image
		/// remove old image
};


module.exports = BookDetails;


