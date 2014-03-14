function FileDownloader(){
}

/**
 * Make and http call and save the result into a file.
 * 
 * Parameters:
 * url - url of the http call to be downloaded. 
 * localFilePath - The path of the local file where the content will be saved. The folder in which the file to be downloaded must exsists.
 * callBack_DownloadOneFileFinished - The fucntion that is called once the download has finished
 * 		Callback return object:
 * 			{ status, path}
 * 		status: integer - HTTP status for the call. 200 means successful. 
 * 		path: string - full path of the file just downloaded
 */
FileDownloader.prototype.downloadOneFile = function(url, localFilepath, callBack_DownloadOneFileFinished) {

	var c = Titanium.Network.createHTTPClient();

	if(null != callBack_DownloadOneFileFinished) {
		c.onerror = function(e) {
			Ti.API.info('MyApp: Download failed: url= ' + url + ' Error=' + e.error);

			callBack_DownloadOneFileFinished({
				status : e.error,
				path : ''
			});
		};

		c.onload = function(e) {

			if(Titanium.Platform.name === 'android') {

				// On android HTTPClient will not save the file to disk. So have to hack around it
				Ti.API.info('MyApp: (Andoid) Downloaded this file from server:.' + localFilepath);
				var f = Titanium.Filesystem.getFile(localFilepath);
				f.write(c.responseData);
			}

			callBack_DownloadOneFileFinished({
				status : c.status,
				path : localFilepath
			});
		};
	}

	c.open('GET', url);

	if(null != localFilepath && Titanium.Platform.name !== 'android') {
		Ti.API.info('MyApp:  (iOS) Downloaded this file from server:.' + localFilepath);
		c.file = Titanium.Filesystem.getFile(localFilepath);
	}

	c.send();
};

/**
 * Given an array of URLs make several http calls and save the results into different file.
 * 
 * Parameters:
 * downloadQueue - [{'filepath' : "", 'url': ""}]
 * 			filepath - The path of the local file where the content will be saved. The folder in which the file to be downloaded must exsists.
 * 			url - url of the http call to be downloaded. 
 * callBack_DownloadOneFileFinished - The fucntion that is called once each file download has finished
 * 		Callback return object:
 * 			{ status, path}
 * 		status: integer - HTTP status for the call. 200 means successful. 
 * 		path: string - full path of the file just downloaded
 * callBack_DownloadMultipleFileFinished - The function that is caled once all the files are downloaded. This function does not accept any parameters
 * 
 */
FileDownloader.prototype.downloadMultiFile = function(downloadQueue, callBack_DownloadOneFileFinished, callBack_DownloadMultipleFileFinished) {

	var queueIndex = 0;

	var processQueue = function(download_result) {
		//once the download of one file is finished the downloadOneFile will call back the processQueue
		//which will move the index forward and download another file
			
		if( typeof (download_result) !== 'undefined') {
			callBack_DownloadOneFileFinished(download_result);
		}

		if(queueIndex < downloadQueue.length) {


			FileDownloader.prototype.downloadOneFile(downloadQueue[queueIndex].url, downloadQueue[queueIndex].filepath, processQueue);
			queueIndex++;

		} else {
			callBack_DownloadMultipleFileFinished();
		}

	};
	processQueue();
};

/**
verify the last update of the app
**/
FileDownloader.prototype.checkLastUpdate = function(_callback){

	//this.downloadOneFile(Alloy.Globals.remoteServerRoot+'lastUpdate.json', Titanium.Filesystem.applicationDataDirectory+"chapi.png" , fileListo);
	

	var url = Alloy.Globals.remoteServerRoot+'lastUpdate.json';
	var json;
	  
	var xhr = Ti.Network.createHTTPClient({
	    onload: function() {
	        // parse the retrieved data, turning it into a JavaScript object
	        json = JSON.parse(this.responseText);

	        alert( json.lastUpdate.toString() )

	        var serverDate = new Date( json.lastUpdate.toString() )
	        var localDate = new Date( Ti.App.Properties.getString('lastUpdate') )

	        if(  serverDate.getTime() > localDate.getTime()  ){
	        	alert( "actualizar" )
	        }else{
	        	alert("no actualiar")
	        }
	        
	        //_callback(json);
	    },onerror : function(e) {
         	Ti.API.debug("error reading last update " + e.error);
     	}
	});

	// Prepare the connection.
	xhr.open("GET", url);
	// Send the request.
	xhr.send();
}


module.exports = FileDownloader;