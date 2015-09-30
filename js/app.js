//functions to pull data from API's. Saves data to local storage.

//Foursquare API
var getFsqr = function(venues) {
  var self = this;
  self.failed = ko.observable(true);  //variable gets sets to false when API info becomes available
  self.fSqrdata = ko.observableArray();

    //check if info is in local storage.
    if(localStorage && localStorage.getItem(venues)) {
      //pull from storage and parse JSON
      self.fSqrdata(JSON.parse(localStorage.getItem(venues)));
      self.failed(false);

    //if not in local storage submit ajax reques
    } else {
      t
      //set up URL for Ajax request
      var theURL = "https://api.foursquare.com/v2/venues/" + venues + "?client_id=V5XZKQRSRXGVGCGN5U3YIFCXTIAZWCZA01V3U5ICI4KRNXOX&client_secret=0ATJHEHUGP41GLOHJJS4ACJC3ENKG311BRW2KR510Y2FPSPY&v=20130815";

      //send AJAX request
      $.getJSON(theURL, function(data){
        self.failed(false);
        self.fSqrdata(data.response.venue);

        //post to localstorage for later
        if(localStorage){
          localStorage.setItem(data.response.venue.id, JSON.stringify(data.response.venue));
        }

      }).error(function(e) {
        self.failed(true);
        console.log("Failed loading foursquare data");
      });
    };
};

//Untappd.com API
//This API only allows 100 request per hour. Need to save data to local storage so you don't over tax usage rate
var getUntppdInfo = function(brewID) {
  var self = this;
  var uData;
  self.failed = ko.observable(true); //variable gets sets to false when API info becomes available
  self.untpdData = ko.observableArray();

    if(localStorage && localStorage.getItem(brewID)) {
      //pull info from storage and parse JSON
      uData = {};
      uData = JSON.parse(localStorage.getItem(brewID));
      self.failed(false);
      self.untpdData(uData);
    } else {
      //if not in storage, get from server
      //set up URL for Ajax request
      var theURL = "https://api.untappd.com/v4/brewery/info/" + brewID + "?client_id=843AB98C14A5E4578E32F40DD6E2BCD98B9B3788&client_secret=1A64FCE056044C2F39D1D0A90A4E8B0415C34991";

      //send AJAX request
      $.getJSON(theURL, function(data){
        self.untpdData(data);
        self.failed(false);
        //post to localstorage for later
        if(localStorage){
          localStorage.setItem(brewID, JSON.stringify(data));
         }
      }).error(function(e) {
        console.log("Failed loading Untappd");
        self.failed(true);
      });
    };
};


//ViewModel
var beerMapViewModel = function() {
  var self = this;

  //Get brewery Data from model
  self.brewData = ko.observable( new breweryModel() );
  var venues = self.brewData().venues;

  //variables to control which screens show
  self.listView = ko.observable(true); //for small screens this controls whether the list or map is visible
  self.detailsOpen = ko.observable(false);
  self.summaryOpen = ko.observable(false);
  self.detailsIndex = ko.observable(); //index of which item to display in summary or details window.
  var previouseMode = true; //holds previous state of self.detailsIndex so that it can be restored when details window closes


  //Initialize and set up map
  var maxZoom = 13; //need to set amount map zooms in when there are very few markers shown on the map otherwise it zooms in way too much
  var currMapCenter; //stores current map center to be used for browser resize
  var mapBounds;
  var mapCenterXoffset = "-750"; //offset position of map to account for the search and brewery list covering up some of the map
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
  };

  //initialize the map
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);


  //calculates an offset point used to make room on map where the 
  //list and details window covering up portions of the map
  var getOffsetPoint = function (latlng, offsetx, offsety) {

    var scale = Math.pow(2, map.getZoom());

    if (map.getProjection()) {
      var wcCenter = map.getProjection().fromLatLngToPoint(latlng);
      var pOffset = new google.maps.Point((offsetx/scale) || 0, (offsety/scale) || 0);

      var wcNewCenter = new google.maps.Point(
        wcCenter.x - pOffset.x,
        wcCenter.y - pOffset.y
      );
      var newCenter = map.getProjection().fromPointToLatLng(wcNewCenter)
      return newCenter;
    } else {
      return latlng;
    }
  };

  //set bounds of map based on data or search
  var setBounds = function(data) {

    if (data.length > 0) {
      var lat;
      var lng;
      var offsetPoint;
      var mostEast = data[0].location.lng;
      var mostSouth = data[0].location.lat;
      var newBounds = new google.maps.LatLngBounds();
      map.setZoom(11);

      //add each location to the map bounds
      for (var i = 0; i < data.length; i++) {
        lat = data[i].location.lat;
        lng = data[i].location.lng;
        newBounds.extend(new google.maps.LatLng(lat, lng));

        //find the most east and most south coordinates to be used to
        //create offset point to make room for list and details windows

        if (lng > mostEast) {
          mostEast = lng;
        }
        if (lat < mostSouth) {
          mostSouth = lat;
        }
      }

      offsetPoint = new google.maps.LatLng(mostSouth, mostEast);
      var yOffset = (self.detailsOpen() === true) ? mapCenterYoffset : "0"; //if details open it gives more room at bottom of map
      var xOffset = (self.listView() === true) ? mapCenterXoffset : "0"; //if list is not visible on (on Mobile sizes) it doesn't give extra room on right
      newBounds.extend(getOffsetPoint(offsetPoint, xOffset, yOffset));

      map.fitBounds(newBounds);

      if (map.getZoom() > maxZoom) { map.setZoom(maxZoom)}; //make sure it doesn't zoom in too far
    }

    //set map center to be referenced incase of browser resize
    currMapCenter = map.getCenter();
    mapBounds = newBounds;
  };

  //re-center map when resize browser
  window.addEventListener('resize', function(e) {
    map.fitBounds(mapBounds);
    map.setCenter(currMapCenter);
  });


  //put markers on the map
  self.mapMarkers = ko.observableArray(); //store markers as an array

  self.setMarkers = ko.computed(function() {
    var self = this;
    var markerArr = [];

    //make sure map is loaded
    if (map) {

      for (i = 0; i < self.brewData().venues.length; i++) {
        markerArr.push( new google.maps.Marker({
          position: {lat: self.brewData().venues[i].location.lat, lng: self.brewData().venues[i].location.lng},
          map: map,
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
  };


  //set content for map info window
  var markerContent = function(data) {
    var content = "<div class='infoWindow'><div class='breweryDetailName'>" + data.name + "</div><span class='info'>" +
    data.location.address + "<br />" + data.location.city + ", " + data.location.state + " " + data.location.postalCode + " </span></div>";
    return content;
  };

  //open info window and display info on summary div
  var openInfoWindow = function(marker) {
      self.openSummary(venues[marker.getTitle()]); //display on summary window
      infowindow.setContent(markerContent(venues[marker.getTitle()])); //set content
      infowindow.open(map, marker); //open info window
      map.panTo(marker.getPosition()); //center map on marker
      animateMarker(marker); //make marker bounce
  };

  //sets bounce animation on selected marker and stops animation on all others
  var animateMarker = function(marker) {
    for (var i = 0; i < self.mapMarkers().length; i++) {
      self.mapMarkers()[i].setAnimation(null);
    }
    marker.setAnimation(google.maps.Animation.BOUNCE);
  };

  //When item on menu is clicked, open infoWindow and update info on details window
  self.openWindow = function(data) {

    openInfoWindow(self.mapMarkers()[data.index]);

    if (self.detailsOpen() === true) {
      showHideMarkers(self.mapMarkers(), [data.index]);
      self.openDetails(data);
    }
  };


  //hide or show markers based on search input
  var showHideMarkers = function(markers, markersToShow) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    for (var n = 0; n < markersToShow.length; n++) {
      markers[markersToShow[n]].setMap(map);
    }
  };

  //Search
  self.searchKey = ko.observable("Search"); //default value displays in search box until you click on it
  self.activeSearch = ko.observable(false); //is the user activly trying to search
  //clear search box when user clicks and set activeSearch to true
  self.clearSearch = function() {
    if (self.activeSearch() === false) {
      self.searchKey(""); //remove "search" from text input
      self.activeSearch(true);
    }
  };

  //cancel/clear search
  self.cancelSearch = function() {
    self.activeSearch(false);
    self.searchKey("Search"); //put "search" back into text input when search is no longer active
  };

  //as the user types a query this function checks user input against venue name
  self.breweryDisplay = ko.computed(function() {
    var searchMatches = [];
    var markersToDisplay = [];
    if (self.activeSearch() === true && map) {

      var searchArr = self.searchKey().toLocaleLowerCase().split(" ");
      var brewName;
      var match;
      var wordsArr;
      var strLength;

      //go through the names of each brewery names and make an array of each word. 
      //then compare each word to the user input
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
    self.fSqr().push(new getFsqr(venues[i].fSqrID))
  };

  //get info from Untappd for each brewery
  self.untppd = ko.observableArray();

  for (var i = 0; i < venues.length; i++) {
    self.untppd.push(new getUntppdInfo(venues[i].untppdID));
  };

  //sets generic logo for each venue and updates with actual logo if/when API returns logo URL
  self.logos = ko.computed(function() {
    var logoArr = [];
    for (var i = 0; i < self.brewData().venues.length; i++) {
      if (self.untppd()[i].failed() === false) {
        logoArr.push(self.untppd()[i].untpdData().response.brewery.brewery_label);
      } else {
        logoArr.push("images/genericBrew.png");
      }
    }
    return logoArr;
  }, self);

  //toggle between list view and map view on small screen sizes
  self.toggleView = function() {
    if (self.listView() === false) {
      self.listView(true);
    } else {
      self.listView(false);
    }
    previouseMode = self.listView();
  };

  //sets some additional variables when opening details on small screens
  self.openDetails_mobile = function(data) {
    previouseMode = self.listView();//needs to remember previous view for when window closes
    self.listView(false); //turns off list view so list is not visible
    self.openDetails(data);
  };

  //opens details window
  self.openDetails = function(data) {

    self.detailsIndex(data.index);
    self.detailsOpen(true);

    //show only the marker for selected venue
    showHideMarkers(self.mapMarkers(), [data.index]);
    //open map marker infowindow
    openInfoWindow(self.mapMarkers()[self.detailsIndex()]);
    map.setZoom(14); //zoom in
    setBounds([data]); //set bounds to just this one item
  };

  //open summary window and update index of item to be shown
  self.openSummary = function(data) {
    self.detailsIndex(data.index);
    self.summaryOpen(true);
  };

  //close summary window
  self.closeSummary = function(data) {
    self.summaryOpen(false);
  };

  //close details window
  self.closeDetails = function(data) {
    var search = self.searchKey(); //remeber search input

    //close window
    self.detailsOpen(false);

    //reset search to that of before details window was opened
    if ( self.activeSearch() === true ) {
      self.cancelSearch();
      self.clearSearch();
      self.searchKey(search);
    } else {
      self.clearSearch();
      self.cancelSearch();
    }
    //reset the view (map or list on small screen sizes) to previous setting
    self.listView(previouseMode);
  };
};

ko.applyBindings(new beerMapViewModel());
