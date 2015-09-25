//ViewModel
var beerMapViewModel = function() {
  var self = this;

  //Get brewery Data from model
  self.brewData = ko.observable( new breweryModel() );
  var venues = self.brewData().venues;

  //variables to control which screens show
  self.detailsOpen = ko.observable(false);
  self.summaryOpen = ko.observable(false);
  self.listView = ko.observable(true); //needs to start as false if using display none to hide/show list and map or map won't start up
  var previouseMode = true;

  //Initialize and set up map
  var maxZoom = 13; //need to set amount map zooms in when there are very few markers shown on the map otherwise it zooms in way too much
  var currMapCenter; //stores current map center to be used for browser resize
  var mapBounds;
  var mapCenterXoffset = "-295"; //offset position of map to account for the search and brewery list covering up some of the map
  var mapCenterYoffset = "-370"; //offset position of map to account for details window covering up map

  //default bounds
  bounds = new google.maps.LatLng(42.3600825, -71.05888010000001);

  //set up map style options
  var customMapType = new google.maps.StyledMapType([
    {
      "stylers": [
        { "visibility": "simplified" },
        { "weight": 2.4 }
      ]
    },{
      "featureType": "water",
      "stylers": [
        { "color": "#004F9E" }
      ]
    },{
      "featureType": "landscape",
      "stylers": [
        { "lightness": -19 }
      ]
    },{
      "featureType": "road",
      "stylers": [
        { "weight": 1.1 },
        { "saturation": -29 },
        { "visibility": "simplified" }
      ]
    }
  ]);
  var customMapTypeId = 'custom_style';

  //set up map options
  var mapOptions = {
    zoom: 18,
    center: bounds,
    mapTypeControl: false,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.LEFT_TOP
    }
  }

  self.map = ko.observable(new google.maps.Map(document.getElementById("map"), mapOptions));
  self.map().mapTypes.set(customMapTypeId, customMapType);
  self.map().setMapTypeId(customMapTypeId);


  //calculate offset for position of venue list and details window
  var getOffsetPoint = function (latlng, offsetx, offsety) {

    var scale = Math.pow(2, self.map().getZoom());

     if (self.map().getProjection()) {
    var wcCenter = self.map().getProjection().fromLatLngToPoint(latlng);
    var pOffset = new google.maps.Point((offsetx/scale) || 0, (offsety/scale) || 0);


    var wcNewCenter = new google.maps.Point(
    wcCenter.x - pOffset.x,
    wcCenter.y - pOffset.y
    );
    var newCenter = self.map().getProjection().fromPointToLatLng(wcNewCenter)


    return newCenter;
    } else {
      return latlng;
    }
  }

  //set bounds of map based on data or search
  var setBounds = function(data) {

    if (data.length > 0) {
      var lat;
      var lng;
      var offsetPoint;
      var mostEast = data[0].location.lng;
      var mostSouth = data[0].location.lat;
      var newBounds = new google.maps.LatLngBounds();
      self.map().setZoom(14);
      //find the most east and most south coordinates
      for (var i = 0; i < data.length; i++) {
        lat = data[i].location.lat;
        lng = data[i].location.lng;
        newBounds.extend(new google.maps.LatLng(lat, lng));

        if (lng > mostEast) {
          mostEast = lng;
        }
        if (lat < mostSouth) {
          mostSouth = lat;
        }
      }
      //create an imaginary point to the east and south of all the venues so that it gives room on the right and bottom
      //for venue list and details window
      offsetPoint = new google.maps.LatLng(mostSouth, mostEast);
      var yOffset = (self.detailsOpen() === true) ? mapCenterYoffset : "0";
      newBounds.extend(getOffsetPoint(offsetPoint, mapCenterXoffset, yOffset));



      self.map().fitBounds(newBounds);


    if (self.map().getZoom() > maxZoom) { self.map().setZoom(maxZoom)}; //make sure it doesn't zoom in too far


    }
    //set map center to be referenced in case browser resize
    currMapCenter = self.map().getCenter();
    mapBounds = newBounds;
  }

  //re-center map when resize browser
  window.addEventListener('resize', function(e) {
    self.map().fitBounds(mapBounds);
    self.map().setCenter(currMapCenter);
  });


  //put markers on the map
  self.mapMarkers = ko.observableArray(); //store markers as an array

  self.setMarkers = ko.computed(function() {
    var self = this;
    var markerArr = [];

    //make sure map is loaded
    if (self.map()) {

      for (i = 0; i < self.brewData().venues.length; i++) {
        markerArr.push( new google.maps.Marker({
          position: {lat: self.brewData().venues[i].location.lat, lng: self.brewData().venues[i].location.lng},
          map: self.map(),
          title: String(i) //set title as the key in breweryInfo array so it is easier to pass into map InfoWindow
          }));
      }
    }

    //assign markers to observable array so we can control them later
    self.mapMarkers(markerArr);
  }, self);

  //setup map infowindow and add google event listner
  var infowindow = new google.maps.InfoWindow();
  for (var i = 0; i < self.mapMarkers().length; i++) {
    google.maps.event.addListener(self.mapMarkers()[i], 'click', function(e) {openInfoWindow(this);});
  }


  //set content for map info window
  var markerContent = function(data) {
    var content = "<div class='infoWindow'><div class='breweryDetailName'>" + data.name + "</div><span class='info'>" +
    data.location.address + "<br />" + data.location.city + ", " + data.location.state + " " + data.location.postalCode + " </span></div>";
    return content;
  };

  //open info window and display info on summary div
  var openInfoWindow = function(marker) {
      self.openSummary(venues[marker.getTitle()]); //display on summary window
      infowindow.setContent(markerContent(venues[marker.getTitle()]));
      infowindow.open(self.map(), marker);
      self.map().panTo(marker.getPosition());
      self.animateMarker(marker);

  };

//sets bounce animation on selected marker and stops animation on all others
  this.animateMarker = function(marker) {
    for (var i = 0; i < self.mapMarkers().length; i++) {
      self.mapMarkers()[i].setAnimation(null);
    }
    marker.setAnimation(google.maps.Animation.BOUNCE);

  }

  //pass info from view to openInfoWindow()
  this.openWindow = function(data) {

    openInfoWindow(self.mapMarkers()[self.brewData().venues.indexOf(data)]);
    self.openSummary(data);

    if (self.detailsOpen() === true) {
      var markerToDisplay = [self.brewData().venues.indexOf(data)];
      showHideMarkers(self.mapMarkers(), markerToDisplay);
      self.openDetails(data);
    }
  };


  //hide or show markers based on search input
  var showHideMarkers = function(markers, markersToShow) {

    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    for (var n = 0; n < markersToShow.length; n++) {
      markers[markersToShow[n]].setMap(self.map());
    }
  };

  //Search
  this.searchKey = ko.observable("Search"); //default value displays in search box until you click on it
  this.activeSearch = ko.observable(false); //is the user activly trying to search
  //clear search box when user clicks and set activeSearch to true
  this.clearSearch = function() {
    if (this.activeSearch() === false) {
      this.searchKey("");
      this.activeSearch(true);
    }

  };

  this.cancelSearch = function() {
    this.activeSearch(false);
    this.searchKey("Search");

  }

  //as the user types a query this function checks user input against venue name
  self.breweryDisplay = ko.computed(function() {
    var searchMatches = [];
    var markersToDisplay = [];
    if (this.activeSearch() === true && self.map()) {


      var searchArr = this.searchKey().toLocaleLowerCase().split(" ");
      var brewName;
      var match;
      var wordsArr;
      var strLength;

      //go through the names of each brewery names split into arrays containg each separate word. Then compare that to an array from words in search box
      for (i = 0; i < self.brewData().venues.length; i++) {
          brewName = self.brewData().venues[i].name;
          brewName.toLocaleLowerCase();
          match = false;
          wordsArr = brewName.split(" ");

          for (var n = 0; n < wordsArr.length; n++ ) {
              for (var e = 0; e < searchArr.length; e++ ) {
                strLength = searchArr[e].length;
                  if ( wordsArr[n].substring(0, strLength).toLocaleLowerCase() === searchArr[e].toLocaleLowerCase()) {
                    match = true;
                  }

              }
          }

          if (match === true) {
            searchMatches.push(self.brewData().venues[i]);
            //make an array of index of items that get returned in search. This gets used to show/hide markers on map
            markersToDisplay.push(i);
          }
      }



    } else {
      //if user is not searching it displays all venues
      searchMatches = self.brewData().venues;
      for (var n = 0; n < searchMatches.length; n++ ) {
        markersToDisplay.push(n);
      }

    }
    //pass the array to function to hide/show markers
    showHideMarkers(self.mapMarkers(), markersToDisplay);
    //reset bounds based on search results
    setBounds(searchMatches);

    return searchMatches;
  }, self);


  //get info from FourSquare for each venue
  self.fSqr = ko.observableArray();
  for (var i = 0; i < venues.length; i++) {
    self.fSqr.push(new getFsqrInfo(venues[i].fSqrID));
  };

//#####need to change 1 to venues.length before finalizing. Put as one for testing to prevent going over rate limit
  //get info from Untappd for each brewery
  self.untppd = ko.observableArray();
  for (var i = 0; i < 1; i++) {
    //self.untppd.push(new getUntppdInfo(venues[i].untppdID)); //-->commented out to reduce # of request so you don't go over
  };
self.untppd(untappdData); //set to temp data just for texting.
// console.log(self.untppd()[1].response.brewery_label);
  for (var i = 0; i < self.brewData().venues.length; i++) {
    self.brewData().venues[i].logoURL = self.untppd()[i].untpdData.response.brewery.brewery_label;
  }




  //functions to switch view in app
  this.toggleView = function() {
    if (self.listView() === false) {
      self.listView(true);
    } else {
      self.listView(false);
    }
    previouseMode = self.listView();
  };

  //pass info from view to open display window
  self.detailsIndex = ko.observable();
  self.brewDetails = ko.observable();
  self.fSqrDetails = ko.observable();
  self.untppdDetails = ko.observable();

  this.theWrap = ko.pureComputed(function() {
        return self.detailsOpen() === true ? "column" : "noWrap";
  });

this.test = function() {
console.log("opened");
};

  this.openDetails_mobile = function(data) {
    previouseMode = self.listView();
    self.listView(false);
    self.openDetails(data);

  }

  this.openDetails = function(data) {

    self.detailsIndex(self.brewData().venues.indexOf(data));
    self.brewDetails(data);
    self.fSqrDetails(self.fSqr()[self.detailsIndex()].fSqrdata.response.venue);
    self.untppdDetails(self.untppd()[self.detailsIndex()].untpdData.response.brewery);
    self.detailsOpen(true);

    //update map to show venue selected
    var markerToDisplay = [self.brewData().venues.indexOf(data)];

    showHideMarkers(self.mapMarkers(), markerToDisplay);


    openInfoWindow(self.mapMarkers()[self.detailsIndex()]);
    self.map().setZoom(14);
    setBounds(new Array(data));
  };

  this.openSummary = function(data) {

    self.detailsIndex(self.brewData().venues.indexOf(data));
    self.brewDetails(data);
    self.fSqrDetails(self.fSqr()[self.detailsIndex()].fSqrdata.response.venue);
    self.untppdDetails(self.untppd()[self.detailsIndex()].untpdData.response.brewery);
    self.summaryOpen(true);


  };
  this.closeSummary = function(data) {
    self.summaryOpen(false);

  };

  self.closeDetails = function(data) {
    var search = self.searchKey();

    self.detailsOpen(false);
    if ( self.activeSearch() === true ) {
      self.cancelSearch();
      self.clearSearch();
      self.searchKey(search);
    } else {
      self.clearSearch();
      self.cancelSearch();
    }
    self.listView(previouseMode);
    self.detailsOpen(false);

  };


//--*****just some lines to help debug. Since a lot of data is async need to put as setTimeout to give it time to load
// setTimeout(function(){
//     if ( self.activeSearch() === true ) {
//       self.cancelSearch();
//       self.clearSearch();
//       self.searchKey(search);
//     } else {
//       self.clearSearch();
//       self.cancelSearch();
//     }
//   }, 2000);




};

ko.applyBindings(new beerMapViewModel());
