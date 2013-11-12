function QrReader(){}

QrReader.prototype.scan = function() {
	
	//$.mobile.changePage("#offerDetails")
	window.plugins.barcodeScanner.scan(this.success, this.fail, ['scannerOverlay'])
	 
};

QrReader.prototype.currentQR;


QrReader.prototype.success = function(result) {
            if (result.cancelled){
                //console.log("the user cancelled the scan")
                app.qr.currentQR = "" 
            }else{
            	
            	app.qr.currentQR =  result.text

				var _URL 
				var mode 

				//offercode = redeeming from the scan qr codes screen 
				_URL  =  app.WS_URL + "offercode/?source=mm"
				var theData = '{ "offercode": "'+ result.text +'" , "merchantcode" : "12345" }';

				$.ajax({
					type: "POST",
					url: _URL,
					dataType: 'json',
					data: theData,
					contentType: "application/json; charset=utf-8",
				success:  function (response, status, xhr){

					if(response.msg == "Code Not Found"){

						setTimeout(function () {
                         
                         navigator.notification.alert(response.msg, null, ' Error', 'OK')

                         $.mobile.changePage("#activityDetail")

              			}, 200);

						//$.mobile.changePage("#offerDetails")
					}else{
						$.mobile.changePage("#offerDetails")
					}
					console.log(response)
				}, beforeSend: function (xhr) {                              
					xhr.setRequestHeader('Authorization',  'Bearer ' + localStorage.getItem("accessToken"));
					console.log(xhr);
				}
				}) 

               
               //$.mobile.changePage("#offerDetails")
        	}
};

QrReader.prototype.fail = function(error) {
	this.currentQR = null
};



