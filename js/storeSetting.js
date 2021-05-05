$("#change-password-form").submit(function(e) {
    e.preventDefault();
});
$.when(
    $.ajax({
        type:'GET',
        contentType:'application/json',
        url:'./getStoreDetails',
        data:JSON.stringify(
        ),
        success: function(data){
            if(data[0] =='False'){
                window.location="./404"
            }
            const capitalize = (s) => {
                if (typeof s !== 'string') return ''
                return s.charAt(0).toUpperCase() + s.slice(1)
              }
            data=JSON.parse(data)
            //console.log(data)
            const time=data[5].split(" - ")
            //console.log(time)
            const add=data[4].split(", ")
            document.getElementById("name").value=capitalize(data[1].replace("-"," "));
            document.getElementById("description").value=capitalize(data[2]);
            document.getElementById("ownerEmail").value=data[7];
            $("#Time-Open").val(time[0])
            $("#Time-Close").val(time[1])
            $("#Type").val(data[3])
            document.getElementById("city").value=add[1];
            document.getElementById("state").value=add[2];
            document.getElementById("zip").value=add[3];
            document.getElementById("address").value=add[0];
        }
    })
)
// $("#email").on("change keyup paste", function(){
//     if($("#email").val()!==""){
//         $('#Save').prop('disabled', false);
//     }
//     else{
//         $('#Save').prop('disabled', true);
//     }
// })
// $("#name").on("change keyup paste", function(){
//     if($("#name").val()!==""){
//         $('#Save').prop('disabled', false);
//     }
//     else{
//         $('#Save').prop('disabled', true);
//     }
// })
$("#description").on("change keyup paste", function(){
    if($("#description").val()!==""){
        $('#Save').prop('disabled', false);
    }
    else{
        $('#Save').prop('disabled', true);
    }
})
$("#Type").on("change keyup paste", function(){
    if($("#Type").val()!==""){
        $('#Save').prop('disabled', false);
    }
    else{
        $('#Save').prop('disabled', true);
    }
})
$("#city").on("change keyup paste", function(){
    if($("#city").val()!==""){
        $('#Save').prop('disabled', false);
    }
    else{
        $('#Save').prop('disabled', true);
    }
})
$("#state").on("change keyup paste", function(){
    if($("#state").val()!==""){
        $('#Save').prop('disabled', false);
    }
    else{
        $('#Save').prop('disabled', true);
    }
})
$("#address").on("change keyup paste", function(){
    if($("#address").val()!==""){
        $('#Save').prop('disabled', false);
    }
    else{
        $('#Save').prop('disabled', true);
    }
})
$("#zip").on("change keyup paste", function(){
    if($("#zip").val()!==""){
        $('#Save').prop('disabled', false);
    }
    else{
        $('#Save').prop('disabled', true);
    }
})
$("#Time-Close").on("change keyup paste", function(){
    if($("#Time-Close").val()!==""){
        $('#Save').prop('disabled', false);
    }
    else{
        $('#Save').prop('disabled', true);
    }
})
$("#Time-Open").on("change keyup paste", function(){
    if($("#Time-Open").val()!==""){
        $('#Save').prop('disabled', false);
    }
    else{
        $('#Save').prop('disabled', true);
    }
})

$("#profile-form").submit(function(e) {
    e.preventDefault();
});
$('.success-button-box').on('click', function() {
    window.location.reload()
})
$('.fail-button-box').on('click', function() {
document.getElementById('id02').style.display='none'
})
$(document).ready(function (){
    $('#Save').on('click', function() {
        //console.log($('#zip').val().length)

        let validInput=true;
         if($('#zip').val().length!==5){
            document.getElementById("pemote-fail").innerHTML = "Please enter valid zip code";
            $('#success-box').hide();document.getElementById('id02').style.display='block'
            validInput=false;
        }
        if($( "#Time-Open" ).val()=='DH' || $( "#Time-Close" ).val() == 'DH'){
            document.getElementById("pemote-fail").innerHTML = "Please Select Valid Time";
            $('#success-box').hide();document.getElementById('id02').style.display='block'
            validInput=false;
        }
        if(type=$( "#Type" ).val() =="DH"){
            document.getElementById("pemote-fail").innerHTML = "Please Select Valid Type";
            $('#success-box').hide();document.getElementById('id02').style.display='block'
            validInput=false;
        }
        if($( "#description" ).val().length>=50){
            document.getElementById("pemote-fail").innerHTML = "Description should be less than 50 Character";
            $('#success-box').hide();document.getElementById('id02').style.display='block'
            validInput=false;
        }
        if(validInput){
            const address=$('#address').val() + ', '+ $('#city').val() + ', ' + $('#state').val() + ', '+ $('#zip').val();
            const time=$( "#Time-Open" ).val() + " - " + $( "#Time-Close" ).val()
            const name=$( "#name" ).val().replace(" ","-")
            const desc=$( "#description" ).val()
            const type=$( "#Type" ).val()
            const owner=$( "#ownerEmail" ).val()
            let img;
            if(type == "asian"){
                img = "./img/ramen.png"
            }
            else{
                img="./img/"+type+".png"
            }
            //console.log(img)

            $.when(
                $.ajax({
                    type:'POST',
                    contentType:'application/json',
                    url:'./updateStore',
                    data:JSON.stringify(
                        {
                            owner:owner,
                            img:img,
                            time:time,
                            add:address,
                            desc:desc,
                            name:name,
                            type:type
                        }
                    ),
                    success: function(data){
                        ////console.log(data)
                        if(data=='true'){
                            $('#error-box').hide();$('#success-box').show();document.getElementById('id02').style.display='block'
                        }
                        else{
                            document.getElementById("pemote-fail").innerHTML = "Error during updating";
                            $('#error-box').show();$('#success-box').hide();document.getElementById('id02').style.display='block'
                        }
                    }
                })
            )
        }
    })
})
$(document).ready(function (){
    $('.password-change').on('click', function() {
        let allFilled=true;
        if($('#new-pw').val().length<8){
            document.getElementById("pemote-fail").innerHTML = "Please enter password length min 8";
            $('#success-box').hide();document.getElementById('id02').style.display='block'
            allFilled=false;
        }
        else if($('#c-new-pw').val()==""){
            document.getElementById("pemote-fail").innerHTML = "Please confirm your password";
            $('#success-box').hide();document.getElementById('id02').style.display='block'
            allFilled=false;
        }
        else if($('#c-new-pw').val()!=$('#new-pw').val()){
            document.getElementById("pemote-fail").innerHTML = "Password didn't match";
            $('#success-box').hide();document.getElementById('id02').style.display='block'
            allFilled=false;
        }
        if(allFilled){
            $.when(
                $.ajax({
                    type:'POST',
                    contentType:'application/json',
                    url:'./updatePassword',
                    data:JSON.stringify(
                        {
                            oldpw:$('#old-pw').val(),
                            password:$('#new-pw').val(),
                            role:role
                        }
                    ),
                    success: function(data){
                        ////console.log(data)
                        if(data=='true'){
                            $('#error-box').hide();$('#success-box').show();document.getElementById('id02').style.display='block'
                        }
                        else{
                            document.getElementById("pemote-fail").innerHTML = "Old Password Incorrect";
                            $('#error-box').show();$('#success-box').hide();document.getElementById('id02').style.display='block'
                        }
                    }
                })
            )
        }
    })
})
$(document).ready(function (){
    $('#HomeLogo').on('click', function() {
        window.location="./"
    })
})
  