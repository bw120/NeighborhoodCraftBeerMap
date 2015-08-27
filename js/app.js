//Initialize and set up map
var map;
var theLocation = "42.3600825, -71.05888010000001";

var initMap = function() {

  var bounds = new google.maps.LatLng(42.3600825, -71.05888010000001);
  var mapOptions = {
    zoom: 13,
    center: bounds,
    mapTypeControl: false,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    panControl: true,
    panControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    }
  }
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
};


///get brewery data from Foursquare
var getBreweryInfo = function() {
  var self = this;
  self.breweryInfo = ko.observableArray();
  self.brewDataFailed = ko.observable(true);
  self.faultReason = ko.observable("Loading data...");


  //set up URL for Ajax request
  var categoryID = "50327c8591d4c4b30a586d5d";
  var radius = "100000";
  var theURL = "https://api.foursquare.com/v2/venues/search?client_id=V5XZKQRSRXGVGCGN5U3YIFCXTIAZWCZA01V3U5ICI4KRNXOX&client_secret=0ATJHEHUGP41GLOHJJS4ACJC3ENKG311BRW2KR510Y2FPSPY&v=20130815&ll=" + theLocation + " &categoryId="+ categoryID + " &intent=browse&radius=" + radius;

  //send AJAX request
  $.getJSON(theURL, function(data){
      var breweryData = data.response.venues;
      var brewArr = [];

      //Foursquare API search by categoryID still gives a few venues not in that category. 
      //So here we have to remove what we don't want.
      for (i = 0; i < breweryData.length; i++) {
        if (breweryData[i].categories[0].id === categoryID) {
          brewArr.push(breweryData[i]);
        }        
      }

      //confirm the ajax search brough up results and set variable to show ajax request was successful 
      //and post results to obserable. Otherwise log fault.
      if (brewArr.length > 0) {
        self.brewDataFailed(false);
        self.breweryInfo(brewArr);   
      } else {
        self.faultReason("Sorry, we were not able to find any breweries");
      }
      

  }).error(function(e) {
    self.faultReason("Sorry, we were not able to load the data");
    console.log("There was an error getting brewery info")});

};


//setup markers on map
var setUpMarkers = function(data, failed) {
    var self = this;
    var markerArr = [];

    //make sure data has loaded then setup markers
    if (failed === false) {
      for (i = 0; i < data.length; i++) {
        markerArr.push( new google.maps.Marker({
          position: {lat: data[i].location.lat, lng: data[i].location.lng},
          map: map,
          title: data[i].name
          }));
      }
    }

    return markerArr;

};


// Knockout ViewModel
var beerMapViewModel = function() {
  var self = this;


  //Get brewery Data
  self.brewData = ko.observable( new getBreweryInfo() );

  //put markers on the map
  var setMarkers;
  //set up markers in a computed observable so that it gets caluclated when ajax data becomes available since it is async
  self.setMarkers = ko.computed(function() {
    setMarkers = setUpMarkers(self.brewData().breweryInfo(), self.brewData().brewDataFailed());
    //set up observable array of markers so we can control them later
    self.mapMarkers = ko.observableArray(setMarkers);
    return setMarkers;

  }, this);




setTimeout(function(){console.log(self.mapMarkers()[1].map);}, 4000);




};

ko.applyBindings(new beerMapViewModel());
