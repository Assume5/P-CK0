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
            role:"driver"
        }
    ),
    success: function(res) {
        res=JSON.parse(res)
        //console.log(res)
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
$('.register').hide()
setTimeout(function(){$('.loader').hide();$('.register').show()}, 555);
// function test(){
//     $(".register #earning-true").empty()
//     //console.log(123);
// $(".register #earning-true").append(
//     '<p>!!@#$</p>'+
//     '<p>#@!#</p>'
// )
// }
// setInterval(test,1);
//-------------------------------------------------------------------------------------------------------------//

//ajax get status if true hide earning-false and accept-true. if false hide earning-false accept-true. if accept hide earning-false, earning true.
//if click delivered update status into earning ture
//if click click end for today set status into false. display today earn.
if($('#date')){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    $('#date').text(today)
    $.ajax({
        type:'POST',
        contentType:'application/json',
        url:'./getDriverTodayEarn',
        data:JSON.stringify(
            {
                date:today
            }
        ),
        success: function(res) {
            if(res != 'false'){
                res=JSON.parse(res)
                $('#today-earn').text(parseFloat(res).toFixed(2) + ' $')
            }
            else{
                $('#today-earn').text(0 + ' $')
            }
                
        }
    });
}
getStatus()
let getting;
let autozoomAccept;
let autozoomPicked;
let myLL;
function getStatus(){
$.ajax({
    type:'GET',
    contentType:'application/json',
    url:'./getDriverStatus',
    data:JSON.stringify(
    ),
    success: function(res) {
        if(res == 'false'){
            $("#earning-true").hide()
            $("#accept-true").hide()
            $("#earning-false").show()
        }
        if(res == 'true'){
            getOrders()
            getting=setInterval(getOrders,1000);
            $("#earning-true").show()
            $("#accept-true").hide()
            $("#earning-false").hide()
        }
        if(res == 'accept'){
            clearInterval(getting);
            $("#earning-true").hide()
            $("#accept-true").show()
            $("#earning-false").hide()
            $.ajax({
                type:'GET',
                contentType:'application/json',
                url:'./getDriverCurrentOrderDetails',
                data:JSON.stringify(
                ),
                success: function(res) {
                    res=JSON.parse(res)
                    ////console.log(res)
                    $('#accept-true').append(
                        '<p style="float:left;">Order: </p>'+
                        '<p style="float:right;">'+ res[2][0]+'</p><br><br>'+
                        '<p style="float:right;"># '+ res[0][0][1]+'</p><br><br>'+
                        '<p style="float:right;">'+ res[2][1].split(', ')[0] +'</p><br><br>'+
                        '<p style="float:right;">'+ res[2][1].split(', ')[1] + ' '+res[2][1].split(', ')[2] + ' '+res[2][1].split(', ')[3] +'</p><br><br><hr><br>'+
                        '<p style="float:left;">To: </p>'+
                        '<p style="float:right;">'+res[1][0]+'</p><br><br>'+
                        '<p style="float:right;">'+res[1][1].split(', ')[0]+'</p><br><br>'+
                        '<p style="float:right;">'+ res[1][1].split(', ')[1] + ' '+res[1][1].split(', ')[2] + ' '+res[1][1].split(', ')[3] +'</p><br><br><hr><br>'
                    )
                    for(let i = 0; i < res[0].length;i++){
                        $('#accept-true').append(
                            '<p style="display: inline-block; padding-right: 100px; float: left;">'+res[0][i][4]+ '</p>'+
                            '<p style="display: inline-block; padding-right: 100px; float: left;">'+res[0][i][2]+'</p>'+
                            '<p style="float: right;">'+res[0][i][3]+' $</p><br><br>'
                        )
                    }
                    $('#accept-true').append(
                            '<br><br><hr><br>'+
                            '<div style="clear: both;"></div>'+
                            '<div class="wrapper" style="position: fixed; top: auto; transform: translate(-50%,-10%); ">'+
                            '<button class="Picked" id="' + res[0][0][1] + '">'+
                              'Picked Up '+
                              '<span></span>'+
                              '<span></span>'+
                              '<span></span>'+
                               '<span></span>'+
                              '<span></span>'+
                              '<span></span>'+
                            '</button>'+
                          '</div> <br><br>'
                    )
                    let customerLL=res[1][2].split(', ');
                    let storeLL=res[2][2].split(', ');
                    addpoint(storeLL[0],storeLL[1])
                    addpoint(customerLL[0],customerLL[1])
                    //autozoom
                    addpoint_zoom(parseFloat(storeLL[0]),parseFloat(storeLL[1]))
                    function autozoom_accept(){
                        addpoint_zoom(parseFloat(storeLL[0]),parseFloat(storeLL[1]))
                    }
                    autozoomAccept=setInterval(autozoom_accept,5000)
                }
            });
        }
        if(res == 'picked'){
            clearInterval(getting);
            $("#earning-true").hide()
            $("#accept-true").show()
            $("#earning-false").hide()
            $('#accept-true').empty()
            $.ajax({
                type:'GET',
                contentType:'application/json',
                url:'./getDriverCurrentOrderDetails',
                data:JSON.stringify(
                ),
                success: function(res) {
                    res=JSON.parse(res)
                    $('#accept-true').append(
                        '<p style="float:left;">Order: </p>'+
                        '<p style="float:right;">'+ res[2][0]+'</p><br><br>'+
                        '<p style="float:right;"># '+ res[0][0][1]+'</p><br><br>'+
                        '<p style="float:right;">'+ res[2][1].split(', ')[0] +'</p><br><br>'+
                        '<p style="float:right;">'+ res[2][1].split(', ')[1] + ' '+res[2][1].split(', ')[2] + ' '+res[2][1].split(', ')[3] +'</p><br><br><hr><br>'+
                        '<p style="float:left;">To: </p>'+
                        '<p style="float:right;">'+res[1][0]+'</p><br><br>'+
                        '<p style="float:right;">'+res[1][1].split(', ')[0]+'</p><br><br>'+
                        '<p style="float:right;">'+ res[1][1].split(', ')[1] + ' '+res[1][1].split(', ')[2] + ' '+res[1][1].split(', ')[3] +'</p><br><br><hr><br>'
                    )
                    for(let i = 0; i < res[0].length;i++){
                        $('#accept-true').append(
                            '<p style="display: inline-block; padding-right: 100px; float: left;">'+res[0][i][4]+ '</p>'+
                            '<p style="display: inline-block; padding-right: 100px; float: left;">'+res[0][i][2]+'</p>'+
                            '<p style="float: right;">'+res[0][i][3]+' $</p><br><br>'
                        )
                    }
                    $('#accept-true').append(
                            '<br><br><hr><br>'+
                            '<div style="clear: both;"></div>'+
                            '<div class="wrapper" style="position: fixed; top: auto; transform: translate(-50%,-10%); ">'+
                            '<button class="Delivered" id="' + res[0][0][1] + '">'+
                              'Delivered '+
                              '<span></span>'+
                              '<span></span>'+
                              '<span></span>'+
                               '<span></span>'+
                              '<span></span>'+
                              '<span></span>'+
                            '</button>'+
                          '</div> <br><br>'
                    )
                    let customerLL=res[1][2].split(', ');
                    let storeLL=res[2][2].split(', ');
                    addpoint(storeLL[0],storeLL[1])
                    addpoint(customerLL[0],customerLL[1])
                    //autozoom
                    addpoint_zoom(parseFloat(customerLL[0]),parseFloat(customerLL[1]))
                    function autozoom_picked(){
                        addpoint_zoom(parseFloat(customerLL[0]),parseFloat(customerLL[1]))
                    }
                    autozoomPicked=setInterval(autozoom_picked,5000)
                }
            });
            //hide pick up button
        }
    }
});
}

$("#start-earning").on('click', function() { //change status to true
    $.ajax({
        type:'POST',
        contentType:'application/json',
        url:'./updateDriverStatus',
        data:JSON.stringify(
            {
                status:"true"
            }
        ),
        success: function(res) {
            if(res == 'true')
                getStatus()
        }
    });
})
$("#end-earning").on('click', function() { //change status to true
    $.ajax({
        type:'POST',
        contentType:'application/json',
        url:'./updateDriverStatus',
        data:JSON.stringify(
            {
                status:"false"
            }
        ),
        success: function(res) {
            clearInterval(getting);
            if(res == 'true')
                getStatus()
        }
    });
})
$(document).on('click','.accept-order', function() {
    $.ajax({
        type:'POST',
        contentType:'application/json',
        url:'./updateDriverStatus',
        data:JSON.stringify(
            {
                status:"accept",
                orderid:$(this).attr('id')
            }
        ),
        success: function(res) {
            if(res == 'true')
            clearInterval(getting);
            getStatus()
            }
    });
});
$(document).on('click','.Picked', function() {
    $.ajax({
        type:'POST',
        contentType:'application/json',
        url:'./updateDriverStatus',
        data:JSON.stringify(
            {
                status:"picked",
                orderid:$(this).attr('id')
            }
        ),
        success: function(res) {
            if(res == 'true')
            clearInterval(autozoomAccept);
            getStatus()
            }
    });
});
$(document).on('click','.Delivered', function() {
    $.ajax({
        type:'POST',
        contentType:'application/json',
        url:'./updateDriverStatus',
        data:JSON.stringify(
            {
                status:"delivered",
                orderid:$(this).attr('id')
            }
        ),
        success: function(res) {
            if(res == 'true')
            clearInterval(autozoomPicked);
            getStatus()
            window.location.reload();
            }
    });
});
function getOrders(){
    $.ajax({
        type:'GET',
        contentType:'application/json',
        url:'./driverGetOrder',
        data:JSON.stringify(
        ),
        success: function(res) {
            res=JSON.parse(res)
            for(let i in res){
                const driverLL = res[i]["driverLL"].split(', ')
                const storeLL = res[i]["storeLL"].split(', ')
                const customerLL = res[i]["customerLL"].split(', ')
                const distanceDriverToStore = parseFloat(distanceInkm(driverLL[0],driverLL[1],storeLL[0],storeLL[1])).toFixed(2)
                const distanceStoreToCustomer = parseFloat(distanceInkm(storeLL[0],storeLL[1],customerLL[0],customerLL[1])).toFixed(2)
                if(!document.getElementById(i)){
                    if(distanceDriverToStore < 20){
                $("#earning-true").prepend(
                    '<div  class="animate__animated  animate__lightSpeedInLeft rcorners" id="'+i+'">'+
                    '<p style="float: left;margin: 10px;">$ '+ parseFloat(res[i]['tip']).toFixed(2) +'</p><br><br>'+
                    '<p style="float:left;display: inline-block;margin: 10px;">'+distanceDriverToStore + 'Mile</p>'+
                    '<p style="float:right;display: inline-block;margin: 10px;">'+res[i]['totalItems']+'</p><br><br><hr>'+
                    '<p style="display: inline-block;float: left;margin: 10px;">'+ res[i]["storeName"] +'</p><br><br>'+
                    '<p style="display: inline-block;float: left;margin: 10px;">'+ distanceStoreToCustomer +' Mile store to customer</p><br><br>'+
                    '<div class="wrapper" style="position: fixed; top: auto; float:right; transform: translate(+50%,-140%); width:30%; height: 25%;" >'+
                        '<button class="accept-order" id="'+ i +'">'+
                          'Accept'+
                        '</button>'+
                      '</div><br>'+
                '</div> <br><br>'
                )
                    }
            }
        }
        $("#earning-true > div").each((index, elem) => {
            if(elem.id!=''){
                if(res[elem.id]==undefined)
                    $('#'+elem.id).empty()
            }
          });
        }
    });
}

//calculate distance
function distanceInkm(lat1,lon1,lat2,lon2){
    var radiu = 6371;
    var lat_1_rad = lat1 * Math.PI/180;
    var lat_2_rad = lat2 * Math.PI/180;
    var delta_lat = (lat2 - lat1) * Math.PI/180;
    var delta_lon = (lon2 - lon1) * Math.PI/180;

    var a = Math.sin(delta_lat/2) * Math.sin(delta_lat/2)+ Math.cos(lat_1_rad) * Math.cos(lat_2_rad) * Math.pow(Math.sin(delta_lon/2),2);
    var c  = 2 * Math.atan(Math.sqrt(a),Math.sqrt(1-a));

    var d = radiu * c
    return d;
}
function kmtomi(km){
    return km* 0.621371192;
}
function distanceTomi(lat1,lon1,lat2,lon2){
    return kmtomi(distanceInkm(lat1,lon1,lat2,lon2));
}






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
            ////console.log(ans)
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
}

function removepoint(){
    var lat = document.getElementById("lat").value;
    var lon = document.getElementById("lon").value;
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
    myLL=[pos.latitude,pos.longitude]
    $.ajax({
        type:'POST',
        contentType:'application/json',
        url:'./updateDriverLocation',
        data:JSON.stringify(
            {
                latLong:pos.latitude + ', ' + pos.longitude
            }
        ),
        success: function(res) {
        }
    });
    

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
setInterval(updatelocation_realtime,5000);

 

