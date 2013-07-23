function FilterItems(){
   
    this.setDefault()
    this.checkUpdate();
}


/// verify if filter Item has lees than 7 days
FilterItems.prototype.checkUpdate = function(){
    
    //// check if theres a latest update date
    var lastUpdateCheck = localStorage.getItem("latestUpdate_filterItems")
    

    //if there's no update register call defaults
    if(!lastUpdateCheck ){
        
        this.setDefault()
       
    }else{

        ///compare dates, if current is older than a week, fetch new results
        if( this.verifyDate() ){
            this.fetchDataFromServer()
        }
    }

}

/// set the default filter list in case no internet conection is available
FilterItems.prototype.setDefault = function() {
    
    if(localStorage.getItem("filterList") == null ){
         

        var parsedData =  [ "Afghan",
                                        "African",
                                        "American (New)",
                                        "Arabian",
                                        "Argentine",
                                        "Asian Fusion",
                                        "Australian",
                                        "Austrian",
                                        "Bangladeshi",
                                        "Barbeque",
                                        "Basque",
                                        "Belgian",
                                        "Brasseries",
                                        "Brazilian",
                                        "Breakfast & Brunch",
                                        "British",
                                        "Buffets",
                                        "Burgers",
                                        "Burmese",
                                        "Cafes",
                                        "Cajun/Creole",
                                        "Cambodian",
                                        "Caribbean",
                                        "Catalan",
                                        "Cheesesteaks",
                                        "Chicken Wings",
                                        "Chinese",
                                        "Comfort Food",
                                        "Creperies",
                                        "Cuban",
                                        "Czech/Slovakian",
                                        "Delis",
                                        "Diners",
                                        "Ethiopian",
                                        "Fast Food",
                                        "Filipino",
                                        "Fish & Chips",
                                        "Fondue",
                                        "Food Court",
                                        "Food Stands",
                                        "French",
                                        "Gastropubs",
                                        "German",
                                        "Gluten-Free",
                                        "Greek",
                                        "Halal",
                                        "Hawaiian",
                                        "Himalayan/Nepalese",
                                        "Hot Dogs",
                                        "Hot Pot",
                                        "Hungarian",
                                        "Iberian",
                                        "Indian",
                                        "Indonesian",
                                        "Irish",
                                        "Italian",
                                        "Japanese",
                                        "Korean",
                                        "Kosher",
                                        "Laotian",
                                        "Latin American",
                                        "Live/Raw Food",
                                        "Malaysian",
                                        "Mediterranean",
                                        "Mexican",
                                        "Middle Eastern",
                                        "Modern European",
                                        "Mongolian",
                                        "Moroccan",
                                        "Pakistani",
                                        "Persian/Iranian",
                                        "Peruvian",
                                        "Pizza",
                                        "Polish",
                                        "Portuguese",
                                        "Russian",
                                        "Salad",
                                        "Sandwiches",
                                        "Scandinavian",
                                        "Scottish",
                                        "Seafood",
                                        "Singaporean",
                                        "Soul Food",
                                        "Soup",
                                        "Southern",
                                        "Spanish",
                                        "Steakhouses",
                                        "Sushi Bars",
                                        "Taiwanese",
                                        "Tapas Bars",
                                        "Tapas/Small Plates",
                                        "Tex-Mex",
                                        "Thai",
                                        "Turkish",
                                        "Ukrainian",
                                        "Vegan",
                                        "Vegetarian",
                                        "Vietnamese",
                                        "Accessories",
                                        "Adult",
                                        "Antiques",
                                        "Appliances",
                                        "Art Galleries",
                                        "Art Supplies",
                                        "Arts & Crafts",
                                        "Auction Houses",
                                        "Bespoke Clothing",
                                        "Bikes",
                                        "Books",
                                        "Mags",
                                        "Music&Video",
                                        "Bookstores",
                                        "Bridal",
                                        "Cards & Stationery",
                                        "Comic Books",
                                        "Computers",
                                        "Costumes",
                                        "Department Stores",
                                        "Discount Store",
                                        "Drugstores",
                                        "Electronics",
                                        "Fabric Stores",
                                        "Fashion",
                                        "Fireworks",
                                        "Florists",
                                        "Flowers & Gifts",
                                        "Formal Wear",
                                        "Framing",
                                        "Furniture Stores",
                                        "Gift Shops",
                                        "Golf Equipment",
                                        "Guns & Ammo",
                                        "Hardware Stores",
                                        "Hats",
                                        "Hobby Shops",
                                        "Home & Garden",
                                        "Home Decor",
                                        "Hot Tub & Pool",
                                        "Jewelry",
                                        "Kitchen & Bath",
                                        "Knitting Supplies",
                                        "Leather Goods",
                                        "Lingerie",
                                        "Luggage",
                                        "Maternity Wear",
                                        "Mattresses",
                                        "Medical Supplies",
                                        "Men's Clothing",
                                        "Mobile Phones",
                                        "Music & DVDs",
                                        "Office Equipment",
                                        "Outdoor Gear",
                                        "Outlet Stores",
                                        "Pawn Shops",
                                        "Personal Shopping",
                                        "Plus Size Fashion",
                                        "Shoe Stores",
                                        "Shopping Centers",
                                        "Sporting Goods",
                                        "Sports Wear",
                                        "Swimwear",
                                        "Thrift Stores",
                                        "Tobacco Shops",
                                        "Toy Stores",
                                        "Uniforms",
                                        "Used",
                                        "Vinyl Records",
                                        "Watches",
                                        "Wholesale Stores",
                                        "Wigs",
                                        "Women's Clothing",
                                        "Barbers",
                                        "Day Spas",
                                        "Eyelash Service",
                                        "Hair Extensions",
                                        "Hair Removal",
                                        "Hair Salons",
                                        "Hair Stylists",
                                        "Laser Hair Removal",
                                        "Makeup Artists",
                                        "Massage",
                                        "Medical Spas",
                                        "Men's Hair Salons",
                                        "Nail Salons",
                                        "Piercing",
                                        "Rolfing",
                                        "Skin Care",
                                        "Tanning",
                                        "Tattoo",
                                        "Acupuncture",
                                        "Allergists",
                                        "Anesthesiologists",
                                        "Audiologist",
                                        "Cannabis Clinics",
                                        "Cardiologists",
                                        "Chiropractors",
                                        "Cosmetic Dentists",
                                        "Cosmetic Surgeons",
                                        "Dentists",
                                        "Dermatologists",
                                        "Diagnostic Imaging",
                                        "Doctors",
                                        "Ear Nose & Throat",
                                        "Endodontists",
                                        "Family Practice",
                                        "Fertility",
                                        "Gastroenterologist",
                                        "General Dentistry",
                                        "Gerontologists",
                                        "Home Health Care",
                                        "Hospice",
                                        "Hospitals",
                                        "Internal Medicine",
                                        "Laboratory Testing",
                                        "Lactation Services",
                                        "Massage Therapy",
                                        "Medical Centers",
                                        "Medical Spas",
                                        "Midwives",
                                        "Neurologist",
                                        "Nutritionists",
                                        "Oncologist",
                                        "Ophthalmologists",
                                        "Optometrists",
                                        "Oral Surgeons",
                                        "Orthodontists",
                                        "Orthopedists",
                                        "Pediatric Dentists",
                                        "Pediatricians",
                                        "Periodontists",
                                        "Physical Therapy",
                                        "Podiatrists",
                                        "Proctologists",
                                        "Psychiatrists",
                                        "Pulmonologist",
                                        "Reflexology",
                                        "Retirement Homes",
                                        "Speech Therapists",
                                        "Sports Medicine",
                                        "Tattoo Removal",
                                        "Urgent Care",
                                        "Urologists",
                                        "Amusement Parks",
                                        "Aquariums",
                                        "Archery",
                                        "Badminton",
                                        "Barre Classes",
                                        "Beaches",
                                        "Bike Rentals",
                                        "Boating",
                                        "Boot Camps",
                                        "Bowling",
                                        "Boxing",
                                        "Climbing",
                                        "Dance Studios",
                                        "Disc Golf",
                                        "Diving",
                                        "Dog Parks",
                                        "Fishing",
                                        "Free Diving",
                                        "Go Karts",
                                        "Golf",
                                        "Gun/Rifle Ranges",
                                        "Gymnastics",
                                        "Gyms",
                                        "Hang Gliding",
                                        "Hiking",
                                        "Horse Racing",
                                        "Horseback Riding",
                                        "Kiteboarding",
                                        "Lakes",
                                        "Leisure Centers",
                                        "Martial Arts",
                                        "Mini Golf",
                                        "Mountain Biking",
                                        "Paddleboarding",
                                        "Paintball",
                                        "Parks",
                                        "Pilates",
                                        "Playgrounds",
                                        "Rafting/Kayaking",
                                        "Recreation Centers",
                                        "Rock Climbing",
                                        "Scuba Diving",
                                        "Skate Parks",
                                        "Skating Rinks",
                                        "Skydiving",
                                        "Soccer",
                                        "Sports Clubs",
                                        "Squash",
                                        "Summer Camps",
                                        "Surfing",
                                        "Swimming Pools",
                                        "Tai Chi",
                                        "Tennis",
                                        "Trainers",
                                        "Trampoline Parks",
                                        "Tubing",
                                        "Yoga",
                                        "Zoos",
                                        "Arcades",
                                        "Art Galleries",
                                        "Botanical Gardens",
                                        "Casinos",
                                        "Cinema",
                                        "Cultural Center",
                                        "Festivals",
                                        "Jazz & Blues",
                                        "Museums",
                                        "Music Venues",
                                        "Opera & Ballet",
                                        "Performing Arts",
                                        "Social Clubs",
                                        "Stadiums & Arenas",
                                        "Ticket Sales",
                                        "Wineries"];

        localStorage.setItem("latestUpdate_filterItems", "January 1, 2013  00:00:00")
        localStorage.setItem("filterList" , JSON.stringify(parsedData));
    }
};

/// Fetch a new filter list from server
FilterItems.prototype.fetchDataFromServer = function() {
 
    $.ajax({
           type: "GET",
           url: app.WS_URL+"/search?source=mu",
           dataType: 'json',
           contentType: "application/json; charset=utf-8",
           success: function (response){

                
                //JSON.stringify(response)
                if(response != ""){
                    var parsedData = app.navigationScreen.filterItems.parseResponse(response)
                    localStorage.setItem("filterList", parsedData );

                }
                
           
           },
           error: function (response) {
                console.log("can't connect to search list")
           },
    }); 

    /*
    $.ajax({
           type: "GET",
           url: app.WS_URL+"/search?source=mu",
           dataType: 'json',
           contentType: "application/json; charset=utf-8",
           success: function (response){
               
                if(response != "")
                    var parsedData =  JSON.stringify(response)
                    localStorage.setItem("filterList", parsedData);
                    app.dealList.buildFilter()
                }else{
                    /// cant build filter!
                }

               
           },
           error: function (response) {
                console.log("can't connect to search list")
           },
    }); 
    */
};

// remove invalid characters form response and return a string ready to store
FilterItems.prototype.parseResponse = function(_response) {
        
        /// _response is a simple array, make it double!
        var jsonOutput = []
        for (var i = 0; i < _response.length; i++) {
             var itemArray = [ _response[i], _response[i] ]  

             var safeString = app.escapeText( _response[i] );
             jsonOutput.push( safeString )
            
        };
        

        return JSON.stringify( jsonOutput)
};

//// take a date and return true if needs to update
FilterItems.prototype.verifyDate = function(lastUpdate){
    
    ///TODO fake Date, replace with real values
    var lastUpdate = new Date(localStorage.getItem("latestUpdate_filterItems"));
    
    // define an offset and convert it to miliseconds 
    var dayOffset = 7;
    var millisecondOffset = dayOffset * 24 * 60 * 60 * 1000;
    
    //
    _maxDateToUpdate= new Date()
    _maxDateToUpdate.setTime(lastUpdate.getTime() + millisecondOffset);
    
    ///today
    var today = new Date();
    
    
    // validar fecha
    if ( _maxDateToUpdate.getTime() > today.getTime()) {
        return false;
    }else{
        return true;
    }  
};