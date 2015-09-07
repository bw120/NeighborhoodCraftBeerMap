//ViewModel
var beerMapViewModel = function() {
  var self = this;

  //Get brewery Data from model
  self.brewData = ko.observable( new breweryModel() );
  var venues = self.brewData().venues;

  //Initialize and set up map
  var mapBounds; //variable to hold current bounds
  var maxZoom = 14; //need to set amount map zooms in when there are very few markers shown on the map otherwise it zooms in way too much

  bounds = new google.maps.LatLng(42.3600825, -71.05888010000001); //default bounds

  var mapOptions = {
    zoom: 18,
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

  self.map = ko.observable(new google.maps.Map(document.getElementById("map"), mapOptions));

  mapBounds = new google.maps.LatLngBounds(); //set up variable to hold bounds when markers are applied

  //set bounds of map based on data or search
  var setBounds = function(data) {
    if (data.length > 0) {
      var lat;
      var lng;
      var newBounds = new google.maps.LatLngBounds();
      //if no data is provided set to default bounds
      if (data.length < 1) {
          newBounds.extend(bounds);
      } else {
        for (var i = 0; i < data.length; i++) {
          lat = data[i].location.lat;
          lng = data[i].location.lng;
          newBounds.extend(new google.maps.LatLng(lat, lng));
        }
      }
        self.map().fitBounds(newBounds);
        if (self.map().getZoom() > maxZoom) { self.map().setZoom(maxZoom)}; //make sure it doesn't zoom in too far
        self.map().panTo(newBounds.getCenter());
        mapBounds = newBounds;
    }
  }

  //update bounds when resize browser
  window.addEventListener('resize', function(e) {
    self.map().fitBounds(mapBounds);
    self.map().setCenter(mapBounds.getCenter());
    if (self.map().getZoom() > maxZoom) { self.map().setZoom(maxZoom)}; //adjust zoom if zoomed in too far
  });

  //put markers on the map
  self.mapMarkers = ko.observableArray(); //store markers as an array

  self.setMarkers = ko.computed(function() {
    var self = this;
    var markerArr = [];

    //make sure map is loaded
    if (self.map()) {

      bounds = self.map().getBounds();

      for (i = 0; i < venues.length; i++) {
        markerArr.push( new google.maps.Marker({
          position: {lat: venues[i].location.lat, lng: venues[i].location.lng},
          map: self.map(),
          title: String(i) //set title as the key in breweryInfo array so it is easier to pass into map InfoWindow
          }));
      }
    }

    //assign markers to observable array so we can control them later
    self.mapMarkers(markerArr);
    setBounds(venues);
  }, self);

  //setup map infowindow and add google event listner
  var infowindow = new google.maps.InfoWindow();
  for (var i = 0; i < self.mapMarkers().length; i++) {
    google.maps.event.addListener(self.mapMarkers()[i], 'click', function(e) {openInfoWindow(this);});
  }


  //set content for map info window
  var markerConent = function(data) {
    var content = "<div class='infoWindow'><div class='venueName'>" + data.name + "</div><span class='address'>" +
    data.location.address + "<br />" + data.location.city + ", " + data.location.state + " " + data.location.postalCode + " </span></div>";
    return content;
  };

  //open info window
  var openInfoWindow = function(marker) {

      infowindow.setContent(markerConent(venues[marker.getTitle()]));
      infowindow.open(self.map(), marker);
      self.map().panTo(marker.getPosition());
  };

  //pass info from view to openInfoWindow()
  this.openWindow = function(data) {
     openInfoWindow(self.mapMarkers()[self.brewData().venues.indexOf(data)]);
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
    if (this.activeSearch() === true) {

    
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
    

      //pass the array to function to hide/show markers
      showHideMarkers(self.mapMarkers(), markersToDisplay);
      //reset bounds based on search results
      setBounds(searchMatches);

    } else {
      //if user is not searching it displays all venues
      searchMatches = self.brewData().venues;
      for (var n = 0; n < searchMatches.length; n++ ) {
        markersToDisplay.push(n);
      }
      //pass the array to function to hide/show markers
      showHideMarkers(self.mapMarkers(), markersToDisplay);
      //reset bounds based on search results
      setBounds(searchMatches);

    }
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

  //pass info from view to open display window
  self.detailsOpen = ko.observable(false);
  self.detailsIndex = ko.observable();
  self.brewDetails = ko.observable();
  self.fSqrDetails = ko.observable();
  this.openDetails = function(data) {
    self.detailsOpen(true);
    self.detailsIndex(self.brewData().venues.indexOf(data));
    self.brewDetails(data);
    self.fSqrDetails(self.fSqr()[self.detailsIndex()].fSqrdata.response.venue);
     console.log(self.fSqr()[self.detailsIndex()]);
    };
  this.closeDetails = function(data) {
    self.detailsOpen(false);
  };





//--*****just some lines to help debug. Since a lot of data is async need to put as setTimeout to give it time to load
//setTimeout(function(){console.log(self.untppd()[0].untpdData);}, 3000);




};

ko.applyBindings(new beerMapViewModel());
