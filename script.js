//script.js

//Custom style URL
var url = "mapbox://styles/creativemn/cj9g1ljm28jvm2rlo4nowrt0m"
// Data location
var data_location = 'data/MNOrgs.geojson'
    
//Access Token for Mapbox
L.mapbox.accessToken = 'pk.eyJ1IjoiY3JlYXRpdmVtbiIsImEiOiJjajlnMWtxN3EycXVoMzNtcXVla2d2dTR1In0.qtU6-k6aSqU3a3qBv7B5Vg'

    // Create map
    var map = L.mapbox.map('map', /*'mapbox.light'*/)
        .setView([46.35, -94.2], 7);
    // Add custom basemap style to map
    var styleLayer = L.mapbox.styleLayer(url)
        .addTo(map);


    // Create cluster layer
    var markers = new L.markerClusterGroup();

    // Load in geojson data
    $.getJSON(data_location, function(data) {
	// Create geojson layer and stylize
	var orgs_geojson = L.geoJson(data, {
	    // Assigns colors to feature based on Discipline
	    // **** Colors were randomly picked****
            style: function(feature) {
		switch (feature.properties.DISCIPLINE){
	        case 'Arts Multipurpose' : return {color: "#ff0000"};  // red
	        case 'History' : return {color: "#ffff00"};  // yellow
	        case 'Humanities' : return {color: "#008000"}; // green
	        case 'Literary Arts' : return {color: "#0000ff"}; // blue
	        case 'Media & Communications' : return {color: "#800080"}; // purple
	        case 'Other' : return {color: "#800000"}; // maroon
	        case 'Performing Arts' : return {color: "#00ffff"}; // aqua
		case 'Visual Arts & Architecture' : return {color: "#008000"};  // olive
		}
	    },
	    // Create markers
	    pointToLayer: function(feature, latlng) {
		return new L.circleMarker(latlng, {radius: 10, fillOpacity: 0.85});
	    },
	    // Create popups for each feature
	    onEachFeature: function(feature, layer) {
		layer.bindPopup('<h1>'+feature.properties.ORGANIZATI+'</h1><p>City: '+feature.properties.City+'</p><p>Discipline: '+feature.properties.DISCIPLINE+'</p>');
	    }
        });
	// Add geoJsonLayer to markercluster group
	markers.addLayer(orgs_geojson);
	
	// Add the markercluster group to the map
	map.addLayer(markers);
    });



