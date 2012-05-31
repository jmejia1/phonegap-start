// 
//  --- our app behavior logic ---
//
run(function () {
    // immediately invoked on first run
    var init = (function () {
        if (navigator.network.connection.type == Connection.NONE) {
            alert("No internet connection - we won't be able to show you any maps");
        } else {
            alert("Conexión OK! Puedes continuar...");
        }
    })();
    
    // a little inline controller
    when('#welcome');
    when('#settings', function() {
		// load settings from store and make sure we persist radio buttons.
		store.get('config', function(saved) {
			if (saved) {
				if (saved.map) {
					x$('input[value=' + saved.map + ']').attr('checked',true);
				}
				if (saved.zoom) {
					x$('input[name=zoom][value="' + saved.zoom + '"]').attr('checked',true);
				}
			}
		});
	});
    when('#map', function () {
        store.get('config', function (saved) {
            // construct a gmap str
            var map  = saved ? saved.map || ui('map') : ui('map')
            ,   zoom = saved ? saved.zoom || ui('zoom') : ui('zoom')
            ,   path = "http://maps.google.com/maps/api/staticmap?center=";
			
            navigator.geolocation.getCurrentPosition(function (position) {
                var location = "" + position.coords.latitude + "," + position.coords.longitude;
                path += location + "&zoom=" + zoom;
                path += "&size=250x250&maptype=" + map + "&markers=color:red|label:P|";
                path += location + "&sensor=false";

                x$('img#static_map').attr('src', path);
            }, function () {
                x$('img#static_map').attr('src', "assets/img/gpsfailed.png");
            });
        });
    });
    when('#info', function(document) {
		//$(document).ready(function() {
			$.get('http://www.thomas-bayer.com/sqlrest/CUSTOMER/2000', function(d)
			{
				//$('body').append('<h4> Probando Conexión REST-XML</h4>');
				//$('body').append('<dl />');

				$(d).find('CUSTOMER').each(function()
				{
					var $book = $(this); 
					var FIRSTNAME = $book.find('FIRSTNAME').text();
					var LASTNAME = $book.find('LASTNAME').text();
					//var imageurl = $book.attr('imageurl');

					//var html = '<dt> <img class="bookImage" alt="" src="' + imageurl + '" /> </dt>';
					//html += '<dd> <span class="loadingPic" alt="Loading" />';
					//html += '<p class="title">' + title + '</p>';
					//html += '<p> ' + description + '</p>' ;
					//html += '</dd>';
					var html = '<h4>' + FIRSTNAME + '</h4>';
					html += '<p>' + LASTNAME + '</p>';  
					
					$('info_data').append($(html));
					
					//$('.loadingPic').fadeOut(1400);
				});
			});
		//});
	});
    when('#save', function () {
        store.save({
            key:'config',
            map:ui('map'),
            zoom:ui('zoom')
        });
        display('#welcome');
    });

});
