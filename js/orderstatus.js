$('.success-button-box').on('click', function() {
    window.location="./index.html"
})
//$('.register').hide()
$.ajax({
    type:'POST',
    contentType:'application/json',
    url:'./getFirst',
    data:JSON.stringify(
        {
            role:"customer"
        }
    ),
    success: function(res) {
        res=JSON.parse(res)
        ////console.log(res)
        if(res[0]=="False"){
            window.location="./404"
            // document.getElementById("pemote-fail").innerHTML = "You have no right to access. please login";
            // $('#success-box').hide();document.getElementById('id01').style.display='block'
            // $('.fail-button-box').on('click', function() {
            //     window.location="../index.html"
            // })
        }
        else{ 
            document.getElementById("welcome-user").innerHTML="Welcome Back "+ res[0]
            document.getElementById("lblCartCount").innerHTML=res[1]

    }
    }
});
function signOut(){
    $.ajax({
        type:'POST',
        contentType:'application/json',
        url:'./logout',
        data:JSON.stringify(
        ),
        success: function(res) {
            if(res=="true")
    {          document.getElementById("pemote-success").innerHTML = "Logout Successfully";
            $('#error-box').hide();document.getElementById('id01').style.display='block'
        }
        }
    });
}
function checked(){
    $.ajax({
        type:'GET',
        contentType:'application/json',
        url:'./getOrderHistory',
        data:JSON.stringify(
        ),
        success: function(res) {
            //console.log()
            res=JSON.parse(res)
            let latLong;
            if(dict[id]['driverLocation']!=undefined){
                latLong=dict[id]['driverLocation'].split(", ")
                removepoint(latLong[0],latLong[1])
            }
            
            for(let i=res[0].length-1;i>=0;i--){
                dict[res[0][i][4]]={
                    store:res[0][i][6].replace("-"," "),
                    orderdate:res[0][i][5],
                    subtotal:res[0][i][7],
                    taxfee:res[0][i][8],
                    deliverfee:res[0][i][10],
                    tip:res[0][i][11],
                    total:res[0][i][12],
                    name:res[1][i][0],
                    address:res[1][i][1],
                    phone:res[1][i][2],
                    status:res[0][i][13],
                    storeaddress:res[1][i][3],
                }
                if(dict[res[0][i][4]]['status']!='Delivered'){
                    dict[res[0][i][4]]['driverLocation']=res[1][i][4]
                }                
            }
            if(dict[id]['status'] == 'Delivered' && latLong!=undefined){
                removepoint(latLong[0],latLong[1])
                const storeLat=dict[id]['storeaddress'].split(', ')[0]
                const storeLong=dict[id]['storeaddress'].split(', ')[1]
                addpoint_zoom(parseFloat(storeLat),parseFloat(storeLong))

            }
            if(dict[id]['driverLocation']!=undefined){
                latLong=dict[id]['driverLocation'].split(", ")
                addpoint(latLong[0],latLong[1])
                addpoint_zoom(parseFloat(latLong[0]),parseFloat(latLong[1]))
            }
            if(dict[id]['status']=='Waiting owner confirm'){
                $("#status1").prop("checked", true);
            }
            else if(dict[id]['status']=='Waiting For Driver'){
                $("#status2").prop("checked", true);
            }
            else if(dict[id]['status']=='Picking Up'){
                $("#status3").prop("checked", true);
            }
            else if(dict[id]['status']=='On The Way'){
                $("#status4").prop("checked", true);
            }
            else if(dict[id]['status']=='Delivered'){
                $("#status5").prop("checked", true);
            }
        }
    });
}
let dict={}
let id=document.URL.split('#')[1]
$.ajax({
    type:'GET',
    contentType:'application/json',
    url:'./getOrderHistory',
    data:JSON.stringify(
    ),
    success: function(res) {
        res=JSON.parse(res)
        for(let i=res[0].length-1;i>=0;i--){
            dict[res[0][i][4]]={
                store:res[0][i][6].replace("-"," "),
                orderdate:res[0][i][5],
                subtotal:res[0][i][7],
                taxfee:res[0][i][8],
                deliverfee:res[0][i][10],
                tip:res[0][i][11],
                total:res[0][i][12],
                name:res[1][i][0],
                address:res[1][i][1],
                phone:res[1][i][2],
                status:res[0][i][13],
                storeaddress:res[1][i][3]
            }
        }
        $.ajax({
            type:'POST',
            contentType:'application/json',
            url:'./getOrderDetails',
            data:JSON.stringify(
                {
                    orderid:id
                }
            ),
            success: function(res) {
                res=JSON.parse(res)
                //check for status
                if(dict[id]['status']=='Waiting owner confirm'){
                    $("#status1").prop("checked", true);
                }
                else if(dict[id]['status']=='Waiting For Driver'){
                    $("#status2").prop("checked", true);
                }
                else if(dict[id]['status']=='Picking Up'){

                    $("#status3").prop("checked", true);
                }
                else if(dict[id]['status']=='On The Way'){
                    $("#status4").prop("checked", true);
                }
                else if(dict[id]['status']=='Delivered'){
                    $("#status5").prop("checked", true);
                }
                $(".register").append(
                    '<p style="float:left;">Order: </p>'+
                    '<p style="float:right;">'+ dict[id]['store'] +'</p><br><br>'+
                    '<p style="float:right;">'+dict[id]['orderdate'] +'</p><br><br><hr> <br>'
                )
                for(let i = 0; i< res.length; i++){
                              $(".register").append(
                        '<p style="display: inline-block; padding-right: 100px; float: left;">'+ res[i][4] +'</p>'+
                        '<p style="display: inline-block; padding-right: 100px; float: left;">'+ res[i][2] +'</p>'+
                        '<p style="float: right;">'+ res[i][3] + '$</p> <br><br>'
                              )
                }
                $('.register').append(
                    ' <hr><br> <p style="float: left;" >Sub Total: </p>'+
                    '<p style="float: right;" >'+ dict[id]['subtotal'] +'</p> <br><br>'+
                    '<p style="float: left;" >Tax&Fee: </p>'+
                    '<p style="float: right;" >'+ dict[id]['taxfee'] +'</p> <br><br>'+
                    '<p style="float: left;" >Delivery Fee: </p>'+
                    '<p style="float: right;" >'+ dict[id]['deliverfee'] + '</p> <br><br>'+
                    '<p style="float: left;" >Driver Tip: </p>'+
                    '<p style="float: right;" >'+ dict[id]['tip'] +'$</p> <br><br>'+
                    '<p style="float: left;" >Total: </p>'+
                    '<p style="float: right;" >'+ dict[id]['total'] +'</p> <br><br>'+
                    '<div style="clear: both;"></div>'
                )
                const storeLat=dict[id]['storeaddress'].split(', ')[0]
                const storeLong=dict[id]['storeaddress'].split(', ')[1]
                addpoint(storeLat,storeLong)
                addpoint_zoom(parseFloat(storeLat),parseFloat(storeLong))
                setTimeout(function(){$('.loader').hide();$('.register').show()});

            }
        });
    }
});
var intervalId = window.setInterval(function(){
    checked()
}, 8000);
$('.register').hide()

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
function lookup_address(add){
    //https://nominatim.openstreetmap.org/search?q=4285%20Chestnut%20Ridge%20Rd%20Buffalo,%20NY%2014228&format=json&addressdetails=1&accept-language=en
    var header = "https://nominatim.openstreetmap.org/search?q=";
    var address =  add.replace(/\s/g, "%20");
    var query = header + address + "&format=json&addressdetails=1&accept-language=en"
    //console.log(query)
    var ans;
    
    ans = return_query(query)
    /*
    $.getJSON(query, function(data) {
    // JSON result in `data` variable
        //console.log(data);
        //console.log(data[0].lat)
        ans = [data[0].lat,data[0].lon];
    });*/
    return (ans)
}

function return_query(url){
    $.getJSON(url, function(data) {
        // JSON result in `data` variable
            ans = [data[0].lat,data[0].lon];
            //console.log(ans)
            return ans;
        });
}

function addpoint(lat,lon){
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
    //console.log(temp);
}

function removepoint(lat,lon){
    source = layer.getSource()

    var feature = source.getFeaturesAtCoordinate(ol.proj.fromLonLat([lon,lat]))[0];
    source.removeFeature(feature);
}

function addpoint_zoom(lat,lon){
    //calling basic addpoint 
    addpoint(lat,lon);

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
    $.ajax({
        type:'POST',
        contentType:'application/json',
        url:'./updateLL',
        data:JSON.stringify(
            {
                latLong:pos.latitude + ", "+ pos.longitude
            }
        ),
        success: function(res) {
        }
    });


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
setInterval(updatelocation_realtime,4000);

 

