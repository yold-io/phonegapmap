var app = {
    currentPosition : "",
    map : "",
    infowindow : "",
    markersArray : [],

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    loadMap: function() {
        navigator.geolocation.getCurrentPosition(app.locationFound, app.locationError, { maximumAge: 3000, timeout: 15000, enableHighAccuracy: true });
    },

    locationFound: function(position) {
        app.drawMap(position);
    },

    locationError: function() {
        alert("Sorry cannot find your current location");
    },

    drawMap: function(position){
        this.currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
            center: this.currentPosition,
            zoom: 15,
            disableDefaultUI: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: true
        };
        this.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        app.setCurrentPositionMarker(this.currentPosition);

        var defaultBounds = new google.maps.LatLngBounds(
                            new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                            new google.maps.LatLng(position.coords.latitude + 0.1, position.coords.longitude + 0.1));
        this.map.fitBounds(defaultBounds);

        var input = document.getElementById('searchTextField');

        var searchBox = new google.maps.places.SearchBox(input, {
            bounds: defaultBounds
        });

        this.map.setCenter(this.currentPosition);
    },

    setCurrentPositionMarker: function(currentPosition) {
        var img = {
            url: 'img/curPosMarker.png',
            size: new google.maps.Size(50,50)
        };

        new google.maps.Marker({
            position: currentPosition,
            title: 'Current Location',
            map: this.map,
            optimized: false,
            icon:img
        });
    },

    searchPlace: function(keyword) {

        this.deleteMarker();
        var request = {
            location: this.currentPosition,
            radius: '300',
            query: keyword
        };

        var service = new google.maps.places.PlacesService(this.map);
        service.textSearch(request, app.onSearchSuccess);
    },

    onSearchSuccess: function(results, status){
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                app.createPlaceMarker(results[i]);
            }
            app.saveMarker(app.map);
        }
    },

    createPlaceMarker: function(place){
        this.infowindow = new google.maps.InfoWindow();
        var placeInformation = place.name + "<br/>" + place.formatted_address
        var marker = new google.maps.Marker({
            map: this.map,
            position: place.geometry.location
        });
        this.markersArray.push(marker);
        //Add event listener to each marker
        google.maps.event.addListener(marker, 'click', function() {
            app.infowindow.setContent(placeInformation);
            app.infowindow.open(app.map, this);
        });
    },

    // Sets the map on all markers in the array.
    saveMarker: function(map) {
        for (var i = 0; i < this.markersArray.length; i++) {
            this.markersArray[i].setMap(map);
        }
    },

    deleteMarker: function(){
        app.saveMarker(null);
        this.markersArray = [];
    }

};
