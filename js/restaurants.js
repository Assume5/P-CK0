const storeName=document.title
$(".register").hide()
$('.success-button-box').on('click', function() {
    window.location="../index.html"
})
$('.dot').on('click', function() {
    document.getElementById('id01').style.display='none'
})
let count;
$.ajax({
    type:'POST',
    contentType:'application/json',
    url:'../getMenu',
    data:JSON.stringify(
        {
            store:storeName.replace(' ','-')
        }
    ),
    success: function(res) {
        res=JSON.parse(res)
        ////console.log(res)
        for(let key in res){
            $('.containerMenu').append(
                '<div class="link">' +
                '<div class="text" >'+key.toLowerCase()+'</div>'+
            '</div>'
            )
            $('.register').append(
                '<div id='+key.toLowerCase()+'>'+
                '<h5 style="color: white;">' + key + '</h5>' +
                '<div class="content">'+
                '</div>'+
                '</div>'
            )
            // if(document.getElementsByClassName("content")[document.getElementsByClassName("content").length-1]===undefined || document.getElementsByClassName("content")[document.getElementsByClassName("content").length-1].getElementsByClassName("card").length===3){
            //     $('.register').append( '<div class="content">'+
            //                             '</div>')
            // }
            for(let i=0;i<res[key].length;i++){
            parent=document.getElementById(key.toLowerCase())//.getElementsByClassName("card").length)
            if(parent.getElementsByClassName("content")[parent.getElementsByClassName("content").length-1].getElementsByClassName("cardATC").length==3){
                $('#'+key).append(
                    '<div class="content">'+
                    '</div>'
                )
            }
            let className='#'+key.toLowerCase()+' .content'
            $(className).last().append(
                '<div class="cardATC">' +
                '<div class="icon"><img src="' + res[key][i][5].toLowerCase() + '"></div>' +
                '<p class="title" id="title">'+ res[key][i][1] +'</p>'+
                '<p class="text">' + res[key][i][4]+'</p>' +
                '<p class="text" id="price"> $' + res[key][i][3]+ '</p>' +
                '<div class="text">'+
                    '<div id="containerButton">'+
                        '<button class="learn-more add-to-cart" id="'  + res[key][i][3] + "," + res[key][i][1]+","+key.toLowerCase() +'"'+'>' +
                          '<span class="circle" aria-hidden="true">' +
                            '<span class="icon arrow"></span>' +
                          '</span>' +
                          '<span class="button-text">ADD TO CART</span>' +
                        '</button>' +
                      '</div>' +
                '</div>' +
            '</div>'
            )
        }
        setTimeout(function(){$('.loader').hide();$('.register').show()});
        }
    }
});

$.ajax({
    type:'POST',
    contentType:'application/json',
    url:'../getFirst',
    data:JSON.stringify(
        {
            role:"customer"
        }
    ),
    success: function(res) {
        res=JSON.parse(res)
        ////console.log(res)
        if(res[0]=="False"){
            window.location="../404"
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
        url:'../logout',
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
// var links = $('.link')
// //console.log(count)
// for(var i = 0; i <= count; i++)
//    addClass(i)


// function addClass(id){
//    setTimeout(function(){
//       if(id > 0) links[id-1].classList.remove('hover')
//       links[id].classList.add('hover')
//    }, id*750) 
// }

$(document).ready(function(){
    $(document).on('click', '.link', function(){
        let test=$(this).find(".text").text()
        test='#'+test;
        ////console.log(test)
        $('html, body').animate({
            scrollTop: $(test).offset().top
        }, 800);
    })
})
$(document).ready(function(){
    $(document).on('click', '.add-to-cart', function(){
        let count=document.getElementById("lblCartCount").innerHTML;
        count=parseInt(count)
        ////console.log($(this).attr('id').split(","))
        let price= $(this).attr('id').split(",")[0]
        let title= $(this).attr('id').split(",")[1]
        let type= $(this).attr('id').split(",")[2]
        $.ajax({
            type:'POST',
            contentType:'application/json',
            url:'../addtocart',
            data:JSON.stringify(
                {
                    owner:document.title.replace(' ','-').toLowerCase(),
                    productTitle:title.toLowerCase(),
                    price:price,
                    type:type,
                    count:1
                }
            ),
            success: function(res) {
                if( res!='true'){
                    ////console.log(res)
                    document.getElementById("pemote-fail").innerHTML = "You have order on " + res.replace('-',' ') +" would you like start new order?";
                    $('#success-box').hide();document.getElementById('id01').style.display='block'
                    $('.fail-button-box').on('click', function() {
                        $.ajax({
                            type:'POST',
                            contentType:'application/json',
                            url:'../deleteCart',
                            data:JSON.stringify(
                            ),
                            success: function(res) {
                                if(res=='true'){ 
                                    $.ajax({
                                        type:'POST',
                                        contentType:'application/json',
                                        url:'../addtocart',
                                        data:JSON.stringify(
                                            {
                                                owner:document.title.replace(' ','-').toLowerCase(),
                                                productTitle:title.toLowerCase(),
                                                price:price,
                                                type:type,
                                                count:1
                                            }
                                        ),
                                    });
                                    document.getElementById("lblCartCount").innerHTML=1;
                                    document.getElementById('id01').style.display='none'
                                    }
                            }
                        });
                    })
                    $('.dot').on('click', function() {
                        document.getElementById('id01').style.display='none'
                        window.location.reload()
                    })
                }
                else{
                    document.getElementById("lblCartCount").innerHTML=count+1;
                }
            }
        });
    })
})
// $('.cartButton').on('click', function() {
//     document.getElementById('id02').style.display='block'
// })

