/*
 * Script to display two tables from Google Sheets as point using Leaflet
 * The Sheets are then imported using Tabletop.js and overwrite the initially laded layers
 */

// init() is called as soon as the page loads
function init() {
  var pointsURL = "https://docs.google.com/spreadsheets/d/1kIIw9GAvZ1oiKrkii8eT6j_mi_KFgnVLF3b0kRvaLl8/edit?usp=sharing";

  Tabletop.init({ key: pointsURL, callback: addPoints, simpleSheet: true }); // simpleSheet assumes there is only one table and automatically sends its data
}
window.addEventListener("DOMContentLoaded", init);

// Create a new Leaflet map centered on the continental US
var map = L.map("map").setView([39, -98], 5);

// basemap
var Wikimedia = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
	attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
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
    var location = data[row].Location || 'Not listed'
    var addy = data[row].Address || 'Not listed'
    var phone = data[row].Phone || 'Not listed'
    var hours = data[row].Hours || 'Not listed'

    // POPUPS
    marker.bindPopup('<h3 style="margin:0 0 3px 0;">' + location + '</h3>' + 'Address: ' + addy + '<br/>Phone: <a href="tel:' + phone + '">' + phone + '</a>' + '<br/>Hours: ' + hours);

    var companyIcon = L.Icon.extend({
        options: {
            iconSize: [30, 30],
        }
    });
    var logoIcon = new companyIcon(
        //{ iconUrl: data[row].Logo || 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/briefcase_1f4bc.png' });
        { iconUrl: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/emojipedia/132/test-tube_1f9ea.png' });

    marker.setIcon(logoIcon);
  }
  //console.log(data)
}
