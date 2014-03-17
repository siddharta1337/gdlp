/**
parsea el json y genera los slides

return all slides of  a story
**/
var Slide = require('/common/StorySlide');
var FileDownloader = require('/common/FileDownloader');



function StoryBuilder(_storyID){

	this.storyID = _storyID
	/// parse data
	//this._slideData = this.parseJSON('json/'+ _storyID +'.json');
	//this.buildSlides()
	

	//return this._slides;
}

StoryBuilder.prototype._slides;
StoryBuilder.prototype._slideData;

StoryBuilder.prototype.loadContent = function(_callbackThumbsLoaded,_loadingScreen) {

	this.parseJSON( this.storyID , loadedData);

	var storyID = this.storyID

	///runs when json data is available
	function loadedData(e){

		this._slideData = e;
		_loadingScreen.visible = 1;

		var thumbnailsList = []

		///extract all files needed for story
		for (var i = 0; i < this._slideData.length; i++) {


			for (var a = 0; a < this._slideData[i].stageElements.length; a++) {

				switch(this._slideData[i].stageElements[a].type ){

					case "image":
						//var lang_sufix = "" //(Titanium.Locale.currentLanguage=="en")? this.jsonData.data[i].thumb_en : this.jsonData.data[i].thumb_es;
						thumbnailsList.push ( storyID+"/" + this._slideData[i].stageElements[a].properties.image );
					break;
				}
			}
		};

		/// start
		var downloader = new FileDownloader()
		downloader.setLoaderScreen(_loadingScreen)

		var list = downloader.makeQueue( thumbnailsList , storyID);
	

		///start downloads
		downloader.downloadMultiFile(list ,function(e,o){
				_loadingScreen.children[0].width = o+"%"
			}, function(){
				_callbackThumbsLoaded();
				_loadingScreen.visible = 0;
			})
		

		/// purge elements
		downloader = null;
		thumbnailsList = null
		list = null
		lang_sufix = null
		builder = null;
	}
};

StoryBuilder.prototype.buildSlides = function() {
	/// create slide class
	this._slides = []; //Ti.UI.createView()

	for (var i = 0; i < StoryBuilder.prototype._slideData.length; i++) {

		this._slides.push( new Slide( StoryBuilder.prototype._slideData[i] , this.storyID ) )

	};
};
//handle the story JSON map
StoryBuilder.prototype.parseJSON = function(_URL, _callbackJsonData) {

	/// Create the folder for this story if not exists
	var imageDir = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory , this.storyID);
		if (! imageDir.exists()) {
		    imageDir.createDirectory();
		}

	/// download the Json File
		var downloader = new FileDownloader()
		downloader.downloadOneFile(Alloy.Globals.remoteServerRoot+this.storyID+"/"+this.storyID+".json", Titanium.Filesystem.applicationDataDirectory+this.storyID+"/"+this.storyID+".json", callBack_DownloadOneFileFinished) 

		// this is needed to break the context and make var available inside callBack_DownloadOneFileFinished()
		var _storyID = this.storyID

	/// once the file is loaded, read it and store data inside the class

		function callBack_DownloadOneFileFinished(){
			 
			var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory , _storyID+"/"+_storyID+".json");
			var data = file.read().text;
			var json = JSON.parse(data);

			StoryBuilder.prototype._slideData = json;
		 	_callbackJsonData(json)

		 	file =  null
		 	data = null
		 	json = null
		}
	
	

	//return json;
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