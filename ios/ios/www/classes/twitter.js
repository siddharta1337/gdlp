function TwitterClass(){}

TwitterClass.prototype.init = function() {
    // body...
};


TwitterClass.prototype.sendTweet = function(_text, _url, _image){
     
    var innerMsg = _text
    var innerURL = _url
    var innerImage = _image
    

    window.plugins.twitter.composeTweet(
        function(s){ console.log("tweet success"); }, 

        function(e){ console.log("tweet failure: " + e); }, 
            innerMsg , 
            {
                urlAttach: innerURL, //"http://m.youtube.com/#/watch?v=obx2VOtx0qU", 
                imageAttach:innerImage, //"http://i.ytimg.com/vi/obx2VOtx0qU/hqdefault.jpg?w=320&h=192&sigh=QD3HYoJj9dtiytpCSXhkaq1oG8M"
            });

}

TwitterClass.prototype.TwitterInstance = {
    $:function(id){
        return document.getElementById(id);
    },
    
    log:function(s){
        app.twitter.TwitterInstance.$("log").innerHTML = s;
    },
    
    setup:function(){
        var tests = ["isAvailable", "isSetup", "tweet1", "tweet2", "tweet3", "tweet4", "tweet5", "tweet6", "timeline", "mentions", "friendsIds", "usersLookup"];
        for(var i=0, l=tests.length; i<l; i++){
            this.$(tests[i]).onclick = this[tests[i]];
        }
    },
    
    isAvailable:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.isTwitterAvailable(function(r){
            app.twitter.TwitterInstance.log("twitter available? " + r);
        });        
    },
    
    isSetup:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.isTwitterSetup(function(r){
            app.twitter.TwitterInstance.log("twitter configured? " + r);
        });
    },
  
    tweet1:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.composeTweet(
            function(s){ app.twitter.TwitterInstance.log("tweet success"); }, 
            function(e){ app.twitter.TwitterInstance.log("tweet failure: " + e); }, 
            "Text, Image, URL", 
            {
                urlAttach:"http://m.youtube.com/#/watch?v=obx2VOtx0qU", 
                imageAttach:"http://i.ytimg.com/vi/obx2VOtx0qU/hqdefault.jpg?w=320&h=192&sigh=QD3HYoJj9dtiytpCSXhkaq1oG8M"
            });
    },

    
    /*
     //Original tweet1 example
    tweet1:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.composeTweet(
            function(s){ app.twitter.TwitterInstance.log("tweet success"); }, 
            function(e){ app.twitter.TwitterInstance.log("tweet failure: " + e); }, 
            "Text, Image, URL", 
            {
                urlAttach:"https://github.com/brianantonelli", 
                imageAttach:"http://zomgdinosaurs.com/zomg.jpg"
            });
    },
     
     */

    tweet2:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.composeTweet(
            function(s){ app.twitter.TwitterInstance.log("tweet success"); }, 
            function(e){ app.twitter.TwitterInstance.log("tweet failure: " + e); }, 
            "Text, Remote Image", 
            {
                imageAttach:"http://zomgdinosaurs.com/zomg.jpg"
            });
    },

    tweet6:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.composeTweet(
                                            function(s){ app.twitter.TwitterInstance.log("tweet success"); }, 
                                            function(e){ app.twitter.TwitterInstance.log("tweet failure: " + e); }, 
                                            "Text, Local Image", 
                                            {
                                            imageAttach:"www/ninja-lolcat.gif"
                                            });
    },

    tweet3:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.composeTweet(
            function(s){ app.twitter.TwitterInstance.log("tweet success"); }, 
            function(e){ app.twitter.TwitterInstance.log("tweet failure: " + e); }, 
            "Text, URL", 
            {
                urlAttach:"https://github.com/brianantonelli"
            });
    },

    tweet4:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.composeTweet(
            function(s){ app.twitter.TwitterInstance.log("tweet success"); }, 
            function(e){ app.twitter.TwitterInstance.log("tweet failure: " + e); }, 
            "Text");
    },
    
    tweet5:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.composeTweet(
            function(s){ app.twitter.TwitterInstance.log("tweet success"); }, 
            function(e){ app.twitter.TwitterInstance.log("tweet failure: " + e); });
    },

    timeline:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.getPublicTimeline(
            function(s){ app.twitter.TwitterInstance.log("timeline success: " + JSON.stringify(s)); }, 
            function(e){ app.twitter.TwitterInstance.log("timeline failure: " + e); });
    },
    
    mentions:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.getMentions(
            function(s){ app.twitter.TwitterInstance.log("mentions success: " + JSON.stringify(s)); }, 
            function(e){ app.twitter.TwitterInstance.log("mentions failure: " + e); });
    },
    
    friendsIds:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.getTWRequest(
            'friends/ids.json',
            {},
            function(s){ app.twitter.TwitterInstance.log("friendsIds success: " + JSON.stringify(s)); }, 
            function(e){ app.twitter.TwitterInstance.log("friendsIds failure: " + e); });
    },
    
    usersLookup:function(){
        app.twitter.TwitterInstance.log("wait..");
        window.plugins.twitter.getTWRequest(
            'users/lookup.json',
            {user_id: '16141659,783214,6253282'},
            function(s){ app.twitter.TwitterInstance.log("usersLookup success: " + JSON.stringify(s)); }, 
            function(e){ app.twitter.TwitterInstance.log("usersLookup failure: " + e); },
            {requestMethod: 'POST'});
    }
    
    
};
