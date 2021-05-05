$("#change-password-form").submit(function(e) {
    e.preventDefault();
});
let role='customer';
if(document.URL.includes('#Client')){
    role='customer'
}
else if(document.URL.includes('#Driver')){
    role='driver'
}
else if(document.URL.includes('#Owner')){
    role='owners'
}
$.when(
    $.ajax({
        type:'POST',
        contentType:'application/json',
        url:'./userProfile',
        data:JSON.stringify(
            {
                role:role
            }
        ),
        success: function(data){
            if(data =='false'){
                window.location="./404"
            }
            document.getElementById("email").value=data["username"];
            document.getElementById("phone").value=data["phone"];
            document.getElementById("first").value=data["first"];
            document.getElementById("last").value=data["last"];
            document.getElementById("city").value=data["city"];
            document.getElementById("state").value=data["state"];
            document.getElementById("zip").value=data["zip"];
            document.getElementById("address").value=data["address"];
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
$("#phone").on("change keyup paste", function(){
    if($("#phone").val()!==""){
        $('#Save').prop('disabled', false);
    }
    else{
        $('#Save').prop('disabled', true);
    }
})
$("#first").on("change keyup paste", function(){
    if($("#first").val()!==""){
        $('#Save').prop('disabled', false);
    }
    else{
        $('#Save').prop('disabled', true);
    }
})
$("#last").on("change keyup paste", function(){
    if($("#last").val()!==""){
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
        ////console.log($('#zip').val().length)

        let validInput=true;
        if(!document.getElementById('email').value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            document.getElementById("pemote-fail").innerHTML = "Please enter valid email";
            $('#success-box').hide();document.getElementById('id02').style.display='block'
            validInput=false;
        }
        else if($('#phone').val().length!==10){
            document.getElementById("pemote-fail").innerHTML = "Please enter valid phone 10 Digit";
            $('#success-box').hide();document.getElementById('id02').style.display='block'
            validInput=false;
        }
        else if($('#zip').val().length!==5){
            document.getElementById("pemote-fail").innerHTML = "Please enter valid zip code";
            $('#success-box').hide();document.getElementById('id02').style.display='block'
            validInput=false;
        }
        if(validInput){
            let address=$('#address').val() + ', '+ $('#city').val() + ', ' + $('#state').val() + ', '+ $('#zip').val();
            $.when(
                $.ajax({
                    type:'POST',
                    contentType:'application/json',
                    url:'./updateProfile',
                    data:JSON.stringify(
                        {
                            email:document.getElementById("email").value,
                            phone:document.getElementById("phone").value,
                            first:document.getElementById("first").value,
                            last:document.getElementById("last").value,
                            add:address,
                            role:role
                        }
                    ),
                    success: function(data){
                        ////console.log(data)
                        if(data=='true'){
                            $('#error-box').hide();$('#success-box').show();document.getElementById('id02').style.display='block'
                        }
                        else if(data=='false Phone'){
                            document.getElementById("pemote-fail").innerHTML = "Phone has already been registered";
                            $('#error-box').show();$('#success-box').hide();document.getElementById('id02').style.display='block'
                        }
                        else if(data=='false Email'){
                            document.getElementById("pemote-fail").innerHTML = "Email has already been registered";
                            $('#error-box').show();$('#success-box').hide();document.getElementById('id02').style.display='block'
                        }
                        else{
                            document.getElementById("pemote-fail").innerHTML = "Email or Phone has already been registered";
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
                        //console.log(data)
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
        if(role == "customer"){
            window.location.href='./home'
        }
        else if(role == "driver"){
            window.location.href='./driverHome'
        }
        else if ( role == "owners"){
            window.location.href='./ownerHome'
        }
    })
})