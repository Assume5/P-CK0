var options  = {
    enableHighAccuracy:true,
    timeout: 2000,
    maximumAge: 0
};

var layer;
var map;
var pos;
var interval = 4000;
var lock_on = null;
function lookup_address(){
    //https://nominatim.openstreetmap.org/search?q=4285%20Chestnut%20Ridge%20Rd%20Buffalo,%20NY%2014228&format=json&addressdetails=1&accept-language=en
    var add = document.getElementById('add').value;
    var header = "https://nominatim.openstreetmap.org/search?q=";
    var address =  add.replace(/\s/g, "%20");
    var query = header + address + "&format=json&addressdetails=1&accept-language=en"
    //console.log(query)
    var ans;
    
    ans = return_query(query)
    /*
    $.getJSON(query, function(data) {
    // JSON result in `data` variable
        console.log(data);
        console.log(data[0].lat)
        ans = [data[0].lat,data[0].lon];
    });*/
    console.log(ans)
}

function return_query(url){
    $.getJSON(url, function(data) {
        // JSON result in `data` variable
            ans = [data[0].lat,data[0].lon];
            console.log(ans)
            return ans;
        });
}

function addpoint(){
    var lat = document.getElementById("lat").value;
    var lon = document.getElementById("lon").value;

    var style =  new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({ color: [255,0,0,1] }),
            stroke: new ol.style.Stroke({ color: [0,0,0,1] }),
            radius: 5
        })
      });

    var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon,lat]))
    });

    feature.setStyle(style);
    source = layer.getSource()
    source.addFeature(feature);
    //Get features at coordinate has to be coordinate after projection
    var temp = source.getFeaturesAtCoordinate(ol.proj.fromLonLat([lon,lat]));
    ////console.log(temp);
}

function removepoint(){
    var lat = document.getElementById("lat").value;
    var lon = document.getElementById("lon").value;
    source = layer.getSource()

    var feature = source.getFeaturesAtCoordinate(ol.proj.fromLonLat([lon,lat]))[0];
    source.removeFeature(feature);
}

function addpoint_zoom(){
    var lat = parseFloat(document.getElementById("lat").value);
    var lon = parseFloat(document.getElementById("lon").value);
    //calling basic addpoint 
    addpoint();

    var mid_lat = (pos.latitude + lat)/2
    var mid_lon = (pos.longitude + lon)/2

    var new_view = new ol.View({
        center:ol.proj.fromLonLat([mid_lon,mid_lat]),
        zoom:15
    });

    map.setView(new_view);
}
function updateView(position){
    var new_pos = position.coords;
    var new_view = new ol.View({
        center:ol.proj.fromLonLat([new_pos.longitude,new_pos.latitude]),
        zoom:18
    });
    //console.log(new_pos.longitude,new_pos.latitude);
    //console.log("Updating");
    map.setView(new_view);

}
function updatelocation(position){
    var style =  new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({ color: [255,0,0,1] }),
            stroke: new ol.style.Stroke({ color: [0,0,0,1] }),
            radius: 5
        })
      });

    var new_pos = position.coords
    var new_feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([new_pos.longitude,new_pos.latitude]))
    })

    new_feature.setStyle(style);

    source = layer.getSource()

    var feature = source.getFeaturesAtCoordinate(ol.proj.fromLonLat([pos.longitude,pos.latitude]))[0];
    source.removeFeature(feature);

    pos = new_pos;
    //console.log(pos.latitude,pos.longitude);

    source.addFeature(new_feature);
}
function ViewonGoogle(){
    var lat = document.getElementById("lat").value;
    var lon = document.getElementById("lon").value;
    var googleURL = "https://www.google.com/maps/search/"+lat+"," + lon;
    window.open(googleURL);
}

// setup map once it's current location is being retrieved successful
function success(position){
    
      var style =  new ol.style.Style({
          image: new ol.style.Circle({
              fill: new ol.style.Fill({ color: [255,0,0,1] }),
              stroke: new ol.style.Stroke({ color: [0,0,0,1] }),
              radius: 5
          })
        });
    
    pos = position.coords;
    //console.log(pos.latitude + ","+ pos.longitude);


    var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([pos.longitude,pos.latitude])),
      });
    feature.setStyle(style);
    map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([pos.longitude,pos.latitude]),
          zoom: 18
        })
    });
    layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                feature
            ]
        })
    });

    map.addLayer(layer);
    //console.log("Running");
    return -1;
}

function failed(err){
    //console.log(err.message);
}

function getlocation(){
    navigator.geolocation.getCurrentPosition(success,failed,options);
}

function updateLocationViewTime(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(updateView,failed,options);
    }
}
function updatelocation_realtime(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(updatelocation,failed,options);
    }
}


function toggle_lockon(){
    if(lock_on == null){
        lock_on = setInterval(updateLocationViewTime, interval);
        alert("auto lock is on");
    }else{
        clearInterval(lock_on);
        lock_on = null;
        alert("auto lock is off");
    }
}
 
