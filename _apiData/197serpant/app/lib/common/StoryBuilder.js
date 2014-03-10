/**
parsea el json y genera los slides

return all slides of  a story
**/
var Slide = require('/common/StorySlide');



function StoryBuilder(_storyID){

	/// parse data
	var _data = this.parseJSON('json/story'+ _storyID +'.json');
	
	/// create slide class
	this._slides = []; //Ti.UI.createView()

	for (var i = 0; i < _data.length; i++) {

		this._slides.push( new Slide( _data[i] ) )

	};

	//return this._slides;
}

StoryBuilder.prototype._slides;

StoryBuilder.prototype.parseJSON = function(_URL) {
	
	var file = Titanium.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, _URL);
	var data = file.read()//.text;
	var json = JSON.parse(data.text);

 

	return json;
};

StoryBuilder.prototype.getSlides = function() {
	return this._slides;
};

StoryBuilder.prototype.clean = function() {
	
	for (var i = 0; i < this._slides.length; i++) {

		this._slides[i].clean()

	};
};

StoryBuilder.prototype.stopSpeech = function() {

	for (var i = 0; i < this._slides.length; i++) {

		this._slides[i].stopSpeech()

	};
}


////parser


// looper


/// tools
	
	/// create animations
	/// play sound
	/// generate sequence
	/// 

module.exports = StoryBuilder;