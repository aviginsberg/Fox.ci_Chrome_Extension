var currentURL; 

window.onload = function () {


 //  alert('The browser action was clicked! Yay!');
       

chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

     // since only one tab should be active and in the current window at once
     // the return variable should only have one entry
     var activeTab = arrayOfTabs[0];
     var activeTabId = arrayOfTabs[0].id; // or do whatever you need
 	var activeTabURL = arrayOfTabs[0].url;
//document.write(activeTabURL);
currentURL = activeTabURL;
//$("#content").append("activeTabURL: "+activeTabURL+"<br>");

//$("#content").append("currentURL: "+currentURL+"<br>");



        $.get( "http://fox.ci/api/?url="+currentURL )
            .done(function( data ) {
                //alert( "Data Loaded: " + data );

                var obj = jQuery.parseJSON(data);

                if((obj.statuscode==="100")||(obj.statuscode==="101")){
                    //document.write("Success! Our short URL is: "+obj.shorturl);
 					//$("#content").append("Short URL: <input type=\"text\" id=\"copyBox\" value=\""+obj.shorturl+"\"><br>");

		

var copyFrom = $('<textarea/>');
    copyFrom.text(obj.shorturl);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    //copyFrom.remove();

$("#content").append("Fox.ci ShortURL copied to clipboard!<br>");




                }else{
                    document.write("nuuu something went wrong and it failed");
                }
                //document.write("<br>"+obj.statuscode);    
                //document.write(obj.statusdescription);
            });



  });

//$("#content").append("Current URL: "+currentURL+"<br>");
 //$("mainPopup").append('Test');


}