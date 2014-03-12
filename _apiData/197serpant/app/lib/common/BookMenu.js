function BookMenu(_planetID){
	
	//this.screenTitle = _titleTarget;
	//this.screenText = _textTarget;

	this.menuTable = Ti.UI.createScrollView({
	  width:550,
	  top:0,
	  left: 50,
	  height: 600
	});

	this.parseJsonDoc(_planetID);

	this.menuTable.addEventListener('selectedBook', this.selectedBookHandler);
}


BookMenu.prototype.getTable = function() {	
	return this.menuTable;
};

BookMenu.prototype.menuTable

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


BookMenu.prototype.selectedBookHandler = function(e) {
	//alert("selected" + e.bookTitle)

	var evtData = {
		bookTitle:e.bookTitle
	}
	
	e.source.getParent().fireEvent("showBookDetails",evtData);

	

	//
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
				row.left = 250
				topPos = topPos + 310;
			}

		row.storyID = this.jsonData.data[i].storyID
		/// attach Events

		row.addEventListener('click', function(e){

			 var evtData = {
				bookTitle:e.source.storyID
			}
			
			e.source.getParent().fireEvent("selectedBook",evtData);


		})

		this.menuTable.add(row);

	};
	/*
	for (var i=1; i<=10; i++){
		var row = Ti.UI.createTableViewRow({
			className:'forumEvent', // used to improve table performance
			selectedBackgroundColor:'red',
			rowIndex:i, // custom property, useful for determining the row during events
			height:110
		});

		var labelUserName = Ti.UI.createLabel({
				color:'#576996',
				font:{fontFamily:'Arial', fontSize:20, fontWeight:'bold'},
				text:'Fred Smith ' + i,
				left:70, 
				top: 6,
				width:200,
				height: 30
			});
		row.add(labelUserName);

		tableData.push(row);
	}
	*/

};




BookMenu.prototype.clear = function() {
	
	this.removeEventListener('jsonReady', this.populateTable );
	this.menuTable.removeEventListener('selectedBook', this.selectedBookHandler);

};









BookMenu.prototype.createPedals = function (){

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

BookMenu.prototype.createPedalItem = function(_pedalInfo, _targetParent) {
	
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

BookMenu.prototype.mostrarTexto = function (){	
}

BookMenu.prototype.rotatePedals = function(){

		 
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




module.exports = BookMenu;