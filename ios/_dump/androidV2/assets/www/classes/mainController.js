// JavaScript Document
var GoodLoop = function(){}

GoodLoop.prototype.WS_URL = "http://dev.goodloop.org/api/"
GoodLoop.prototype.WS_URL_secure = "https://dev.goodloop.org/api/"
GoodLoop.prototype.IMG_URL = "https://goodloopcdn.blob.core.windows.net/"
GoodLoop.prototype.THUMB_IMG_URL = "https://goodloopcdn.blob.core.windows.net/"
//GoodLoop.prototype.IMG_URL =  = "http://dev.goodloop.org/"
GoodLoop.prototype.SITE_URL  = "http://dev.goodloop.org/"


GoodLoop.prototype.init = function(){
	
    
	/// inicializa las variables del sistema
    this.database = new DatabaseManager()
	this.authentication = new Authentication()
    this.facebookAuth = new FacebookAuth();
    this.twitter = new TwitterClass();
    
	this.navigation = new Navigation()
	this.dealList = new DealList()
	this.details = new Details()
	this.redeem = new Redeem()
	this.navigationScreen = new NavigationScreen()
	this.myOffers = new MyOffers()
    
    this.search = new Search();


    

    this.database.init();
    this.navigationScreen.init()
    this.facebookAuth.init()
	this.authentication.veriftyPreviousLogins()
	

	///localstorage Settings, create them if not available yet
	this.settingStart("dealList_activeTable","offersNow")
	this.settingStart("myOffers_activeTab","ready")
	this.settingStart("dealList_filterBy","none")
	this.settingStart("dealList_lastCheck","0")
 

	
	

}

/***** Global Toolds ****/
// parse a date using feed format (3/17/2013 to "March 17, 2013")
GoodLoop.prototype.dateConverter = function(_date) {
	//_dateParse = _date.split("T")
     
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
	var givenDate = new Date(_date)
    
    //console.log(_date)
    //console.log( givenDate.getDay() )
    
	var result = monthNames[givenDate.getMonth()] +" " + givenDate.getUTCDate() + ", " + givenDate.getFullYear()


	return result;
};


GoodLoop.prototype.escapeText = function(_text){

    return escape(_text)
    
}

GoodLoop.prototype.outputText = function(_text){

    return unescape(_text)
}

GoodLoop.prototype.settingStart = function(_key, _value) {
	
	if(localStorage.getItem(_key) == null){
		localStorage.setItem(_key,_value)
		console.log("el valor no existe, lo defino en " + _value)
	} 
};

