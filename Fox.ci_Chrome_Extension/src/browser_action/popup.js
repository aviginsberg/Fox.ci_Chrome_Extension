var currentURL; 

window.onload = function () {



       

chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

     // since only one tab should be active and in the current window at once
     // the return variable should only have one entry
     var activeTab = arrayOfTabs[0];
     var activeTabId = arrayOfTabs[0].id;
 	var activeTabURL = arrayOfTabs[0].url;

currentURL = activeTabURL;


        $.get( "http://fox.ci/api/?url="+currentURL )
            .done(function( data ) {
                //alert( "Data Loaded: " + data );

                var obj = jQuery.parseJSON(data);

                if((obj.statuscode==="100")||(obj.statuscode==="101")){


                    var copyFrom = $('<textarea/>');
                    copyFrom.text(obj.shorturl);
                    $('body').append(copyFrom);
                    copyFrom.select();
                    document.execCommand('copy');
                    
                    $("#content").append("Fox.ci ShortURL copied to clipboard!<br>");


                }else{
                    document.write("Error: "+obj.statusdescription);
                }

            });



  });



}