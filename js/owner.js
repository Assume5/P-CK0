$('.success-button-box').on('click', function() {
    window.location="./index.html"
})
$.ajax({
    type:'POST',
    contentType:'application/json',
    url:'./getFirst',
    data:JSON.stringify(
        {
            role:"owners"
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



//document.getElementById('edit-meal').style.display='block'




$('.dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});
$(".dropdown").find("span").text("chicken")
$('.dropdown .dropdown-menu li').click(function () {
    $(this).parents('.dropdown').find('span').text($(this).text());
    $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});
$('.dropdown-menu li').click(function () {
    var input = '<strong>' + $(this).parents('.dropdown').find('input').val() + '</strong>',
        msg = '<span class="msg">Hidden input value: ';
    $('.msg').html(msg + input + '</span>');
}); 
$(document).on('click', '.dropdown-menu li', function(){
    ////console.log($(this).parents('.dropdown').find('input').val())
}); 


$(document).ready(function (){
    $(document).on('click', '#add-one-meal', function(){// add meal
        ////console.log($(this).val())
        $(".dropdown").find("span").text($(this).val())
        document.getElementById("add-meal").className = "modal animate__animated animate__zoomIn";
        document.getElementById('add-meal').style.display="block"
        $('.cancel-edit').click(function () {
            document.getElementById("add-meal").className = "modal animate__animated animate__rollOut";
        });
        $('.add').click(function () {
            ////console.log(111)
            let type=document.getElementById("spanid").innerHTML.toLowerCase()//$(".dropdown").find("span").text().toLowerCase()
            let name=$("#add-meal-name").val().toLowerCase()
            let desc=$("#add-meal-desc").val().toLowerCase()
            let price=parseFloat($("#add-meal-price").val()).toFixed(2)
            let status=document.querySelector('input[name="selector"]:checked').value.toLowerCase();
            let img="./img/"+type+".png"
            let allFilled=true;
            ////console.log(type,name,desc,price,status,img)
            if(name==''){allFilled=false}
            if($("#add-meal-price").val()==''){allFilled=false}
            if(allFilled==false){
                $(".success-box").hide();
                $('.alert').text("Error")
                $('#pemote-fail').text("Some input field are empty.");
                $(".fail-button-box").text('Ok');
                document.getElementById('id01').style.display="block"
                $('.fail-button-box').click(function () {document.getElementById('id01').style.display="none"})
            }
            else{
            $.ajax({
                type:'POST',
                contentType:'application/json',
                url:'./add_meal',
                data:JSON.stringify(
                    {
                        name:name,
                        type:type,
                        desc:desc,
                        price:price,
                        status:status,
                        img:img,
                    }
                ),
                success: function(res) {
                    if(res=="true"){
                        document.getElementById("add-meal").className = "modal animate__animated animate__zoomOut";
                        setTimeout(function(){window.location.reload()}, 888);
                }
                }
            });
        }
    });
    })
})

$(document).on('click', '.edit', function(){ //edit meal
    const id=$(this).attr("id").split(',')
    ////console.log(id)
    let type=id[3]
    let name=id[0]
    let price=id[1]
    let status=id[4].toLowerCase()
    let desc=$(this).parent().parent().parent().find("#desc").text()
    let owner=id[2]
    $(".dropdown").find("span").text(type)
    $("#edit-meal-name").val(name.toUpperCase())
    $("#meal-desc").val(desc.toUpperCase())
    $("#edit-price").val(parseFloat(price).toFixed(2))
    ////console.log(status)
    if(status=='oos'){
        document.getElementById("option-four").checked = true;
        document.getElementById("option-three").checked = false;
    }
    else{
        document.getElementById("option-three").checked = true;
        document.getElementById("option-four").checked = false;
    }
    document.getElementById("edit-meal").className = "modal animate__animated animate__zoomIn";
    document.getElementById('edit-meal').style.display="block"
    $('.cancel-edit').click(function () {
        document.getElementById("edit-meal").className = "modal animate__animated animate__rollOut";
    });
        $('.edit-change').click(function () {
            let type1=$(".dropdown").find("span").text().toLowerCase().replace(type,'')
            let name1=$("#edit-meal-name").val().toLowerCase()
            let desc1=$("#meal-desc").val().toLowerCase()
            let price1=parseFloat($("#edit-price").val()).toFixed(2)
            let status1=document.querySelector('input[name="selector"]:checked').value.toLowerCase();
            let img1="./img/"+type1+".png"
            let allFilled=true;
            if($("#edit-meal-name").val().toLowerCase()==''){allFilled=false}
            if($("#edit-price").val()==''){allFilled=false}
            if(allFilled==false){
                $(".success-box").hide();
                $('.alert').text("Error")
                $('#pemote-fail').text("Some input field are empty.");
                $(".fail-button-box").text('Ok');
                document.getElementById('id01').style.display="block"
                $('.fail-button-box').click(function () {document.getElementById('id01').style.display="none"})
            }
            else{
            $.ajax({
                type:'POST',
                contentType:'application/json',
                url:'./edit_meal',
                data:JSON.stringify(
                    {
                        owner:owner,
                        editname:name1,
                        edittype:type1,
                        editdesc:desc1,
                        editprice:price1,
                        editstatus:status1,
                        editimg:img1,
                        name:name,
                        type:type,
                        desc:desc
                    }
                ),
                success: function(res) {
                    if(res=="true"){
                        document.getElementById("edit-meal").className = "modal animate__animated animate__zoomOut";
                        setTimeout(function(){window.location.reload()}, 888);
                }
                }
            });
        }
    });

}); 
$(document).on('click', '.delete', function(){
    const id=$(this).attr("id").split(',')
    ////console.log(id)
    let type=id[3]
    let name=id[0]
    let price=id[1]
    let status=id[4]
    let owner=id[2]
    let desc=$(this).parent().parent().parent().find("#desc").text()
    ////console.log(type,name,price,status,desc)
    $(".success-box").hide();
    document.getElementById('id01').style.display="block"
    $('.fail-button-box').click(function () {
        $.ajax({
            type:'POST',
            contentType:'application/json',
            url:'./remove_meal',
            data:JSON.stringify(
                {
                    owner:owner,
                    name:name,
                    price:price,
                    type:type,
                }
            ),
            success: function(res) {
                if(res=="true"){
                    document.getElementById("id01").className = "modal animate__animated animate__zoomOut";
                    setTimeout(function(){window.location.reload()}, 888);
            }
            }
        });
    });
    
}); 


$(document).on('click', '#del-all', function(){ //del all type
    let type=$(this).val()
    $(".success-box").hide();
    document.getElementById('id01').style.display="block"
    $('.fail-button-box').click(function () {
        $.ajax({
            type:'POST',
            contentType:'application/json',
            url:'./delete_type',
            data:JSON.stringify(
                {
                    type:type,
                }
            ),
            success: function(res) {
                if(res=="true"){
                    document.getElementById("id01").className = "modal animate__animated animate__zoomOut";
                    setTimeout(function(){window.location.reload()}, 888);
            }
            }
        });
    });
    
}); 

$.ajax({
    type:'POST',
    contentType:'application/json',
    url:'./getOwnerMenu',
    data:JSON.stringify(
        {
            role:"owners"
        }
    ),
    success: function(res) {
        res=JSON.parse(res)
        ////console.log(res)
        if(res[0]!="False"){
            for(let i=0; i<res.length;i++){
            if(res[i][7]=="oos"){
                let id=res[i][7].toLowerCase().toString()
                let parent=document.getElementById(id)
                if(parent.getElementsByClassName("content")[parent.getElementsByClassName("content").length-1]===undefined){
                     $('#'+id).append( 
                        '<div class="content">'+
                        '</div>'
                     )}
                if(parent.getElementsByClassName("content")[parent.getElementsByClassName("content").length-1].getElementsByClassName("cardOwner").length==3){
                    $('#'+id).append( 
                    '<div class="content">'+
                    '</div>')
                }
                $('#'+id+" .content").last().append(
                    '<div class="cardOwner">'+
                    '<div class="icon"><img src="'+res[i][5]+'"></div>'+
                    '<p class="title" id="title">'+res[i][1]+'</p>'+
                    '<p class="text" id="desc">'+res[i][4]+'</p><br><br>'+
                    '<p class="text" id="price">Price:'+res[i][3]+'$ </p> '+
                    '<div class="text">'+
                        '<div id="containerButton">'+
                            '<button class="learn-more edit" id="'+res[i][1]+','+res[i][3]+','+res[i][2]+','+res[i][6].toLowerCase()+','+res[i][7]+'">'+
                                  '<span class="circle" aria-hidden="true">'+
                                    '<span class="icon arrow"></span>'+
                                  '</span>'+
                                  '<span class="button-text">Edit</span>'+
                                '</button>'+
                          '</div>'+
                        '<div id="containerButton">'+
                            '<button class="learn-more delete" id="'+res[i][1]+','+res[i][3]+','+res[i][2]+','+res[i][6].toLowerCase()+','+res[i][7]+'">'+
                                  '<span class="circle" aria-hidden="true">'+
                                    '<span class="icon arrow"></span>'+
                                  '</span>'+
                                  '<span class="button-text">Remove</span>'+
                                '</button>'+
                          '</div>'+
                    '</div>'+ 
                '</div>'
                )
            }
            else{
                let id=res[i][6].toLowerCase().toString()
                let parent=document.getElementById(id)
                if(parent.getElementsByClassName("content")[parent.getElementsByClassName("content").length-1]===undefined){
                     $('#'+id).append( 
                        '<div class="content">'+
                        '</div>'
                     )}
                if(parent.getElementsByClassName("content")[parent.getElementsByClassName("content").length-1].getElementsByClassName("cardOwner").length==3){
                    $('#'+id).append( 
                    '<div class="content">'+
                    '</div>')
                }
                $('#'+id+" .content").last().append(
                    '<div class="cardOwner">'+
                    '<div class="icon"><img src="'+res[i][5]+'"></div>'+
                    '<p class="title" id="title">'+res[i][1]+'</p>'+
                    '<p class="text" id="desc">'+res[i][4]+'</p><br><br>'+
                    '<p class="text" id="price">Price:'+res[i][3]+'$ </p> '+
                    '<div class="text">'+
                        '<div id="containerButton">'+
                            '<button class="learn-more edit" id="'+res[i][1]+','+res[i][3]+','+res[i][2]+','+res[i][6].toLowerCase()+','+res[i][7]+'">'+
                                  '<span class="circle" aria-hidden="true">'+
                                    '<span class="icon arrow"></span>'+
                                  '</span>'+
                                  '<span class="button-text">Edit</span>'+
                                '</button>'+
                          '</div>'+
                        '<div id="containerButton">'+
                            '<button class="learn-more delete" id="'+res[i][1]+','+res[i][3]+','+res[i][2]+','+res[i][6].toLowerCase()+','+res[i][7]+'">'+
                                  '<span class="circle" aria-hidden="true">'+
                                    '<span class="icon arrow"></span>'+
                                  '</span>'+
                                  '<span class="button-text">Remove</span>'+
                                '</button>'+
                          '</div>'+
                    '</div>'+ 
                '</div>'
                )
            }
        }
        setTimeout(function(){$('.loader').hide();$('.register').show()});
        }
    }
});


$(document).ready(function(){
    $(document).on('click', '.link', function(){
        let test=$(this).find(".text").text().toLowerCase()
        test='#'+test;
        //console.log(test)
        $('html, body').animate({
            scrollTop: $(test).offset().top
        }, 800);
    })
})
$('.register').hide()

function check(){
        $.ajax({
            type:'GET',
            contentType:'application/json',
            url:'./getOrderHistoryOwner',
            data:JSON.stringify(
            ),
            success: function(res) {
                let needConfirm=0;
                res=JSON.parse(res);
                for(let i = 0 ;i < res[0].length;i++){
                    if(res[0][i][13]=="Waiting owner confirm") needConfirm=1;
                }
                if(needConfirm==1){

                    $('.success-button-box').on('click', function() {
                        window.location="./orderowner"
                    })
                    document.getElementById("pemote-success").innerHTML = "There is orders need you to confirm";
                    $('#error-box').hide();document.getElementById('id01').style.display='block'
                }
            }
        });
}
var intervalId = window.setInterval(function(){
    check()
}, 3000);