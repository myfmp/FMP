function getCSRFToken2() {
    var csrfToken = null;
    document.cookie.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        if (parts[0].trim() === 'csrftoken') {
            csrfToken = parts[1].trim();
        }
    });
    return csrfToken;
}

function animateAccessDenied2() {
  var inputElement = $(".input");

  // Apply red color and animate left-right movement
  inputElement.css({ 'border-color': 'red', position: 'relative' })
      .animate({ left: '-10px' }, 50)
      .animate({ left: '10px' }, 50)
      .animate({ left: '0px' }, 50)
      .animate({ left: '-10px' }, 50)
      .animate({ left: '10px' }, 50)
      .animate({ left: '0px' }, 50)
      .animate({ color: 'initial' }, 250); // Return to initial color

  // You can adjust the duration and distance of the animation as needed
}

function isValidEmail(email) {
  // Regular expression for basic email validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sendData2() {
    // Get the input values
    var username = $("#user").val();
    var mail = $("#mail").val();
    var password = $("#password").val();
    var inputValue = $("#pin").val();
    if (username !== 'Username' && username !== '' && mail !== 'E-mail' && mail !== '' && password !== 'Password' && password !== '' && isValidEmail(mail)) { 
      $("#register_form").hide();
      $("#container").hide();
      $("#loader").show();
    // Get the reCAPTCHA v3 response token
    grecaptcha.ready(function() {
        grecaptcha.execute('6Lcs6TkpAAAAAKZwMToZLWd-qNsnwgxBwr9c1NNn', { action: 'submit_form' }).then(function(recaptchaToken) {
            // Send an AJAX request to the Django view with CSRF token and reCAPTCHA token
            $.ajax({
                url: window.location.href,
                method: "POST",
                data: {
                    username: username,
                    mail: mail,
                    password: password,
                    input_data: inputValue,
                    'g-recaptcha-response': recaptchaToken  // Include reCAPTCHA token in the data
                },
                headers: {
                    'X-CSRFToken': getCSRFToken2()
                },
                success: function(response) {
                    // Check if the response has a 'success2' key (indicating success)
                    if ('success2' in response) {
                        window.location.href = "/mailer?mail="+mail;
                    } else if ('success3' in response) {
                        window.location.href = "/";
                    }else{
                        setTimeout(function() {
                          $("#loader").hide();
                          $("#container2").show();
                          animateContainer2();
                        }, 100);
                        alert('Oops 😖 , something went wrong ....')
                        window.location.href = "/register";
                    }
                }
            });
        });
    });
    }else{
      animateAccessDenied2();
    }
}


