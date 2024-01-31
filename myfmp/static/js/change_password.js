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

    var password = $("#password").val();
    if (password !== 'New password' && password !== '') { 
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
                    password: password,
                    'g-recaptcha-response': recaptchaToken  // Include reCAPTCHA token in the data
                },
                headers: {
                    'X-CSRFToken': getCSRFToken()
                },
                success: function(response) {
                    // Check if the response has a 'success2' key (indicating success)
                    if ('success' in response) {
                        window.location.href = "/main";
                    }else{
                        $("#sign_in_form").show();
                        $("#register").show();
                        $("#loader").hide();
                        var myElement = document.getElementById('password');
                        myElement.style.color = 'red';
                        animateAccessDenied();
                    }
                }
            });
        });
    });
    }else{
      animateAccessDenied();
    }
}