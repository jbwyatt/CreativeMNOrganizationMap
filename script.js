//script.js

//Custom style URL
var url = "mapbox://styles/creativemn/cj9g1ljm28jvm2rlo4nowrt0m";
// Data location
var data_location = 'data/MNOrgs.geojson';

//Access Token for Mapbox
var token = L.mapbox.accessToken = 'pk.eyJ1IjoiY3JlYXRpdmVtbiIsImEiOiJjajlnMWtxN3EycXVoMzNtcXVla2d2dTR1In0.qtU6-k6aSqU3a3qBv7B5Vg';


// Global variables
var map;
var styleLayer;
var sidebar;
var orgs_geojson;
var markers; 
var arts_multipurpose;
var history_prof;
var humanities;
var literary_arts;
var media_communications;
var other;
var performing_arts;
var visual_architecture;


// Specifies what happens upon click of marker
// Produce Results
function clickFeature(e) {
    // Get the current layer
    var layer = e.target;

    // Hide inital text in result tab
    $("#initial").hide()
    
    // Add organization
    $("#organization").html(layer.feature.properties.ORGANIZATI);

    // Make sure values afterwords are not null
    if(layer.feature.properties.Address != null)
    {
	// Update information
	$("#address_title").html("ADDRESS:");
	$("#address").html(layer.feature.properties.Address);
	$("#city").html(layer.feature.properties.City_1+', '+layer.feature.properties.RegionAbbr);
	// Ensure it is visible
	$("#address_title").show();
	$("#address").show();
	$("#city").show();  
    }
    else
    {
	$("#address_title").hide();
	$("#address").hide();
	if(layer.feature.properties.City_1 != null)
	{
	    // Update values
	    $("#city_title").html("CITY:");
	    $("#city").html(layer.feature.properties.City_1+', '+layer.feature.properties.RegionAbbr);
	    // Make sure they are visible
	    $("#city_title").show();
	    $("#city").show();
	}
	else
	{
	    $("#city_title").hide();
	    $("#city").hide();
	}
    }
    
    // Popup must have Discipline
    $("#discipline_title").html("DISCIPLINE:");
    $("#discipline").html(layer.feature.properties.DISCIPLINE);

    if(layer.feature.properties.URL != null)
    {
	$("#website").text("Website");
	$("#website").attr("href", layer.feature.properties.URL);
	$("#website").show();
    }
    else
    {
	$("#website").hide();
    }

    // Open the results size bar
    sidebar.open('results');
}


// Creates base map and UI (NO MARKERS!)
function init_map()
{
    map = L.mapbox.map('map', '',{
	zoomControl: false,
	minZoom : 4,
	maxBounds : [[0.0, -180.0],[70.0, -10.0]]
    }).setView([46.35, -94.2], 7);

    // Add custom basemap style to map
    styleLayer = L.mapbox.styleLayer(url).addTo(map);

    // Move zoom to top right corner
    new L.Control.Zoom({ position: 'topright' }).addTo(map);

    // Add side bar to map
    sidebar = L.control.sidebar('sidebar').addTo(map);
}

// Reads in JSON and creates markers
function create_markers()
{
    // Load in geojson data
    $.getJSON(data_location, function(data) {
	// Create geojson layer and stylize
	orgs_geojson = L.geoJson(data, {
	    // Assigns colors to feature based on Discipline
	    // **** Colors were randomly picked****
            style: function(feature) {
		switch (feature.properties.DISCIPLINE){
                case 'Arts Multipurpose' : return {color: "#FFC533"}; // gold
	        case 'History' : return {color: "#F78F2E"};  // orange
	        case 'Humanities' : return {color: "#B0D456"}; // light green
	        case 'Literary Arts' : return {color: "#09977E"}; // teal
	        case 'Media & Communications' : return {color: "#EF5E7D"};  // pink
	        case 'Other' : return {color: "#A05AA2"}; // purple
	        case 'Performing Arts' : return {color: "#076E98"}; // dark blue
                case 'Visual Arts & Architecture' : return {color: "#8FD2AC"}; // light teal
		}
	    },
	    // Create markers
	    pointToLayer: function(feature, latlng) {
		return new L.circleMarker(latlng, {radius: 10, fillOpacity: 0.85});
	    },
	    // Create popups for each feature
	    onEachFeature: function(feature, layer) {
		// Set it so popup is now in sidebar results tab
		layer.on({
		    click: clickFeature
		});
	    }
	});
    }).done(function() {

	// Do everything else after data has been read in
	//.done(function(){
	// Create layer groups for each discipline
	//$( document ).ajaxStop(function() {

	// Create layer groups for each discipline
	arts_multipurpose = L.layerGroup();
	history_prof = L.layerGroup();
	humanities = L.layerGroup();
	literary_arts = L.layerGroup();
	media_communications = L.layerGroup();
	other = L.layerGroup();
	performing_arts = L.layerGroup();
	visual_architecture = L.layerGroup();
	
	// Filter into proper groups
	orgs_geojson.eachLayer(function(layer) {
	    switch(layer.feature.properties.DISCIPLINE){
	    case 'Arts Multipurpose' :
		arts_multipurpose.addLayer(layer);
		break;
	    case 'History' :
		history_prof.addLayer(layer);
		break;
	    case 'Humanities' :
		humanities.addLayer(layer);
		break;
	    case 'Literary Arts' :
		literary_arts.addLayer(layer);
		break;
	    case 'Media & Communications' :
		media_communications.addLayer(layer);
		break;
	    case 'Other' :
		other.addLayer(layer);
		break;
	    case 'Performing Arts' :
		performing_arts.addLayer(layer);
		break;
	    case 'Visual Arts & Architecture' :
		visual_architecture.addLayer(layer);
		break;
	    }
	});
	
	// Add all the groups to the cluster
	markers= new L.markerClusterGroup();
	markers.addLayer(arts_multipurpose);
	markers.addLayer(history_prof);
	markers.addLayer(humanities);
	markers.addLayer(literary_arts);
	markers.addLayer(media_communications);
	markers.addLayer(other);
	markers.addLayer(performing_arts);
	markers.addLayer(visual_architecture);
	
	// Add the markercluster group to the map
	map.addLayer(markers);
    });

}

init_map();
create_markers();


// Function for filtering buttons clicked

function clickAM(){
    map.removeLayer(markers);
    if($('#checkBox_AM').is(':checked')){
	markers.addLayer(arts_multipurpose);
    }
    else{
	markers.removeLayer(arts_multipurpose);
    }
    map.addLayer(markers);
};

function clickHST(){
    map.removeLayer(markers);
    if($('#checkBox_HST').is(':checked')){
	markers.addLayer(history_prof);
    }
    else{
	markers.removeLayer(history_prof);
    }
    map.addLayer(markers);
};

function clickHUM(){
    map.removeLayer(markers);
    if($('#checkBox_HUM').is(':checked')){
	markers.addLayer(humanities);
    }
    else{
	markers.removeLayer(humanities);
    }
    map.addLayer(markers);
};

function clickLIT(){
    map.removeLayer(markers);
    if($('#checkBox_LIT').is(':checked')){
	markers.addLayer(literary_arts);
    }
    else{
	markers.removeLayer(literary_arts);
    }
    map.addLayer(markers);
};

function clickCOMM(){
    map.removeLayer(markers);
    if($('#checkBox_COMM').is(':checked')){
	markers.addLayer(media_communications);
    }
    else{
	markers.removeLayer(media_communications);
    }
    map.addLayer(markers);
};

function clickOTH(){
    map.removeLayer(markers);
    if($('#checkBox_OTH').is(':checked')){
	markers.addLayer(other);
    }
    else{
	markers.removeLayer(other);
    }
    map.addLayer(markers);
};

function clickPER(){
    map.removeLayer(markers);
    if($('#checkBox_PER').is(':checked')){
	markers.addLayer(performing_arts);
    }
    else{
	markers.removeLayer(performing_arts);
    }
    map.addLayer(markers);
};

function clickVIS(){
    map.removeLayer(markers);
    if($('#checkBox_VIS').is(':checked')){
	markers.addLayer(visual_architecture);
    }
    else{
	markers.removeLayer(visual_architecture);
    }
    map.addLayer(markers);
};
