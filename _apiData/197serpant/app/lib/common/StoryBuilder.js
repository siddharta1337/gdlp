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

	function loadedData(e){

		this._slideData = e;
		_loadingScreen.visible = 1;

		var thumbnailsList = []

		
	}
		


/*
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
		*/
		_callbackThumbsLoaded()
};

StoryBuilder.prototype.buildSlides = function() {
	/// create slide class
	this._slides = []; //Ti.UI.createView()

	for (var i = 0; i < this._slideData.length; i++) {

		this._slides.push( new Slide( this._slideData[i] ) )

	};
};

StoryBuilder.prototype.parseJSON = function(_URL, _callbackJsonData) {

	var imageDir = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory , this.storyID);
		if (! imageDir.exists()) {
		    imageDir.createDirectory();
		}

	var downloader = new FileDownloader()
		downloader.downloadOneFile(Alloy.Globals.remoteServerRoot+"20140311_1.json", Titanium.Filesystem.applicationDataDirectory+"/20140311_1.json", callBack_DownloadOneFileFinished) 


		function callBack_DownloadOneFileFinished(){


			var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "20140311_1/20140311_1.json");
			var data = file.read()//.text;
			var json = JSON.parse(data.text);

		 	_callbackJsonData(json)
		 	alert(data)
		 	alert('nepe')
		 	alert(json)

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