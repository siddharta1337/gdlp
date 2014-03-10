// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};


Alloy.Globals.rotateLeft = Ti.UI.create2DMatrix().rotate(-90);
Alloy.Globals.rotateRight = Ti.UI.create2DMatrix().rotate(90);
Alloy.Globals.rotateTop = Ti.UI.create2DMatrix().rotate(-180);

Alloy.Globals.rotateInterno = Ti.UI.create2DMatrix().rotate(49).scale(2, 2);
Alloy.Globals.rotateReset= Ti.UI.create2DMatrix().rotate(0);

Alloy.Globals.storyFolderRoot = "/storyAssets/"

//if(1 = 1) {

	Alloy.Globals.androidScaleFactor = Ti.UI.create2DMatrix().scale(0.5, 0.5);
//}

