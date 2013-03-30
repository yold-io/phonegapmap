var app = {
    currentPosition : "",
    map : "",

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
    },

    setCurrentPositionMarker: function(currentPosition) {
        var img = {
            url: 'img/curPosMarker',
            size: new google.maps.Size(50,50)
        };

        new google.maps.Marker({
            position: currentPosition,
            title: 'Current Location',
            map: this.map,
            optimized: false,
            icon:img
        });
    }

};
