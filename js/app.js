//Animation
$('#Register-Table').hide()
$('.nav-tabs').on('click', function() {
    setTimeout(function() {
        document.location.reload()
  }, 1);
});

if(document.URL.includes("#Client")){
    $('#license').hide()
    $('#Login-Table').hide()
    $('#Register-Table').show()
    document.getElementById("Client-Register").className = "nav-link active";
    document.getElementById("Driver-Register").className = "nav-link";
    document.getElementById("Owner-Register").className = "nav-link";

}
else if(document.URL.includes("#Driver")){
    $('#Login-Table').hide()
    $('.address2').hide()
    $('#Register-Table').show()
    document.querySelector('#license').required = true;
    document.getElementById("Client-Register").className = "nav-link";
    document.getElementById("Driver-Register").className = "nav-link active";
    document.getElementById("Owner-Register").className = "nav-link";
}
else if(document.URL.includes("#Owners")){
    $('#license').hide()
    $('#Login-Table').hide()
    $('#Register-Table').show()
    document.getElementById("Client-Register").className = "nav-link";
    document.getElementById("Driver-Register").className = "nav-link";
    document.getElementById("Owner-Register").className = "nav-link active";
}
if(document.URL.includes("#Login-Client")){
    $('#Login-Table').show()
    $('#Register-Table').hide()
    document.getElementById("Client-Login").className = "nav-link active";
    document.getElementById("Driver-Login").className = "nav-link";
    document.getElementById("Owner-Login").className = "nav-link";

}
else if(document.URL.includes("#Login-Driver")){
    $('#Login-Table').show()
    $('#Register-Table').hide()
    document.querySelector('#license').required = true;
    document.getElementById("Client-Login").className = "nav-link";
    document.getElementById("Driver-Login").className = "nav-link active";
    document.getElementById("Owner-Login").className = "nav-link";
}
else if(document.URL.includes("#Login-Owners")){
    $('#Login-Table').show()
    $('#Register-Table').hide()
    document.getElementById("Client-Login").className = "nav-link";
    document.getElementById("Driver-Login").className = "nav-link";
    document.getElementById("Owner-Login").className = "nav-link active";
}
let role=document.getElementsByClassName("nav-link active")[0].innerHTML;;
//console.log(role)
$(document).ready(function() {
    $('.btnLogin').on('click', function() {
        document.getElementById("Register-Table").className = "container register animate__animated animate__rollOut";
        setTimeout(function() {
            window.location="./index.html"
        }, 888);
    })
});
    $(document).ready(function() {
        $('.btnRegiter').on('click', function() {
            document.getElementById("Login-Table").className = "container register animate__animated animate__rollOut";
            setTimeout(function() {
                $('#Login-Table').hide()
                $('#Register-Table').show()
                $('.license').hide()
                document.getElementById("Register-Table").className = "container register animate__animated animate__rollIn";
                window.location="./index.html#Client"
            }, 1000);
        })
    });
$('.success-button-box').on('click', function() {
        window.location="./index.html"
})
$('.fail-button-box').on('click', function() {
    document.getElementById('id01').style.display='none'
})
    //function
// let dict={}; //will store user information
// $('#register-password, #confirm-password').on('keyup', function () {
//     if ($('#register-password').val() == $('#confirm-password').val()) {
//       $('#message').html('Matching').css('color', 'green');
//     } else 
//       $('#message').html('Not Matching').css('color', 'red');
//   });
// function checkUsername() {
//     var x = document.getElementById("user-email").value;
//     if(x in dict)
//     document.getElementById("email-already-exists").innerHTML = "It looks like you are already a Member."
//     else{
//         document.getElementById("email-already-exists").innerHTML = ""
//     }
//     Object.keys(dict).forEach(function(key) {
//         if (dict[key]["phone-number"] == document.getElementById("phone").value) {
//             document.getElementById("phone-already-exists").innerHTML = "It looks like you are already a Member."
//         }
//         else{
//             document.getElementById("phone-already-exists").innerHTML = ""
//         }
//       });
// }
// let currentPhone=false;
// $(document).ready(function() {
//     $('#Register').on('click', function() { //when user click register
//     if($('.Register-Table')){
//         let username=$('#user-email').val()
//         let currentPath=document.URL; //current path use to see which role are a person registered.
//         //check if phone exists
//         Object.keys(dict).forEach(function(key) {
//             if (dict[key]["phone-number"] == document.getElementById("phone").value) {
//                 currentPhone=true
//             }
//             else{
//                 currentPhone=false;
//             }
//           });
//         //console.log(currentPhone)
//         if( currentPhone==false && ($('#user-email').val() in dict)==false){  //search if username exists
//             if($('#register-password').val()===$('#confirm-password').val()){//confirm the password if its match  
//                 let address=$('add1').val()+" "+$('add2').val();
//                 if(currentPath.includes('#Client')){// if register as client
//                     dict[username]=
//                         {
//                             "username":$('#user-email').val(),
//                             "password":$('#register-password').val(),
//                             "first":$('#first').val(),
//                             "last":$('#last').val(),
//                             "email":$('#user-email').val(),
//                             "phone-number":$('#phone').val(),
//                             "address":address,
//                             "role":"Client"
//                             }
//                             //console.log(dict)
//                         }
//                 else if(currentPath.includes('#Driver')){//if register as driver
//                     dict[username]=
//                         {
//                             "username":$('#user-email').val(),
//                             "password":$('#register-password').val(),
//                             "first":$('#first').val(),
//                             "last":$('#last').val(),
//                             "email":$('#user-email').val(),
//                             "phone-number":$('#phone').val(),
//                             "address":$('add1').val(),
//                             "license":$('license').val(),
//                             "role":"Driver"
//                             }
//                         }
//                 else{////if register as Owner
//                     dict[username]=
//                         {
//                             "username":$('#user-email').val(),
//                             "password":$('#register-password').val(),
//                             "first":$('#first').val(),
//                             "last":$('#last').val(),
//                             "email":$('#user-email').val(),
//                             "phone-number":$('#phone').val(),
//                             "address":$('add1').val()+" "+$('add2').val(),
//                             "role":"Owner"
//                             }
//                         }
//                     }
//             }
//         }
//     })
// })

$(document).ready(function (){
    $('#Register').on('click', function() {
    let allFilled=true;    
    //console.log($('#user-email').val())
    if($('#user-email').val()==""){
        //console.log("123")
        document.getElementById("pemote-fail").innerHTML = "Please enter email";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if(!document.getElementById('user-email').value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
        document.getElementById("pemote-fail").innerHTML = "Please enter valid email";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#phone').val()==""){
        document.getElementById("pemote-fail").innerHTML = "Please enter phone";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#phone').val().length!==10){
        document.getElementById("pemote-fail").innerHTML = "Please enter valid phone";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#first').val()==""){
        document.getElementById("pemote-fail").innerHTML = "Please enter your first name";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#last').val()==""){
        document.getElementById("pemote-fail").innerHTML = "Please enter your last name";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#add1').val()==""){
        document.getElementById("pemote-fail").innerHTML = "Please enter your address";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#city').val()==""){
        document.getElementById("pemote-fail").innerHTML = "Please enter city";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#state').val()==""){
        document.getElementById("pemote-fail").innerHTML = "Please enter state";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#zip').val()==""){
        document.getElementById("pemote-fail").innerHTML = "Please enter zip code";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#zip').val().length!==5){
        document.getElementById("pemote-fail").innerHTML = "Please enter valid zip code";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if(document.URL.includes("#Driver")){
        if($('#license').val()==""){
            document.getElementById("pemote-fail").innerHTML = "Please enter your driver license #";
            $('#success-box').hide;document.getElementById('id01').style.display='block'
            allFilled=false;
        }
    }
    else if($('#register-password').val()==""){
        document.getElementById("pemote-fail").innerHTML = "Please enter your password";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#register-password').val().length<8){
        document.getElementById("pemote-fail").innerHTML = "Please enter password length min 8";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#confirm-password').val()==""){
        document.getElementById("pemote-fail").innerHTML = "Please confirm your password";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else if($('#register-password').val()!=$('#confirm-password').val()){
        document.getElementById("pemote-fail").innerHTML = "Password didn't match";
        $('#success-box').hide;document.getElementById('id01').style.display='block'
        allFilled=false;
    }
    else{
        allFilled=true;
    }
    if(allFilled){
        let role='customer';
        if(document.URL.includes('#Client')){
            role='customer'
        }
        if(document.URL.includes('#Owner')){
            role='owners'
        }
        if(document.URL.includes('#Driver')){
        let email=$('#user-email').val();
        let phone=$('#phone').val();
        let fname=$('#first').val();
        let lname=$('#last').val();
        let license=$('#license').val();
        let address=$('#add1').val() + ', '+ $('#city').val() + ', ' + $('#state').val() + ', '+ $('#zip').val();
        let password= $('#register-password').val();
        $.when(
            $.ajax({
                type:'POST',
                contentType:'application/json',
                url:'./register',
                data:JSON.stringify(
                    {
                        username:email,
                        password:password,
                        phone:phone,
                        first:fname,
                        last:lname,
                        add:address,
                        license:license,
                        role:'driver'
                    }
                ),
                success: function(data){
                    if(data=='true'){
                        $('#error-box').hide();
                        $('#success-box').show();
                        document.getElementById('id01').style.display='block';
                    }
                    else{
                        document.getElementById("pemote-fail").innerHTML = "Email or phone has been already registered";
                        $('#error-box').show();
                        $('#success-box').hide();
                        document.getElementById('id01').style.display='block';
                    }
                }
            })
        )
    }
    else{
            let email=$('#user-email').val();
            let phone=$('#phone').val();
            let fname=$('#first').val();
            let lname=$('#last').val();
            let address=$('#add1').val() + ', '+ $('#city').val() + ', ' + $('#state').val() + ', '+ $('#zip').val();
            let password= $('#register-password').val();
            $.when(
                $.ajax({
                    type:'POST',
                    contentType:'application/json',
                    url:'./register',
                    data:JSON.stringify(
                        {
                            username:email,
                            password:password,
                            phone:phone,
                            first:fname,
                            last:lname,
                            add:address,
                            role:role
                        }
                    ),
                    success: function(data){
                        //console.log(data)
                        if(data=='true'){
                            $('#error-box').hide();
                            $('#success-box').show();
                            document.getElementById('id01').style.display='block';
                        }
                        else{
                            document.getElementById("pemote-fail").innerHTML = "Email or phone has been already registered";
                            $('#error-box').show();
                            $('#success-box').hide();
                            document.getElementById('id01').style.display='block';
                        }
                    }
                })
            )
    }
    }
    // else{
    //     $('#success-box').hide;document.getElementById('id01').style.display='block'
    // }

    })
})
$("#register-form-1").submit(function(e) {
    e.preventDefault();
});
// $.ajax({
//     url: "./test",
//     type: 'GET',
//     dataType: 'json', // added data type
//     success: function(res) {
//         //console.log(res);
//     }
// });
$(document).ready(function() {

    $('#login').on('click', function() {
        let username=$('#username').val();
        let password=$('#login-password').val();
        let role="customer";
        if(document.URL.includes('#Login-Client')){
            role='customer'
        }
        else if(document.URL.includes('#Login-Driver')){
            role='driver'
        }
        else if(document.URL.includes('#Login-Owners')){
            role='owners'
        }
        $.ajax({
            type:'POST',
            contentType:'application/json',
            url:'./login',
            data:JSON.stringify(
                {
                    username:username,
                    password:password,
                    role:role
                }
            ),
            success: function(res) {
                //console.log(res)
                if(res=='true'){
                    if(role=='customer'){
                    window.location = "./home";
                    }
                    else if(role=='driver'){
                        window.location = "./driverHome"
                    }
                    else{
                        window.location = "./ownerHome"
                    }
                    //console.log(role)
                }
                else{
                    //console.log("False")
                    document.getElementById("pemote-fail-02").innerHTML = "Wrong email or password.";
                    $('#error-box').show();
                    $('#success-box').hide();
                    document.getElementById('id02').style.display='block';
                }
            }
        });
    })
});
