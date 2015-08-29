//Initialize and set up map
var map;
var theLocation = "42.3863249267138, -71.14662318695514";
var mapBounds;
var bounds;

var initMap = function() {

  bounds = new google.maps.LatLng(42.3600825, -71.05888010000001);
  var mapOptions = {
    zoom: 12,
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
  mapBounds = new google.maps.LatLngBounds();
};

//  update bounds when resize browser
window.addEventListener('resize', function(e) {
  map.fitBounds(mapBounds);
  map.setCenter(mapBounds.getCenter());
});

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
          title: String(i) //set title as the key in breweryInfo array so it is easier to pass into map InfoWindow
          }));
      }
    }
    return markerArr;
};

//set content for map info window
var markerConent = function(data) {
  var content = "<div class='infoWindow'><div class='venueName'>" + data.name + "</div><span class='address'>" + 
  data.location.address + "<br />" + data.location.city + ", " + data.location.state + " " + data.location.postalCode + " </span></div>";
  return content;
};

//open info window
var openInfoWindow = function(data, marker) {
    infowindow.setContent(markerConent(data[marker.getTitle()]));
    infowindow.open(map, marker);
    map.panTo(marker.getPosition());
};

//setup map info window and add event listner
var infowindow;
var setUpInfoWindows = function(data, markers, failed) {
    var self = this;

    //make sure data has loaded then setup markers
    if (failed === false && markers().length > 0) {
      infowindow = new google.maps.InfoWindow();
      
      for (var i = 0; i < markers().length; i++) {
        google.maps.event.addListener(markers()[i], 'click', function(e) {openInfoWindow(data, this);});
      }    
    }
};
//set bounds of map based on data returned from ajax/search
var setBounds = function(data) {

  var lat;
  var lng;

  for (var i = 0; i < data.length; i++) {
    lat = data[i].location.lat;
    lng = data[i].location.lng;
    mapBounds.extend(new google.maps.LatLng(lat, lng));
  }
  if (mapBounds) {
    map.fitBounds(mapBounds);
    map.setCenter(mapBounds.getCenter());
  }
  //console.log(map.getBounds());
}


///get brewery data from Foursquare
var getBreweryInfo = function() {
  var self = this;
  self.breweryInfo = ko.observableArray();
  self.brewDataFailed = ko.observable(true);
  self.faultReason = ko.observable("Loading data...");


  //set up URL for Ajax request
  var categoryID = "50327c8591d4c4b30a586d5d";
  var radius = "35000";
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
        self.breweryInfo(brewArr);
        self.brewDataFailed(false);
           
      } else {
        self.faultReason("Sorry, we were not able to find any breweries");
      }
      

  }).error(function(e) {
    self.faultReason("Sorry, we were not able to load the data");
    //console.log("There was an error getting brewery info")
  });

};


// Knockout ViewModel
var beerMapViewModel = function() {
  var self = this;


  //Get brewery Data
  self.brewData = ko.observable( new getBreweryInfo() );

  //put markers on the map
  //used a computed observable so that it gets caluclated when ajax data becomes available
  self.setMarkers = ko.computed(function() {
    var markers = setUpMarkers(self.brewData().breweryInfo(), self.brewData().brewDataFailed());
    //set up observable array of markers so we can control them later
    self.mapMarkers = ko.observableArray(markers);
    setBounds(self.brewData().breweryInfo());
  }, self);

  //set up info windows
  self.infoWindows = ko.computed(function() {
    var iWindows = setUpInfoWindows(self.brewData().breweryInfo(), self.mapMarkers, self.brewData().brewDataFailed());
  });
    
//pass info from interface to openInfoWindow()
  this.openWindow = function(data) {
   openInfoWindow(self.brewData().breweryInfo(), self.mapMarkers()[self.brewData().breweryInfo().indexOf(data)]);
  };

//Search 
  this.searchKey = ko.observable("Search");
  this.activeSearch = ko.observable(false);
  this.clearSearch = function() {
    if (this.activeSearch() === false) {
      this.searchKey("");
      this.activeSearch(true);
    }

  };

  self.breweryDisplay = ko.computed(function() {
    var searchMatches = [];
    if (self.brewData().brewDataFailed() === false && this.activeSearch() === true) {
      
      //var strToMatch;
      var searchArr = this.searchKey().toLocaleLowerCase().split(" ");
      var brewName;
      var match;
      var wordsArr;
      var strLength;
      //go through the names of each brewery split names into arrays containg each separat word. Then compare that to an array from words in search box
      for (i = 0; i < self.brewData().breweryInfo().length; i++) {
          //strToMatch = self.brewData().breweryInfo()[i].name.substring(0, this.searchKey().length).toLocaleLowerCase();
          brewName = self.brewData().breweryInfo()[i].name;
          brewName.toLocaleLowerCase();
          match = false;
          wordsArr = brewName.split(" ");


          // if (this.searchKey().toLocaleLowerCase() === strToMatch) {
          //   match = true;
          //   //searchMatches.push(self.brewData().breweryInfo()[i]);
          // }
          
            for (var n = 0; n < wordsArr.length; n++ ) {
                for (var e = 0; e < searchArr.length; e++ ) {
                  strLength = searchArr[e].length;
                    if ( wordsArr[n].substring(0, strLength).toLocaleLowerCase() === searchArr[e].toLocaleLowerCase()) {
                      match = true;
                    }
                    
                }
            }

          if (match === true) {
            searchMatches.push(self.brewData().breweryInfo()[i]);
          }
      }

    } else {
      searchMatches = self.brewData().breweryInfo();
    }
    return searchMatches;
  }, self);


//--*****just some lines to help debug. 
//setTimeout(function(){console.log(self.breweryDisplay());}, 3000);






};

ko.applyBindings(new beerMapViewModel());
