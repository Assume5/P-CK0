$('.success-button-box').on('click', function() {
    window.location="./index.html"
})
$('.register').hide()
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
function test(){
    let count=document.getElementById("lblCartCount").innerHTML;
    count=parseInt(count)
    document.getElementById("lblCartCount").innerHTML=count+1;
}
$.ajax({
    type:'GET',
    contentType:'application/json',
    url:'./getRestaurant',
    data:JSON.stringify(
        {
        }
    ),
    success: function(res) {
        res=JSON.parse(res)
        ////console.log(res)
        for(let i=0;i<res.length;i++){
            if(document.getElementsByClassName("content")[document.getElementsByClassName("content").length-1]===undefined || document.getElementsByClassName("content")[document.getElementsByClassName("content").length-1].getElementsByClassName("card").length===3){
                $('.register').append( '<div class="content">'+
                                        '</div>')
            }
            if(document.getElementsByClassName("content")[document.getElementsByClassName("content").length-1].getElementsByClassName("card").length!==3){
                ////console.log($('.content').last())
                //console.log(res,"1121")
                $('.content').last().append(
                    '<div class="card">' +
                        '<a href= "' + 'restaurants/' + res[i][1]+'.html' + '">' +
                            '<div class="icon"><img src=' + res[i][6] + '>' +'</div>' +
                            '<p class="title">' + res[i][1].replaceAll('-',' ') + '</p>' +
                            '<p class="text">' + res[i][2] + '</p>' +
                            '<p class="text">' + res[i][4] + '</p>' +
                            '<p class="text">' + res[i][5] + '</p><br>' +
                    '</div>'
                )

            }
        }
        setTimeout(function(){$('.loader').hide();$('.register').show()});
    }
});       

// $('.register').append( myTMPL ); 
// // $('.content')[$('.content').length-1].append( myTMPL )

