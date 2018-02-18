var locations = [
    {
        name: "The Bakery Shop(TBS)",
        lat: 30.0562148,
        lng: 31.2207747,
        id: "4cb7e15f7148f04d6bdacbab"
    },
    
    {
        name: "Mori Sushi",
        lat: 30.0533673,
        lng: 31.2340109,
        id: "4ca4d201a73cb60cdb6f2478"
    },
    {
        name: "Porta Doro",
        lat: 30.0503617,
        lng: 31.201034,
        id: "52a23ff4498e1aa1e4b3cfd2"
    },
    
    {
        name: "Koshary Abou Tarek",
        lat: 30.0494867,
        lng: 31.237302,
        id: "4cd3ff596be6a143fbce9702"
    },
    {
        name: "Left Bank",
        lat: 30.073007,
        lng: 31.2219145,
        id: "4f1ee4c0e4b072d9c542d75f"
    },
    {
        name: "paul",
        lat: 30.0796238,
        lng: 31.2132683,
        id: "50f041fce4b0ac0ec7b386cd"
    }
    
];

var map;
function initMap() {
    var uluru = {lat:30.0562148, lng:31.2207747};
    map = new google.maps.Map(document.getElementById('map'), {
        center:uluru,
        zoom: 13
    });
    ko.applyBindings(new ViewModel());
}

function Error_map_handel(){

    alert('Something error During Loading Map');
  
  }

var Place_info = function (data) 
{
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.id = ko.observable(data.id);
    this.marker = ko.observable();
    this.phone = ko.observable('');
    this.address = ko.observable('');
    this.url = ko.observable('');
    this.photo_Prefix = ko.observable('');
    this.photo_Suffix = ko.observable('');
    this.content_String = ko.observable('');
};

var ViewModel = function () {
    var self = this;

    this.placeList = ko.observableArray([]);
    locations.forEach(function (places) {
        self.placeList.push(new Place_info(places));
    });

    var infowindow = new google.maps.InfoWindow();

    var marker;
    self.placeList().forEach(function (places) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(places.lat(), places.lng()),
            map: map,
            animation: google.maps.Animation.DROP
        });
        url ='https://api.foursquare.com/v2/venues/' + places.id() +
        '?client_id=OBOTTJRB4AG0W2CVUWOJWEDGIIVPK2OGH2CWLSZ14BQWMDDV&client_secret=U1PD2JNQW4QPGOUTOWN1QNRJWHNNPTB00NMXRHN1HEPKFZCX&v=20130815'; 
        places.marker = marker;
        $.ajax({
            url: url, 
            dataType: "json",
            success: function (data) {
                var contact = data.response.venue.hasOwnProperty('contact') ? data.response.venue.contact : '';
              
                var location = data.response.venue.hasOwnProperty('location') ? data.response.venue.location : '';
               
                var bestPhoto = data.response.venue.hasOwnProperty('bestPhoto') ? data.response.venue.bestPhoto : '';
            
                var url = data.response.venue.hasOwnProperty('url') ? data.response.venue.url : '';
                places.url(url || 'Not available');

                if (contact.hasOwnProperty('formattedPhone')) {
                    places.phone(contact.formattedPhone || '');
                }
        
                if (location.hasOwnProperty('address')) {
                    places.address(location.address || '');
                }

                if (bestPhoto.hasOwnProperty('prefix')) {
                    places.photo_Prefix(bestPhoto.prefix || '');
                }

                if (bestPhoto.hasOwnProperty('suffix')) {
                    places.photo_Suffix(bestPhoto.suffix || '');
                }

                var content_String = `<div id="iWindow">
                                    <h4>${places.name()}</h4>
                                    <div id="image">
                                    <img src=${places.photo_Prefix()}110x110${places.photo_Suffix()} alt="Image Location">
                                    </div>
                                    <p>${places.phone()}</p>
                                    <p>${places.address()}</p>
                                    <p><a href=${places.url()}>${places.url()}</a></p>
                                    </div>`;        

                    places.marker.addListener('click', function () {
                    infowindow.open(map, this);
                    places.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(() => {
                        places.marker.setAnimation(null);
                    }, 1000);
                    infowindow.setContent(content_String);
                    map.setCenter(places.marker.getPosition());
                });
            },
            error: function (e) {
                alert('Can not connected wirh the Foursquare api');
            }
        });

    });

    self.showInfo = function (places) {
        google.maps.event.trigger(places.marker, 'click');
        self.toggleElement();
    };

    self.toggle_Nav = ko.observable(false);

    this.nav_status = ko.pureComputed (function () {
       if(self.toggle_Nav() === false) {
           return 'nav';
       }
       else {
        return 'closed_nav';
       }
        }, this);

    self.toggleElement = function(toggle) {
  
    if(self.toggle_Nav(true) === true) {
        return true;
    }
    if(self.toggle_Nav(false) === true) {
        return true;
    }

   };

    self.visible = ko.observableArray();
    
    self.placeList().forEach(function (Place_info) {
        self.visible.push(Place_info);
    });

    self.Location_Input = ko.observable('');

    self.Filter_Places = function () {       
        var searchInput = self.Location_Input().toLowerCase();
        self.visible.removeAll();
        self.placeList().forEach(function (Place_info) {
            Place_info.marker.setVisible(false);
            if (Place_info.name().toLowerCase().indexOf(searchInput) !== -1) {
                self.visible.push(Place_info);
            }
        });

        self.visible().forEach(function (Place_info) {
            Place_info.marker.setVisible(true);
        });
    };

}; 