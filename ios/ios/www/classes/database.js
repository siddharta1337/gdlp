// JavaScript Document
/*
* Database is just for data cache and order filters.
* all process and synk are made in webservice
*/


function DatabaseManager(){}

DatabaseManager.prototype.db;
DatabaseManager.prototype._tempWSData;
DatabaseManager.prototype._tempDBData;
//DatabaseManager.prototype._tempFilterList;

///inicializar UNA VEZ
DatabaseManager.prototype.init = function(){

     
    if(!this.db){
        var dbSize = 1 * 1024 * 1024; // 5MB
        app.database.db = window.openDatabase("goodLoop", "1.1", "goodLoop DB", dbSize);
        
        app.database.db.transaction(function(tx) {
          
                                   
            tx.executeSql('DROP TABLE IF EXISTS offers');
            tx.executeSql('DROP TABLE IF EXISTS offersNow');
            tx.executeSql('DROP TABLE IF EXISTS offersSoon');
            tx.executeSql('DROP TABLE IF EXISTS offersSelected');
            
            //tx.executeSql('DROP TABLE IF EXISTS filterList');


            tx.executeSql('CREATE TABLE IF NOT EXISTS offersNow      ( DealID, Description, EndsOn, MerchantName, PreviewImage)');         
            tx.executeSql('CREATE TABLE IF NOT EXISTS offersSoon     ( DealID, Description, EndsOn, MerchantName, PreviewImage)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS offersSelected ( DealID, Description, EndsOn, MerchantName, PreviewImage)');
            //tx.executeSql('CREATE TABLE IF NOT EXISTS filterList     ( filterName )');

        }, app.database.errorHandler);
    }                           
}

/// TODO: update to new databases Name

/// insert data to database
DatabaseManager.prototype.addItemsToDatabase = function(_WSData){
    
    // store data in an object
    this._tempWSData = _WSData
     
    this.db.transaction(function(tx1){
        ///// purgue DB
        
        tx1.executeSql('DELETE  FROM '+localStorage.getItem("dealList_activeTable"), [], function(txt2){
            
            /// rebuild DB
            app.database.db.transaction(function(txt3){
                        
                ////// populate DB records
                for(i=0; i<app.database._tempWSData.length ; i++ ){
                
                    app.database.addSingleRecord(txt3, app.database._tempWSData[i])
                }

                //// once everything is stored queryOffersInDB() is called
                        
            }, app.database.errorHandler, app.database.queryOffersInDB);

        }, app.database.errorHandler);
                        
     }, app.database.errorHandler);
}


/// called when all data is stored on DB 
DatabaseManager.prototype.readyToRenderList = function(){

    this.queryOffersInDB()
}

/// request all offers stored in Database
DatabaseManager.prototype.queryOffersInDB = function(first_argument) {
    app.database.db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM '+localStorage.getItem("dealList_activeTable"), [], function(tx2, results){
             
                ////query results
                DB_data = []
            
                for (var i = 0; i < results.rows.length; i++) {
                    DB_data.push( results.rows.item(i) )
                };

                ///data is queried and ready. calling list render!
                app.dealList.renderList(DB_data)

            }, app.database.errorHandler);                      
        
        }, app.database.errorHandler);
};

/// request my offers list
DatabaseManager.prototype.queryMyOffersInDB = function(first_argument) {
    app.database.db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM offersNow', [], function(tx2, results){
             
                ////query results
                DB_data = []
            
                for (var i = 0; i < results.rows.length; i++) {
                    DB_data.push( results.rows.item(i) )
                };

                ///data is queried and ready. calling list render!
                app.myOffers.renderValues(DB_data)

            }, app.database.errorHandler);                      
        
        }, app.database.errorHandler);
};


// borrar un registro

/*
////administrar los registros del filtro
DatabaseManager.prototype.populateFilterList = function(_data){
    
        app.database._tempFilterList = _data
     
        this.db.transaction(function(ftx1){
        ///// purgue DB
                        
             ftx1.executeSql('DELETE  FROM filterList ', [], function(ftxt2){
                       
                              
                        /// rebuild DB
                        app.database.db.transaction(function(ftxt3){
                                                    
                            
                            
                             ////// populate DB records
                             for(i=0; i< app.database._tempFilterList.length ; i++ ){
                                                                   
                                
                                var ze = app.escapeText(app.database._tempFilterList[i] )
                                 //ftxt3.executeSql('INSERT INTO filterList  ( filterName) VALUES ("'+ app.database._tempFilterList[i] +'")');
                                 ftxt3.executeSql('INSERT INTO filterList  ( filterName) VALUES ("'+ ze+'")');
                             }
                                                                   
 
                                                                  
                        }, app.database.errorHandler, app.database.queryFilterListInDB);
                               
                                       
                }, app.database.errorHandler);
                        
        }, app.database.errorHandler);
    
    
}

DatabaseManager.prototype.queryFilterListInDB = function(){
    

 
 app.database.db.transaction(function(ftx1){
 

 
 ftx1.executeSql('SELECT * FROM filterList', [], function(tx2, results){
 
 
 ////query results
 DB_data = []
 
 for (var i = 0; i < results.rows.length; i++) {
 DB_data.push( results.rows.item(i) );
 };
 
 ///data is queried and ready. calling list render!
 //app.dealList.renderList(DB_data)
 app.dealList.filterItems.renderList(DB_data);
 
 
 
 }, app.database.errorHandler);


 }, app.database.errorHandler);
}

*/


///add a new single record
DatabaseManager.prototype.addSingleRecord = function(context, values){
 
    
    context.executeSql('INSERT INTO '+localStorage.getItem("dealList_activeTable")+' ( DealID, Description, EndsOn, MerchantName, PreviewImage ) VALUES ('+values.DealID+',"'+ app.escapeText(values.Description) +'", "'+values.EndsOn+'",  "'+ app.escapeText(values.MerchantName) +'","'+values.PreviewImage+'")');
    
}


// error display
DatabaseManager.prototype.errorHandler = function(e){
    
    console.log("database error")
    console.log(e)
}


///add a registry to selected DB
DatabaseManager.prototype.addToSelectedDB = function(values) {

    app.database.db.transaction(function(context) {

        context.executeSql('INSERT INTO  offersSelected  ( DealID, Description, EndsOn, MerchantName, PreviewImage ) VALUES ('+values.DealID+',"'+ app.escapeText(values.Description) +'", "'+values.EndsOn+'",  "'+ app.escapeText(values.MerchantName) +'","'+values.PreviewImage+'")');

    })
};


// check if DB is active.
DatabaseManager.prototype.checkRecords = function() {
};

DatabaseManager.prototype.addToFavorites= function(values){
    
    this.db.transaction(function(context){
                        
    context.executeSql('INSERT INTO  offersSelected ( DealID, Description, EndsOn, MerchantName, PreviewImage ) VALUES ('+values.DealID+',"'+ app.escapeText(values.Description) +'", "'+values.EndsOn+'",  "'+ app.escapeText(values.MerchantName) +'","'+values.PreviewImage+'")');
    
                        }, function(){
                            console.log("DB error database:234")
                        })
    
        
    
}





