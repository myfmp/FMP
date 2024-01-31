 function showLoader() {
    $("#loader").show();
  }

  function animateAccessDenied() {
    var inputElement = $("#pin");

    // Apply red color and animate left-right movement
    inputElement.css({ color: 'red', position: 'relative' })
        .animate({ left: '-10px' }, 50)
        .animate({ left: '10px' }, 50)
        .animate({ left: '0px' }, 50)
        .animate({ left: '-10px' }, 50)
        .animate({ left: '10px' }, 50)
        .animate({ left: '0px' }, 50)
        .animate({ color: 'initial' }, 250); // Return to initial color

    // You can adjust the duration and distance of the animation as needed
  }

  function hideLoader() {
    $("#loader").hide();
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
    // Get the input value
    var inputValue = $("#pin").val();

    // Send an AJAX request to the same URL with CSRF token
    $.ajax({
      url: window.location.href,
      method: "POST",
      data: { input_data: inputValue },
      headers: {
        'X-CSRFToken': getCSRFToken()
      },
      success: function(response) {
        // Check if the response has a 'message' key (indicating success)
        if ('sucess' in response) {
            hideLoader();
            $("#register_form").show();
        } else {
            $("#pin").show();
            $("#sign_in").show();
            hideLoader();
            animateAccessDenied();
        }
      }
    });
  }

// Get the input element by its ID
var inputElement = document.getElementById("pin");  // Replace "your_input_field" with the actual ID of your input field

// Add an event listener to check the input length
inputElement.addEventListener("input", function() {
// Check if the input length has reached the maximum (e.g., 10 characters)
if (inputElement.value.length === inputElement.maxLength) {
    $("#pin").hide();
    $("#sign_in").hide();
    showLoader();
    setTimeout(function() {
      sendData();
    }, 2000);
}
});

// Add the keydown event listener
document.addEventListener('keydown', function(event) {
    // Change color on key press (for example, change to red when any key is pressed)
    inputElement.style.color = 'white';
});

