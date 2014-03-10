/*
function doClick(e) {
    alert($.label.text);
}
*/


var player;
var _flagPlanetIsMoving = false;
var controlActivePlanet;



/// play sound on load
function playLoopAudio(){
	
	player = Ti.Media.createSound({url:"/audio/loopTest.mp3", looping:true});
	player.looping = true; 
	player.play();	
}

function stopLoopAudio(){

	player.stop();
	
}


// handle tap events on planets
function onSelectPlanet(e){
	
	

	if(!_flagPlanetIsMoving){
			
			
			
			/// this only runs when the planet is active
			if( e.source.activePlanet == true){
				//showPlanets(e); 
				openBookshelf(e.source);
				//e.source.activePlanet = false;
			}else{
				
				hidePlanets(e);	
			}
			
			_flagPlanetIsMoving = true;
			
			

			/// rise flag, planet is moving *see PositionMainPlanet()
			
	}
}

/// manage the planets animation onscreen
function hidePlanets(e){

	
	var selectedElement = e.source.id.toString();
	
	if(controlActivePlanet){
		controlPlanetID = controlActivePlanet.id.toString();
	} else{
		controlPlanetID  = "none";
	}
	
	if(controlPlanetID  != selectedElement  ){
		
		
			positionMainPlanet(e.source);	
			/// now move other planets off the screen
			

			if ($.index.children) {
		
				// loop across screen elements 
				for (var c = 0; c < $.index.children.length ; c++) {
		
					// object cache
					var currentItem = $.index.children[c];
		
					//retrieve info from object
					var itemID = currentItem.id.toString();
		
					/// check is not the active planet     
					if( itemID != selectedElement  ){
						positionSecondaryPlanet(currentItem);  		 
					}
		
				}
		
			}
		
	}
}

/// handle the 3 secondary planets position
function positionSecondaryPlanet(_target){

	var currentItem = _target;

	///remove seleced on this planet
	_target.activePlanet = false;

	//retrieve info from object
		var itemID = currentItem.id.toString();
		 
	// define transform matrix for short planets
	var matrix = Ti.UI.create2DMatrix();
		matrix = matrix.rotate(currentItem.preferedRotationBase);
		matrix = matrix.scale(1,1);
	

	//Ti.API.info(currentItem.preferedRightPosition)

	var planetAnimation = Ti.UI.createAnimation({
		transform:matrix,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
		duration:600
	});
	
	
	/// set planet on it's default position
	if(_target.preferedTopPosition){
		planetAnimation.top = _target.preferedTopPosition.toString();
	}

	if(_target.preferedLeftPosition){
		planetAnimation.left = _target.preferedLeftPosition.toString();
	}
	
	if(_target.preferedBottomPosition){
		planetAnimation.bottom = _target.preferedBottomPosition;
	}
	
	if(_target.preferedRightPosition){
		planetAnimation.right = _target.preferedRightPosition.toString();
	}
	
	
	

	currentItem.animate(planetAnimation);
}

/// handle the main planet position
function positionMainPlanet(_target){

	controlActivePlanet = _target;

	var matrix = Ti.UI.create2DMatrix();
		matrix = matrix.rotate(0);
		matrix = matrix.scale(2, 2);


	var animation = Titanium.UI.createAnimation({
		top:'30%',
		left:'40%',
		transform:matrix,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
		duration: 1000
	});

	
	_target.animate(animation);

	
	animation.addEventListener('complete',animationHandler);
	
	function animationHandler() {
		
		var wait = setTimeout(function(){
			
			_flagPlanetIsMoving = false;
			_target.activePlanet = true;
			
			
		}, 200);
			
	};
}

/// align all planets to the orignal position settings (based on current screen size)
function alignPlanets(){


	/// place the planets
	$.north.top 	= -($.north.height / 3)  ;
	$.south.bottom 	= -($.south.height / 3) ;
	$.east.left 	= -($.east.width / 3)  ;
	$.west.right 	= -($.west.width / 3) ;



	/// store position values
	$.north.preferedTopPosition 	= -($.north.height / 3) *2;
	$.east.preferedLeftPosition 	= -($.east.width / 3) *2;
	
	  
	
	
	
	
	
	
	
	
	/// due conflicts with screen measures
	//// Open the next page
				if(Ti.Platform.name == 'android'){
					$.south.preferedBottomPosition 	= -($.south.height / 3) *2;
					$.west.preferedRightPosition 	= -($.west.width / 3) *2;
				
				}else if(Ti.Platform.name == 'iPhone OS'){
					
					$.south.preferedTopPosition 	= (Titanium.Platform.displayCaps.platformHeight - ( ( $.south.height / 3) *1) ) ;
					
					$.west.preferedLeftPosition 	= (Titanium.Platform.displayCaps.platformWidth - ( ( $.south.width / 3) *1) ) ;
					
				}
	
}



/// open the next screen
function  openBookshelf(_target){

	
 	/// stop all animations

 	// stop sound

 	// close this view?

 	/// clean memory

	
 	// reset elements
 	currentID = _target.id.toString();
 	var seleccionado  = _target;



	
		//// transition to next page

		//// hide other planets
		cleanUp("hide");

	
		/// zoom current planet
		var xPosition = Titanium.Platform.displayCaps.platformWidth - 100;
		var matrix = Ti.UI.create2DMatrix();
			matrix = matrix.rotate(49);
			matrix = matrix.scale(2.3, 2.3);

	

		var animationFinal = Titanium.UI.createAnimation({
			left: -50, 
			transform: Alloy.Globals.rotateInterno,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
			duration: 500
		});
		
		if(Ti.Platform.name == "android"){
			
			animationFinal.bottom = -60;
		}else{
			animationFinal.top = "75%";
		}

		
		
		//// wait for other planets are hidden (TODO attach this to a listener)
		var planetDelayedAnimation = setTimeout( function(){
			_target.animate(animationFinal);
			animationFinal.addEventListener('complete',animationHandlerOpenBookshelf);	
		}, 400);
		
		

		

		
		
		
		
		
		
		function animationHandlerOpenBookshelf() {
				//_flagPlanetIsMoving = false;
				//positionMainPlanet(_target)
				
				var bookshelfx = Alloy.createController('bookshelf', {currentItem: _target, prev:$.index}).getView();
				
				
				//// Open the next page
				if(Ti.Platform.name == 'android'){
					
					bookshelfx.open({
						fullscreen:true,
						navBarHidden : true,
						modal: true,
						activityEnterAnimation: Ti.Android.R.anim.fade_in,
    					activityExitAnimation: Ti.Android.R.anim.fade_out
					});
				
				}else if(Ti.Platform.name == 'iPhone OS')
				{
						
						bookshelfx.open({
							fullscreen:true,
							navBarHidden : true
						});
					
					}
				
				stopLoopAudio()
				///listen when the window us back
				 
				$.index.addEventListener('focus', function(e){
					
					/// this should not be necesary, but android is special
					if(!_flagPlanetIsMoving) {
						$.index.removeEventListener('focus', function(){});
						cleanUp("show");
						
						///after proces are done, enable this view
						_flagPlanetIsMoving = true;
					}
					
					
					
				});
				 
				
				
				
		};
		


	/// once finalized close all



 }


/// clean the mess
function cleanUp(_action){

	var clipsVisible = (_action=="show")? 1:0;
	 
	var animation = Titanium.UI.createAnimation({
						opacity: clipsVisible,
						curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
						duration: 400
					});
	// hide/show other planets
	if ($.index.children) {

		// loop across screen elements 
		for (var c = 0; c < $.index.children.length ; c++) {

			// object cache
			var currentItem = $.index.children[c];

				//currentItem.activePlanet = false;
				 
				if(currentItem.activePlanet != true){

					
					currentItem.animate(animation);

				}
				 

		}

	}

	//send main planets
	if(_action == "show"){

		positionMainPlanet(controlActivePlanet);

	}
}


alignPlanets();


//// OPEN THE VIEW
$.index.open({
	fullscreen:true,
	navBarHidden : true,
	exitOnClose : false
});

 

Ti.App.addEventListener('backPlanet',function(e){
	cleanUp("show");
	playLoopAudio()
	///after proces are done, enable this view
	_flagPlanetIsMoving = true;
})

 