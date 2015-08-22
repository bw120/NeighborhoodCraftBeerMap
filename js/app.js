//Initialize and set up the Google Map
var map;
var geocoder;

  function initMap() {

    var latlng = new google.maps.LatLng(42.3600825, -71.05888010000001);
    var mapOptions = {
      zoom: 14,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // geocoder = new google.maps.Geocoder();
  //   var myAddress = "Boston, MA";
  //   console.log(geocoder.geocode);
  //   geocoder.geocode( { 'address': myAddress}, function(results, status) {
  //   if (status == google.maps.GeocoderStatus.OK) {
  //     //map.setCenter(results[0].geometry.location);
  //     console.log(results[0].geometry.location);
  //     map.setZoom(14);
  //       // var marker = new google.maps.Marker({
  //       //     map: map,
  //       //     position: results[0].geometry.location
  //       // });
  //       console.log("successful");
  //   } else {
  //     console.log("Geocode was not successful for the following reason: " + status);
  //   }
  // });

  }

var getBreweryInfo = function() {
  var self = this;
  self.breweryInfo = ko.observableArray();
  self.brewDataFailed = ko.observable(true);
  self.faltReason = ko.observable("Loading data...");

  //set up URL for Ajax request
  var theCity = "Boston, MA";
  var theQuery = "brewery";
  var theURL = "https://api.foursquare.com/v2/venues/explore?client_id=V5XZKQRSRXGVGCGN5U3YIFCXTIAZWCZA01V3U5ICI4KRNXOX&client_secret=0ATJHEHUGP41GLOHJJS4ACJC3ENKG311BRW2KR510Y2FPSPY&v=20130815&ll=40.7,-74&query=" + theQuery + "&near=" + theCity;

  $.getJSON(theURL, function(data){
      //pull out relavant data and arrange into an observable array
      var breweryData = data.response.groups[0].items;
      var breweryArr = [];
      $.each(data.response.groups[0].items, function(key, val){
        breweryArr.push({ name: breweryData[key].venue.name, address: breweryData[key].venue.location.address} );
      });
      self.brewDataFailed(false);
      self.breweryInfo(breweryArr);

  }).error(function(e) {
    self.faltReason("Sorry, we were not able to load data");
    console.log("There was an error getting brewery info")});
  console.log(self.brewDataFailed());
}



// Knockout ViewModel
var beerMapViewModel = function() {
  var self = this;

  // Data
  //set it up as an instance so that later on can put in multiple searches such as different cities
  //or home brew shops or good craft beer restaraunts/bars
  self.brewData = ko.observable( new getBreweryInfo());

  // Behaviors




};

ko.applyBindings(new beerMapViewModel());
