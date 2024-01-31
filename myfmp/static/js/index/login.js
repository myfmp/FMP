function animateAccessDenied() {
    var inputElement = $(".input");
    // Apply red color and animate left-right movement
    inputElement.css({ 'color': 'red', position: 'relative' })
        .animate({ left: '-10px' }, 50)
        .animate({ left: '10px' }, 50)
        .animate({ left: '0px' }, 50)
        .animate({ left: '-10px' }, 50)
        .animate({ left: '10px' }, 50)
        .animate({ left: '0px' }, 50)
        .animate({ 'color': 'initial' }, 250); // Return to initial color
}

function isValidEmail(email) {
    // Regular expression for basic email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getCSRFToken() {
    var csrfToken = null;
    document.cookie.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        if (parts[0].trim() == 'csrftoken') {
        csrfToken = parts[1].trim();
        }
    });
    return csrfToken;
}

function sendData() {
    // Get the input values
    var mail = $("#mail").val();
    var password = $("#password").val();
    if (mail !== 'E-mail' && mail !== '' && password !== 'Password' && password !== ''  && isValidEmail(mail)) { 
    $("#sign_in_form").hide();
    $("#register").hide();
    $("#loader").show();
    // Get the reCAPTCHA v3 response token
    grecaptcha.ready(function() {
        grecaptcha.execute('6Lcs6TkpAAAAAKZwMToZLWd-qNsnwgxBwr9c1NNn', { action: 'submit_form' }).then(function(recaptchaToken) {
            // Send an AJAX request to the Django view with CSRF token and reCAPTCHA token
            $.ajax({
                url: window.location.href,
                method: "POST",
                data: {
                    mail: mail,
                    password: password,
                    'g-recaptcha-response': recaptchaToken  // Include reCAPTCHA token in the data
                },
                headers: {
                    'X-CSRFToken': getCSRFToken()
                },
                success: function(response) {
                    // Check if the response has a 'success2' key (indicating success)
                    if ('success' in response) {
                        window.location.href = "main";
                    } else if ('success2' in response) {
                        window.location.href = "/mailer?mail="+mail;
                    }else{
                        $("#sign_in_form").show();
                        $("#register").show();
                        $("#loader").hide();
                        var myElement = document.getElementById('mail');
                        myElement.style.color = 'red';
                        var myElement = document.getElementById('password');
                        myElement.style.color = 'red';
                        var newHref = "/back_up?mail="+mail;
                        $('#link').attr('href', newHref);
                        animateAccessDenied();
                        $('#forgot_password').css("display", "flex");
                    }
                }
            });
        });
    });
    }else{
      animateAccessDenied();
    }
}