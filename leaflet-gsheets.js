/*
 * Script to display two tables from Google Sheets as point using Leaflet
 * The Sheets are then imported using Tabletop.js and overwrite the initially laded layers
 */

// init() is called as soon as the page loads
function init() {
  var pointsURL = "https://docs.google.com/spreadsheets/d/1QTY5ybMfttoqnuIwC8VyWDrvjr7vJrbqnEI_JmMnXvA/edit?usp=sharing";

  Tabletop.init({ key: pointsURL, callback: addPoints, simpleSheet: true }); // simpleSheet assumes there is only one table and automatically sends its data
}
window.addEventListener("DOMContentLoaded", init);

function mapFunction() {
  var x = document.getElementById("map");
  //var xx = document.getElementsById("map-btn");
  var y = document.getElementById("table");
  var z = document.getElementById("legend");
    x.style.display = "block";
    y.style.display = "none";
    z.style.display = "block";
}

function tableFunction() {
  var x = document.getElementById("map");
  var y = document.getElementById("table");
  var z = document.getElementById("legend");
    x.style.display = "none";
    y.style.display = "block";
    z.style.display = "none";
}


// Create a new Leaflet map centered on the continental US
var map = L.map("map").setView([39, -98], 5);

// basemap
var Wikimedia = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	minZoom: 1,
	maxZoom: 19
}).addTo(map);

var pointGroupLayer;


function addPoints(data) {
  if (pointGroupLayer != null) {
    pointGroupLayer.remove();
  }
  pointGroupLayer = L.layerGroup().addTo(map);

  for (var row = 0; row < data.length; row++) {
    var marker = L.marker([data[row].Latitude, data[row].Longitude]).addTo(
      pointGroupLayer
    );

    // variables for popups
    var bCreated = data[row].Timestamp || 'Not listed'
    var bName = data[row].YourName || 'Not listed'
    var bLocation = data[row].YourLocation || 'Not listed'
    var bYear = data[row].ClassYear || 'Not listed'
    var bStatus = data[row].CurrentStatus || 'Not listed'
    var bURL = data[row].LinkedinURL || '#'
    var bIndustry = data[row].Industry || 'Not listed'
    var bTitle = bName + ", " + bYear;
    var bFunction = bStatus + " | " + bIndustry;

    // POPUPS
    marker.bindPopup('<h3 style="margin:0 0 3px 0;"><a href=' + bURL + '>' + bTitle + '</a></h3>' + bFunction + '<br><br><i>' + 'As of: ' + bCreated + '</i>');

    var companyIcon = L.Icon.extend({
        options: {
            iconSize: [18, 18],
        }
    });

    if(bStatus === 'Military'){
      var ico = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/247/military-medal_1f396.png';
    } else if (bStatus === 'Civilian') {
      var ico = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/openmoji/242/briefcase_1f4bc.png';
    } else {
      var ico = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/samsung/220/waving-black-flag_1f3f4.png';
    }

    var logoIcon = new companyIcon(
        //{ iconUrl: data[row].Logo || 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/briefcase_1f4bc.png' });
        //{ iconUrl: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/emojipedia/132/test-tube_1f9ea.png' });
        { iconUrl: ico });

    marker.setIcon(logoIcon);
  }
  //console.log(data)
}
