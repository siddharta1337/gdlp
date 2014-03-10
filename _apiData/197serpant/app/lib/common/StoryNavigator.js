/// handle wich slide be shown on screen
function StoryNavigator(_storySlides){

	this.storyView = Ti.UI.createView()


	if(_storySlides.length<=0){
		this.errorManager("empty slide array");

	}else{
		
		this.storySlides = _storySlides
		//this.init()
	}

	//return this.storyView;
}


StoryNavigator.prototype.storySlides;
StoryNavigator.prototype.storyView;
//StoryNavigator.prototype.currentSlide;
StoryNavigator.prototype.contentCount;



StoryNavigator.prototype.init = function() {
	// place the first slide
	//this.storyView.add(this.storySlides[0])

	this.loadSlide(0)


	this.contentCount = 0
	

	return this.storyView
};


StoryNavigator.prototype.next = function() {

	if((this.contentCount + 1) < this.storySlides.length){
		
		this.contentCount++

		//alert(this.contentCount)
		this.loadSlide(this.contentCount)
	}	
};


StoryNavigator.prototype.back = function() {
	
	//alert("click y conteo normal preIF" + this.contentCount)

	if((this.contentCount -1) >= 0){

		this.contentCount--

		//alert(" este es el conteo real"+this.contentCount)
		this.loadSlide(this.contentCount)

		
	}
};


StoryNavigator.prototype.loadSlide = function(_slideID) {
	
	var currentSlide =  this.storySlides[_slideID].getSlide()
	
	currentSlide.backgroundColor = "#ffffff";
	currentSlide.parentView = this.storyView;
	currentSlide.opacity = 0

	this.storyView.add(currentSlide)
	
	// check if this slide already appeared
	if(Ti.Platform.name == "iPhone OS"){
	
		currentSlide.fireEvent('story_slideImage_loaded')
	
	}else if(Ti.Platform.name == "android"){
	
		if ( currentSlide.onStage  ){
			currentSlide.fireEvent('story_slideImage_loaded')
		}
	
	}

	
};

StoryNavigator.prototype.clean = function() {
	this.storyView.removeAllChildren()
	this.storyView = null
};

StoryNavigator.prototype.errorManager = function(_message) {

	alert(_message)
};


module.exports = StoryNavigator;


