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
let dict={}
$.ajax({
    type:'GET',
    contentType:'application/json',
    url:'./getOrderHistory',
    data:JSON.stringify(
    ),
    success: function(res) {
        res=JSON.parse(res)
        //console.log(res)
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
            $(".register").append(
                '<div class= "orderid" id="'+ res[0][i][4]+ ' "  style="cursor: pointer; text-transform:capitalize; ">'+
                '<h5 style="color:#fff;">Order #: '+ res[0][i][4] + '</h5>'+
                '<hr style="width: 100%;"><br><br>'+
                '<p class="alignleft">Status: </p>'+
                '<p class="alignright">'+ res[0][i][13] +'</p><br><br>'+
                '<p class="alignleft">Order Date: </p>'+
                '<p class="alignright">'+ res[0][i][5] +'</p><br><br>'+
                '<p class="alignleft">Order from: </p>'+
                '<p class="alignright">'+ res[0][i][6].replace("-"," ") +'</p><br><br>'+
                '<p class="alignleft">Total Items: </p>'+
                '<p class="alignright" >'+ res[0][i][9] +'</p><br><br>'+
                '<p class="alignleft">Total Price: </p>'+
                '<p class="alignright">'+ res[0][i][12] +'</p><br><br>'+
                '<div style="clear: both;"></div>'+
                '</div><br>'
            )
        }
        setTimeout(function(){$('.loader').hide();$('.register').show()});
    }
});
$(document).on('click','.orderid', function(event) {
    const id=$(this).attr('id').replace(' ','');
    if(dict[id]['status']!="Delivered"){
        window.location="./orderstatus#"+id;
    }
    else{
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
            res=JSON.parse(res);
            //check status if is not complete then redirect to ./orderstatus#id.
            //console.log(res);
            //console.log(dict)
            $(".modal-title").text("Order #: "+res[0][1])
            $(".modal-body").empty()
            $('.modal-body').append(
                '<h5 style="color:#fff;" class="alignleft">'+"Order From: "+ dict[id]["store"] +'</h5><br><br>'+
                '<h6 style="color:#fff;" class="alignleft">'+ "Order Date: "+dict[id]["orderdate"] +'</h6><br><br>'+
                '<hr><br><br>'
            )
            for(let i=0;i<res.length;i++){
            $(".modal-body").append(
                '<p class="alignleft" style="display: inline-block; padding-right: 100px;">'+ res[i][4] +'</p>'+
                '<p class="alignleft" style="display: inline-block; padding-right: 100px;">'+ res[i][2] +'</p>'+
                '<p class="alignright">'+ res[i][3] +'</p><br><br>'
            )

            }
            $('.modal-body').append(
                '<hr><br><br>'+
                '<p class="alignleft" >Sub Total: </p>'+
                '<p class="alignright" >'+ dict[id]['subtotal']+'</p><br><br>'+
                '<p class="alignleft" >Tax&Fee: </p>'+
                '<p class="alignright" >'+ dict[id]['taxfee']+'</p><br><br>'+
                '<p class="alignleft" >Delivery Fee: </p>'+
                '<p class="alignright" >'+dict[id]['deliverfee']+'</p><br><br>'+
                '<p class="alignleft" >Driver Tip: </p>'+
                '<p class="alignright" >'+dict[id]['tip']+'$</p><br><br>'+
                '<p class="alignleft" >Total: </p>'+
                '<p class="alignright" >'+dict[id]['total']+'</p><br><br>'+
                '<div style="clear: both;"></div>'
            )
            
            document.getElementById('myModal').className='modal animate__animated animate__zoomIn'
            document.getElementById('myModal').style.display='block'

        }
    });
}
})
$('.register').hide()
