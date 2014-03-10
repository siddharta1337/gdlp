/*
	Create a intem inside a story which display an image transition
*/


function ItemTransition(_transitionInfo) {
	
	/*
	Ti.App.addEventListener('stopSlideShow',function(e){
		clearInterval(ItemTransition.prototype._slideInterval)
		ItemTransition.prototype._slideInterval = null
	})
	å*/
	this.transitionInfo = _transitionInfo;

	return this.createClickableSlide() //this.createSlide();

	
}
ItemTransition.prototype.transitionInfo
ItemTransition.prototype.vierContainer;

ItemTransition.prototype._slideContainer;
ItemTransition.prototype._slideInterval;



ItemTransition.prototype.createClickableSlide = function() {

	var slideArray = this.parseImageArray(this.transitionInfo.images)
	slideArray[0].opacity = 1

	this._slideContainer =  Titanium.UI.createView(this.transitionInfo.properties);
	this._slideContainer.touchEnabled = true


	this._slideContainer.add(slideArray[1])
	this._slideContainer.add(slideArray[0])


	this._slideContainer.addEventListener("click", function(e){
		//alert("yo bro!")
		

		var fadeIn = Titanium.UI.createAnimation({
				opacity:1,
				duration: 6000
			});
		
		var fadeOUT = Titanium.UI.createAnimation({
				opacity:0,
				duration: 4000
		});

	
		e.source.children[0].animate(fadeIn);
		e.source.children[1].animate(fadeOUT);

		e.source.removeEventListener('click', function(){})

	})

		//alert(slideArray[0].image)

	return this._slideContainer
};



ItemTransition.prototype.createSlide = function() {

	this._slideContainer =  Titanium.UI.createView(this.transitionInfo.properties);


	//this._slideContainer.top=325;
		//this._slideContainer.left=849;
		/*
		this._slideContainer.width = this.transitionInfo.properties.width; //'431dip'
		this._slideContainer.height = this.transitionInfo.properties.height; //'426dip'
		this._slideContainer.top = this.transitionInfo.properties.top; //'426dip'
		this._slideContainer.left = this.transitionInfo.properties.top; //'426dip'

		this._slideContainer.borderColor = "#FF0000"
		this._slideContainer.borderWidth = 5
	*/
	

	var imageSlides = this.transitionInfo.images;
	//["/bookshelf/bookshelf_imageslide_01.jpg", "/bookshelf/bookshelf_imageslide_02.jpg" , "/bookshelf/bookshelf_imageslide_03.jpg"]




	var slideViews=[]	

	for (var i = 0; i < imageSlides.length; i++) {
		
		var imageItem = Ti.UI.createImageView({image: imageSlides[i] });
			imageItem.width =  Ti.UI.FILL //431
			imageItem.height = Ti.UI.FILL //426
			imageItem.bottom = 0
			imageItem.right = 0
			imageItem.zIndex = 1
			imageItem.opacity = 0
			imageItem.touchEnabled = "false"

			imageItem.id = "elemento"+ [i] 

		///store slides in array
		slideViews.push(imageItem);

	};
	
	/// start Slide
	this.slideShowStart(slideViews, this._slideContainer);
/* */

	return this._slideContainer;
};


ItemTransition.prototype.slideShowStart = function(_arrayTarget, _viewTarget) {

	var val = _arrayTarget.length - 1;


	ItemTransition.prototype._slideInterval = setInterval(function(e){

		if(val<0){
			val = _arrayTarget.length - 1;
			 //Ti.App.fireEvent('stopSlideShow' , {custom_data:e});

		}

		//alert("val = "+val +"  arraypos - "+ _arrayTarget[val].id )
	

			//_arrayTarget[val].zIndex = _arrayTarget[val].zIndex+1

			var animation = Titanium.UI.createAnimation({
				opacity:1,
				duration: 3000
			});


			var animationOUT = Titanium.UI.createAnimation({
				opacity:0,
				duration: 1500
			});

			animation._target = _arrayTarget[val];
			animation.parentView = _viewTarget;
			animationOUT.parentView = _viewTarget;


			
			
		
			_viewTarget.add(_arrayTarget[val])

			_arrayTarget[val].animate(animation);

			if(_viewTarget.children[1]){
				_viewTarget.children[0].animate(animationOUT)
			}


			val -=1;

			Ti.API.info("TOC")

			animationOUT.addEventListener('complete',reposition);

			function reposition(e){
					 
					//e.source._target.zIndex = e.source._target.zIndex+1

					//alert(e.source.parentView.children.length) 

					if(e.source.parentView.children.length>1 ){
						e.source.parentView.children[0].opacity=0;
						e.source.parentView.remove(e.source.parentView.children[0]);
					}

					animation.removeEventListener('complete', reposition);
			}

	},3200);
};


ItemTransition.prototype.parseImageArray = function(imageSlides){


	var slideViews=[];

	for (var i = 0; i < imageSlides.length; i++) {
		

		var imagePath = '/storyAssets/story1/'+ imageSlides[i];

		var imageItem = Ti.UI.createImageView({image: imagePath });
			imageItem.width =  Ti.UI.FILL //431
			imageItem.height = Ti.UI.FILL //426
			imageItem.bottom = 0
			imageItem.right = 0
			imageItem.zIndex = 1
			imageItem.opacity = 0
			imageItem.touchEnabled = false;

			imageItem.id = "elemento"+ [i] 

		///store slides in array
		slideViews.push(imageItem);
	};
	
	return slideViews;

}

module.exports = ItemTransition;


