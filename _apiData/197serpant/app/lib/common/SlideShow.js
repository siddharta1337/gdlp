function SlideShow() {
	
	Ti.App.addEventListener('stopSlideShow',function(e){
		clearInterval(SlideShow.prototype._slideInterval)
		SlideShow.prototype._slideInterval = null
	})

	return this.createSlide();

	
}

SlideShow.prototype._slideContainer;
SlideShow.prototype._slideInterval;

SlideShow.prototype.createSlide = function() {

	this._slideContainer =  Titanium.UI.createView();

	//this._slideContainer.top=325;
	//this._slideContainer.left=849;
	this._slideContainer.width = '431dip'
	this._slideContainer.height = '426dip'

	var imageSlides = ["/bookshelf/bookshelf_imageslide_01.jpg", "/bookshelf/bookshelf_imageslide_02.jpg" , "/bookshelf/bookshelf_imageslide_03.jpg"]
	var slideViews=[]	

	for (var i = 0; i < imageSlides.length; i++) {
		
		var imageItem = Ti.UI.createImageView({image: imageSlides[i] });
			imageItem.width =  Ti.UI.FILL //431
			imageItem.height = Ti.UI.FILL //426
			imageItem.bottom = 0
			imageItem.right = 0
			imageItem.zIndex = 1
			imageItem.opacity = 0

			imageItem.id = "elemento"+ [i] 

		///store slides in array
		slideViews.push(imageItem);

	};
	
	/// start Slide
	this.slideShowStart(slideViews, this._slideContainer);

	return this._slideContainer;
};


SlideShow.prototype.slideShowStart = function(_arrayTarget, _viewTarget) {

	var val = _arrayTarget.length - 1;


	SlideShow.prototype._slideInterval = setInterval(function(e){

		if(val<0){
			val = _arrayTarget.length - 1;
			 //Ti.App.fireEvent('stopSlideShow' , {custom_data:e});

		}

		//alert("val = "+val +"  arraypos - "+ _arrayTarget[val].id )
	

			//_arrayTarget[val].zIndex = _arrayTarget[val].zIndex+1

			var animation = Titanium.UI.createAnimation({
				opacity:1,
				duration: 1000
			});

			animation._target = _arrayTarget[val];
			animation.parentView = _viewTarget;


		
			_viewTarget.add(_arrayTarget[val])

			_arrayTarget[val].animate(animation);


			val -=1;

			Ti.API.info("TOC")

			animation.addEventListener('complete',reposition);

			function reposition(e){
					 
					//e.source._target.zIndex = e.source._target.zIndex+1

					//alert(e.source.parentView.children.length) 

					if(e.source.parentView.children.length==2){
						e.source.parentView.children[0].opacity=0;
						e.source.parentView.remove(e.source.parentView.children[0]);
					}

					animation.removeEventListener('complete', reposition);
			}

		


	},3000);


};

module.exports = SlideShow;