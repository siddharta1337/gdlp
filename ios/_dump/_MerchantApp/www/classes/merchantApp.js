function MerchantApp(){}

MerchantApp.prototype.authentication

MerchantApp.prototype.init = function(){
   
    this.authentication = new Authentication()
    
    this.authentication.veriftyPreviousLogins()
    
 
}

