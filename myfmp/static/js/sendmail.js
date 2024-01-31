function getCSRFToken3() {
    var csrfToken = null;
    document.cookie.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        if (parts[0].trim() == 'csrftoken') {
        csrfToken = parts[1].trim();
        }
    });
    return csrfToken;
}

function Sendmail() {
    // Get the query parameters from the current URL
    var urlParams = new URLSearchParams(window.location.search);

    // Access individual query parameters
    var mail = urlParams.get('mail');
    // Send an AJAX request to the same URL with CSRF token
    $.ajax({
        url: window.location.href,
        method: "POST",
        data: { resend_mail: mail },
        headers: {
          'X-CSRFToken': getCSRFToken3()
        },
        success: function(response) {
          // Check if the response has a 'message' key (indicating success)
          console.log('processed');
        }
      });
}

function animateContainer2() {
  var slideDistance = 300;
  var bounceHeight = 100;
  var slideDuration = 700;
  var bounceDuration = 300;

  // Slide up animation
  function slideUp() {
    $('#container2').slideDown(slideDuration, function() {
      // After sliding down, bounce up
      bounceUp();
    });
  }

  // Bounce animation
  function bounceUp() {
    $('#container2').animate({ marginTop: '-=' + bounceHeight }, bounceDuration, function() {
      // After bouncing up, bounce down a bit
      $('#container2').animate({ marginTop: '+=' + bounceHeight }, bounceDuration);
    });
  }

  // Start the animation
  slideUp();
}

$(document).ready(function () {
  animateContainer2();
  var activationTimes = [1, 6, 11]; // in minutes
  var activationIndex = 0;
  var countdownInterval;

  // Function to get the remaining time from localStorage
  function getRemainingTime() {
      var storedTime = localStorage.getItem('remainingTime');
      return storedTime ? parseInt(storedTime, 10) : null;
  }

  // Function to save the remaining time to localStorage
  function saveRemainingTime(remainingTime) {
      localStorage.setItem('remainingTime', remainingTime);
  }

  // Function to update the button and start the countdown
  function updateButton() {
      var buttonText = $('#buttonText');
      var timedButton = $('#timedButton');

      if (activationIndex < activationTimes.length) {
          var activationTime = activationTimes[activationIndex];
          var remainingTime = getRemainingTime();

          if (remainingTime === null || remainingTime <= 0) {
              remainingTime = activationTime * 60;
              saveRemainingTime(remainingTime);
          }

          buttonText.text(`Resend (${activationTime}m)`);

          timedButton.prop('disabled', true);
          timedButton.css('opacity', 0.5); // Reduced opacity for disabled state

          clearInterval(countdownInterval);

          countdownInterval = setInterval(function () {
              var minutes = Math.floor(remainingTime / 60);
              var seconds = remainingTime % 60;

              buttonText.text(`Resend (${minutes}:${seconds < 10 ? '0' : ''}${seconds})`);

              if (remainingTime > 0) {
                  saveRemainingTime(remainingTime);
              } else {
                  buttonText.text("Resend");
              }

              if (remainingTime <= 0) {
                  clearInterval(countdownInterval);
                  timedButton.prop('disabled', false);
                  timedButton.css('opacity', 1);
                  // Clear the remaining time from localStorage when the countdown is complete
                  localStorage.removeItem('remainingTime');
              }

              remainingTime--;
          }, 1000); // Update every second
      } else {
          buttonText.text("Button Disabled");
          timedButton.prop('disabled', true);
          timedButton.css('opacity', 0.5);

          // Reset button after final countdown
          setTimeout(function () {
              timedButton.prop('disabled', false);
              timedButton.css('opacity', 1);
              activationIndex = 0;
              updateButton();
          }, activationTimes[activationTimes.length - 1] * 60000);
      }
  }

  $('#timedButton').click(function () {
      activationIndex++;
      updateButton();
  });

  updateButton(); // Initial update
});