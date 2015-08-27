####################
//working on:
//-changing over markers and brew data into regular oo java script similar to game


#####################


//map functions
var map;

  var initMap = function() {

    var bounds = new google.maps.LatLng(42.3600825, -71.05888010000001);
    var mapOptions = {
      zoom: 14,
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
  }


///function for getting and manipulating brewery data
var BreweryData = function() {


    this.markers = [];
    self.breweryInfo = ko.observableArray();
    self.brewDataFailed = ko.observable(true);
    self.faultReason = ko.observable("Loading data...");

    this.theCity = "Boston, MA";
    this.theQuery = "brewery";
    this.theURL = "https://api.foursquare.com/v2/venues/explore?client_id=V5XZKQRSRXGVGCGN5U3YIFCXTIAZWCZA01V3U5ICI4KRNXOX&client_secret=0ATJHEHUGP41GLOHJJS4ACJC3ENKG311BRW2KR510Y2FPSPY&v=20130815&ll=40.7,-74&query=" + this.theQuery + "&near=" + this.theCity;

}

//setup markers on map
BreweryData.prototype.setUpMarkers = function(data) {

    for (i = 0; i < data.length; i++) {
      markers.push( new google.maps.Marker({
        position: {lat: data[i].venue.location.lat, lng: data[i].venue.location.lng},
        map: map,
        title: data[i].venue.name
        }));  
    }
};

//pull down data from Foursquare
BreweryData.prototype.getData = function() {


    //set up URL for Ajax request

    $.getJSON(this.theURL, function(data){
        //get JSON and assign to KO ObservableArray
        var breweryData = data.response.groups[0].items;
        console.log(breweryData);
        this.brewDataFailed = false;
        console.log(this.brewDataFailed);
        this.setUpMarkers(breweryData);
        this.breweryInfo = breweryData;


    }).error(function(e) {
      this.faultReason = "Sorry, we were not able to load data";
      console.log("There was an error getting brewery info")});

}



// Knockout ViewModel
var beerMapViewModel = function() {
  var self = this;

  // Data
  //set it up as an instance so that later on can put in multiple searches such as different cities
  //or home brew shops or good craft beer restaraunts/bars
  this.brewData = new BreweryData();
  this.brewData.getData();
  // Behaviors
  //initMap();



    //setUpMarkers();
// setTimeout(function(){console.log(self.brewData().breweryInfo()[0].venue.location.lat);}, 5000);   
//setTimeout(function(){setUpMarkers(); console.log(markers);}, 5000);



};

ko.applyBindings(new beerMapViewModel());
