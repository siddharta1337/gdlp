function PedalMenu(_titleTarget , _textTarget){

	this.screenTitle = _titleTarget;
	this.screenText = _textTarget;


	////add the main container

	var cirContainer = Ti.UI.createImageView({
		image:"/bookshelf/bookshelf_pedalMenu_container.png",
		left:0,
		bottom:0,
		width:512,
		height:517,
		touchEnabled:false,
		zIndex:1
	})

	var petaloContainer = Ti.UI.createView({width:700, height:700, bottom:0, left:0})
		petaloContainer.add(cirContainer);

	this.pedalContainerView = petaloContainer;

	this.createPedals();

	
	return this.pedalContainerView ; //this.createPedals();
}

PedalMenu.prototype.screenTitle;
PedalMenu.prototype.screenText;

PedalMenu.prototype.createPedals = function (){

	var petalos = this.parseJSON('json/pedals.json');

	
	// add pedals to the container
	for (var i = 0; i < petalos.length; i++) {

		/*
			var imagenPetaloBase
			var imagenW
			var imagenH 


			if (petalos[i].imageActive){
			
				imagenPetaloBase  = petalos[i].imagenActiva;
				imagenW = 224
				imagenH = 257

			}else{

				imagenPetaloBase =  "/bookshelf/bookshelf_pedalMenu_pedal_normal.png";
				imagenW = 144;
				imagenH = 160;
				
			}
		*/
	
		var petalo = this.createPedalItem(petalos[i] , this.pedalContainerView);


		this.pedalContainerView.add(petalo);

	};
	
	this.pedalContainerView.addEventListener('resetHighLight', function(e){
		

		for (var i = 0; i < e.source.children.length; i++) {

			//alert(e.source.children[i].children.length )
			
			if(e.source.children[i].children[1]){
				 e.source.children[i].children[1].opacity = 0
			}
			
		};
	})
	
}

PedalMenu.prototype.createPedalItem = function(_pedalInfo, _targetParent) {
	
	/*
		var petalo = Ti.UI.createImageView({image:imagenPetaloBase});
	

			var matrix = Ti.UI.create2DMatrix();
				matrix = matrix.rotate(petalos[i].rotacion); //340


			petalo.width = imagenW;
			petalo.height = imagenH ;
			petalo.left = petalos[i].left;
			petalo.bottom = petalos[i].bottom;
			petalo.transform = matrix;
			petalo.s_titulo = this.screenTitle;
			petalo.s_text = this.screenText;
			petalo.d_titulo = petalos[i].titleA
	  

			petalo.addEventListener('click', function(e){
				//Ti.App.fireEvent('clickPetalo', {evento:e});

				e.source.s_titulo.text = e.source.d_titulo;
				e.source.s_text.text = "THIS IS A PLACEHOLDER Lorem ipsum dolor sit amet, consectetur " 
				

			});
	*/

	//The visible Pedal
	var petalo = Ti.UI.createImageView({
		image:"/bookshelf/bookshelf_pedalMenu_pedal_normal.png",
		width:144,
		height:160,
		touchEnabled:false
	});

	/// the active (invisible) pedal
	var petaloActive = Ti.UI.createImageView({
		image:"/bookshelf/bookshelf_pedal_active.png",
		width:144,
		height:160,
		touchEnabled:false,
		opacity:0
	});

	var matrix = Ti.UI.create2DMatrix();
		matrix = matrix.rotate(_pedalInfo.rotacion); //340

	var pedalItem = Ti.UI.createView({
			width:144,
			height:160,
			transform:matrix,
			left: _pedalInfo.left,
			bottom: _pedalInfo.bottom,
			d_titulo: _pedalInfo.titleA,
			storyID: _pedalInfo.storyID,
	})


	pedalItem.s_titulo = this.screenTitle;
	pedalItem.s_text = this.screenText;
	pedalItem.active = petaloActive;
	pedalItem._parent = _targetParent

	pedalItem.add(petalo);
	pedalItem.add(petaloActive);

	/*
	pedalItem.addEventListener('resetHighLight', function(e){
		alert("si lee" + e.source.active.opacity)
		//e.source.active.opacity = 0
	})
	*/


	pedalItem.addEventListener('click', function(e){

		e.source._parent.fireEvent("resetHighLight")
		
		//alert( e.source.s_titulo.text )
		//e.source.s_titulo.text = e.source.d_titulo;
		e.source.s_titulo.text = e.source.d_titulo;

		//e.source.s_text.text = "THIS IS A PLACEHOLDER Lorem ipsum dolor sit amet, consectetur "

		/// this should fire on double ckick
		Ti.App.fireEvent("onShowNewStory", {"storyID": e.source.storyID})

		var animation = Titanium.UI.createAnimation({
				opacity:1,
				duration: 500
			});

		//animation._target = _arrayTarget[val];

		var TO = setTimeout(function(){
			e.source.active.animate( animation );
		}, 100)
		
		
	});

	return pedalItem;

};

PedalMenu.prototype.mostrarTexto = function (){	
}

PedalMenu.prototype.rotatePedals = function(){

		 
	// define transform matrix for short planets
	var matrix = Ti.UI.create2DMatrix();
		matrix = matrix.rotate(180);
 
	

	//Ti.API.info(currentItem.preferedRightPosition)
	
	var centre = {x:0,y:1};
	

	this.pedalContainerView.anchorPoint = centre;		

	
	/*
	this.pedalContainerView.borderWidth=5;
	this.pedalContainerView.borderColor="#00ff00";
	*/

	var planetAnimation = Ti.UI.createAnimation({
		transform:matrix,
		repeat:100,
		anchorPoint : centre ,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
		autoreverse:true,
		duration:1000
	});
 
 	//this.pedalContainerView.animate(planetAnimation)
};


PedalMenu.prototype.parseJSON = function(_URL) {


	var file = Titanium.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, _URL);
	var data = file.read()//.text;
	var json = JSON.parse(data.text);


	return json;
};

module.exports = PedalMenu;