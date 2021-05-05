$(".register").hide()

$('.success-button-box').on('click', function() {
    window.location="./index.html"
})
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
        //////console.log(res)
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

$.ajax({
    type:'GET',
    contentType:'application/json',
    url:'./getCart',
    data:JSON.stringify(
        {
            role:"customer"
        }
    ),
    success: function(res) {
        res=JSON.parse(res)
        ////console.log(res)
        ////console.log(res=='')
        if(res==''){
            $(".register-right").last().prepend(
                '<br><h2>Order Summary</h2> <br>'+
            '<h4 style="float: left;">Order from:</h4><br><br>'+
            '<h5 style="float: left;">Your cart is empty</h5><br></br>'+
                '<hr>'+
                '<h5 style="float: left;">subtotal:</h6>'+
                '<p style="float: right;" id="total-sub">0.00$</p><br><br>'+
                '<p style="float: left;" id="total-items">Total:0 Items</p><br>'+
                '<hr>'+
                '<p style="float: left;">Delivery Fee:</p>'+
                '<p style="float: right;">0.00$</p><br><br>'+
                '<p style="float: left;">Fees & Estimated Tax:</p>'+
                '<p style="float: right;" id="fee-tax">0.00$</p><br>'+
                '<hr>'+
                '<p>Driver Tip</p>'+
                '<div class="radio-group" style="background-color: #332f35;">'+
                    '<input type="radio" id="option-one" name="selector" value="3" ><label id="radioL" for="option-one">$0</label>'+
                    '<input type="radio" id="option-two" name="selector" value="4"><label id="radioL"for="option-two">$0</label>'+
                    '<input type="radio" id="option-three" name="selector" value="5"><label id="radioL"for="option-three">$0</label>'+
                    '<input type="radio" id="option-four" name="selector" value="other" checked="checked"><label id="radioL" for="option-four">Other</label>'+
                    '<input type="number" id="otherTips" placeholder="Tip">'+
                '</div>'+
                '<hr>'+
                '<p style="float: left;">Total</p>'+
                '<p style="float: right;" id="totalPrice">0.00$</p><br>'+
                '<hr>'
            )
        }
        const storeName=res[0][2]
        let totalSub=0.00;
        let totalItem=0;
        const deliveryFee=3.99
        for(let i=0;i<res.length;i++){   
            totalSub=(parseFloat(totalSub)+(parseFloat(res[i][3])*parseFloat(res[i][4]))).toFixed(2);
            totalItem+=parseInt(res[i][4]);
            if(document.getElementsByClassName("content")[document.getElementsByClassName("content").length-1].getElementsByClassName("cardATC").length==3){
                $(".register-left").append(
                    '<div class="content">'+
                    '</div>'
                )
            }     
            $(".register-left .content").last().append(
                    '<div class="cardATC" id="' +res[i][5].replace(' ','-')+'">'+
                    '<div class="icon"><img src="' + "./img/" + res[i][6] + ".png" + '"></div>'+
                    '<p class="title" id="title'+res[i][5]+'">'+res[i][5]+'</p>'+
                    '<p class="text" id="Quality">Quality: '+res[i][4]+ '</p>' +
                    '<p class="text" id="price">Total: $'+ (parseFloat(res[i][3])*parseFloat(res[i][4])).toFixed(2) +'</p>'+
                    '<div class="text">'+
                        '<div id="containerButton">'+
                        '<button class="learn-more del-from-cart" id="'  + res[i][5] + "," + res[i][6]+","+res[i][3]+','+res[i][4] + ','+storeName+ '"'+'>' +
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
        const fee_tax=parseFloat(totalSub*(0.08875+0.05)).toFixed(2)
        let total=(parseFloat(fee_tax)+parseFloat(deliveryFee)+parseFloat(totalSub)).toFixed(2)
        let summary=[fee_tax,deliveryFee,totalItem,totalSub,storeName]
        ////console.log(summary)
        /*<h2>Order Summary</h2>
            <h4 style="float: left;">Order from:</h4><br><br>
            <h5 style="float: left;">China taste</h5><br>
            <hr>
            <h5 style="float: left;">subtotal:</h6>
            <p style="float: right;">22$</p><br><br>
            <p style="float: left;">Total 1 Items</p><br>
            <hr>
            <p style="float: left;">Delivery Fee:</p>
            <p style="float: right;">3.99$</p><br><br>
            <p style="float: left;">Fees & Estimated Tax:</p>
            <p style="float: right;">2.86$</p><br>
            <hr>
            <p>Driver Tip</p>
            <div class="radio-group" style="background-color: #332f35;">
                <input type="radio" id="option-one" name="selector" value="3"><label for="option-one">$3</label>
                <input type="radio" id="option-two" name="selector" value="4"><label for="option-two">$4</label>
                <input type="radio" id="option-three" name="selector" value="5"><label for="option-three">$5</label>
                <input type="radio" id="option-four" name="selector" value="other"><label for="option-four">Other</label>
                <input type="text" id="otherTips" placeholder="Tip">
            </div>
            <hr>
            <p style="float: left;">Total</p>
            <p style="float: right;">31.85$</p><br>
            <hr> */
            $(".register-right").last().prepend(
                '<br><h2>Order Summary</h2> <br>'+
            '<h4 style="float: left;"  >Order from:</h4><br><br>'+
            '<h5 style="float: left;" id = "store-name" >'+summary[4].replace('-',' ')+'</h5><br></br>'+
                '<hr>'+
                '<h5 style="float: left;">subtotal:</h6>'+
                '<p style="float: right;" id="total-sub">'+summary[3]+'$</p><br><br>'+
                '<p style="float: left;" id="total-items">Total: '+ summary[2] +' Items</p><br>'+
                '<hr>'+
                '<p style="float: left;" >Delivery Fee:</p>'+
                '<p style="float: right;"  id= "delivery-fee">' + summary[1] + '$</p><br><br>'+
                '<p style="float: left;" >Fees & Estimated Tax:</p>'+
                '<p style="float: right;" id="fee-tax">'+summary[0]+'$</p><br>'+
                '<hr>'+
                '<p>Driver Tip</p>'+
                '<div class="radio-group" style="background-color: #332f35;">'+
                    '<input type="radio" id="option-one" name="selector" value="3" ><label id="radioL" for="option-one">$3</label>'+
                    '<input type="radio" id="option-two" name="selector" value="4"><label id="radioL"for="option-two">$4</label>'+
                    '<input type="radio" id="option-three" name="selector" value="5"><label id="radioL"for="option-three">$5</label>'+
                    '<input type="radio" id="option-four" name="selector" value="other" checked="checked"><label id="radioL" for="option-four">Other</label>'+
                    '<input type="number" id="otherTips" placeholder="Tip">'+
                '</div>'+
                '<hr>'+
                '<p style="float: left;">Total</p>'+
                '<p style="float: right;" id="totalPrice">'+total+'$</p><br>'+
                '<hr>'
            )
            $(document).ready(function(){
                $(document).on('click','.radio-group input', function() {
                    if($('input[name=selector]:checked').val()=='other'){
                        $('#otherTips').show()
                        document.getElementById("totalPrice").innerHTML=total +"$"
                        $('#otherTips').keyup(function(e){
                            if($('#otherTips').val()==''){
                                document.getElementById("totalPrice").innerHTML=(parseFloat(total) +parseFloat(0)).toFixed(2)+"$"
                            }
                            else document.getElementById("totalPrice").innerHTML=(parseFloat(total) +parseFloat($('#otherTips').val())).toFixed(2)+"$"
                        })
                    }
                    else{
                        $('#otherTips').hide()
                        let newTotal=parseFloat(total)+parseInt($('input[name=selector]:checked').val())
                        document.getElementById("totalPrice").innerHTML=newTotal+"$"
                    }
                 });
            })
            $(document).ready(function(){
                $(document).on('click','.del-from-cart', function() {
                    ////console.log($(this).attr('id').split(','))
                    let id=$(this).attr('id').split(',')[0].replace(' ','-')
                    let productTitle=$(this).attr('id').split(',')[0]
                    let owner=$(this).attr('id').split(',')[4]
                    let type=$(this).attr('id').split(',')[1]
                    let count=$(this).attr('id').split(',')[3]
                    let price=$(this).attr('id').split(',')[2]
                    $.ajax({
                        type:'POST',
                        contentType:'application/json',
                        url:'./del-from-cart',
                        data:JSON.stringify(
                            {
                                owner:owner,
                                productTitle:productTitle,
                                type:type
                            }
                        ),
                        success: function(res) {
                            if(res=="true")
                        {        
                            document.getElementById("lblCartCount").innerHTML-=count;
                            ////console.log(document.getElementById("total-sub").innerHTML.replace('$',''))
                            document.getElementById("total-sub").innerHTML=(parseFloat(document.getElementById("total-sub").innerHTML)-(parseFloat(price)*count )).toFixed(2) +'$'
                            const itemCount=parseInt(document.getElementById("total-items").innerHTML.split(' ')[1]) - parseInt(count)
                            document.getElementById("total-items").innerHTML="Total: " + itemCount + " Items"
                            document.getElementById("fee-tax").innerHTML=(parseFloat(document.getElementById("total-sub").innerHTML)*(0.08875+0.05)).toFixed(2) +'$'
                            let tip=0;
                            if($('input[name=selector]:checked').val()=='other'){
                                if($('#otherTips').val()==''){
                                    tip=0;
                                }
                                else{tip=parseFloat($('#otherTips').val()).toFixed(2)}
                            }
                            else{
                                tip=$('input[name=selector]:checked').val()
                            }
                            document.getElementById("totalPrice").innerHTML=(parseFloat(document.getElementById("total-sub").innerHTML)+3.99+parseFloat(document.getElementById("fee-tax").innerHTML)+parseFloat(tip)).toFixed(2) +'$'
                            $('#'+id).remove()
                            total=parseFloat(document.getElementById("totalPrice").innerHTML)
                        }
                        }
                    });
                 });
            })    
    }
});

$('.input-cart-number').on('keyup change', function(){
    $t = $(this);
    
    if ($t.val().length > 3) {
      $t.next().focus();
    }
    
    var card_number = '';
    $('.input-cart-number').each(function(){
      card_number += $(this).val() + ' ';
      if ($(this).val().length == 4) {
        $(this).next().focus();
      }
    })
    
    $('.credit-card-box .number').html(card_number);
  });
  
  $('#card-holder').on('keyup change', function(){
    $t = $(this);
    $('.credit-card-box .card-holder div').html($t.val());
  });
  
  $('#card-holder').on('keyup change', function(){
    $t = $(this);
    $('.credit-card-box .card-holder div').html($t.val());
  });
  
  $('#card-expiration-month, #card-expiration-year').change(function(){
    m = $('#card-expiration-month option').index($('#card-expiration-month option:selected'));
    m = (m < 10) ? '0' + m : m;
    y = $('#card-expiration-year').val().substr(2,2);
    $('.card-expiration-date div').html(m + '/' + y);
  })
  
  $('#card-ccv').on('focus', function(){
    $('.credit-card-box').addClass('hover');
  }).on('blur', function(){
    $('.credit-card-box').removeClass('hover');
  }).on('keyup change', function(){
    $('.ccv div').html($(this).val());
  });





  $('.containerBut').on('click', function() {
         setTimeout(function(){
            document.getElementById('id02').style.display='block'
        }, 0);
        $('.btn').on('click', function() {
            const storeName = document.getElementById("store-name").textContent.toLowerCase().replace(" ","-");
            const subTotal=document.getElementById("total-sub").textContent;
            const taxFee=document.getElementById("fee-tax").textContent;
            const deliveryFee=document.getElementById("delivery-fee").textContent;
            const totalItems=document.getElementById("total-items").textContent;
            const totalPrice=document.getElementById("totalPrice").textContent;
            ////console.log(storeName,subTotal,taxFee,deliveryFee,totalItems,totalPrice)
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();      
            today = mm + '/' + dd + '/' + yyyy;
            var d = new Date().toLocaleTimeString(); // 11:18:48 AM
            today = today + ' - ' + d
            ////console.log(today)
            let tip=0.00;
            if($('input[name=selector]:checked').val()=='other'){
                if($('#otherTips').val()==''){
                    tip=0.00;
                }
                else{tip=parseFloat($('#otherTips').val()).toFixed(2)}
            }
            else{
                tip=parseFloat($('input[name=selector]:checked').val()).toFixed(2)
            }
            ////console.log(tip)
            ////console.log($('#card-number').val() ,$('#card-number-1').val(),$('#card-number-2').val(),$('#card-number-3').val(), $('#card-holder').val(),$('#card-ccv').val())
            if($('#card-number').val().length==4 && $('#card-number-1').val().length==4 &&$('#card-number-2').val().length==4 &&$('#card-number-3').val().length==4 && 
            $('#card-holder').val().length>0 && $('#card-ccv').val().length==3){
                    $.ajax({
                        type:'POST',
                        contentType:'application/json',
                        url:'./placeOrder',
                        data:JSON.stringify(
                            {
                                orderdate:today,
                                storename:storeName,
                                subtotal:subTotal,
                                taxfee:taxFee,
                                totalItems:totalItems,
                                deliverfee:deliveryFee,
                                drivertips:tip,
                                total:totalPrice
                            }
                        ),
                        success: function(res) {
                                window.location="./orderstatus#"+res;
                        }
                    });
                document.getElementById('id02').style.display='none'
            }
            else{
                document.getElementById("pemote-fail").innerHTML = "Please enter all the information";
                $('#success-box').hide();document.getElementById('id01').style.display='block' 
                $('.fail-button-box').on('click', function() {
                    document.getElementById('id01').style.display='none' 
                })
            }
        })
})
$("#cancel_checkout").on('click',function(){
    document.getElementById("id01").style.display='none';

    document.getElementById("id02").style.display='none';
})
setTimeout(function(){$('.loader').hide();$('.register').show()}, 555);




