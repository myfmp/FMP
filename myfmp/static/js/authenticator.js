$(document).ready(function () {
    // Handle click on "choose" button for faculties
    $('.status-button.faculties').on('click', function () {
      // Hide faculties, show levels
      $('#initial').slideUp();
      $('#faculties').slideUp();
      $('#second').slideDown();
      $('#levels').slideDown();
    });

    // Handle click on "choose" button for levels
    $('.status-button.levels').on('click', function () {
      // Hide levels, show success
      $('#second').hide();
      $('#levels').slideUp();
      $('#end').slideDown();
    });

    // Handle click on "back" button from levels to faculties
    $('.back-to-faculties').on('click', function () {
      // Hide levels, show faculties
      $('#second').slideUp();
      $('#levels').slideUp();
      $('#initial').slideDown();
      $('#faculties').slideDown();
    });
  });

  function Add_Uni(uni) {

    // Get the current URL
    var currentUrl = window.location.href;

    // Create a URLSearchParams object from the current URL
    var urlParams = new URLSearchParams(window.location.search);

    // Add or update a query parameter
    urlParams.set('UNI', uni);

    // Create a new URL with the updated query parameters
    var updatedUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;

    // Use pushState to update the URL without refreshing the page
    history.pushState(null, null, updatedUrl);

  }

  function Add_Year(year) {

    // Get the current URL
    var currentUrl = window.location.href;

    // Create a URLSearchParams object from the current URL
    var urlParams = new URLSearchParams(window.location.search);

    // Add or update a query parameter
    urlParams.set('YEAR', year);

    // Create a new URL with the updated query parameters
    var updatedUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;

    // Use pushState to update the URL without refreshing the page
    history.pushState(null, null, updatedUrl);

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

function Submit() {

  // Get the query parameters from the current URL
  var urlParams = new URLSearchParams(window.location.search);

  // Access individual query parameters
  var tmp = urlParams.get('tmp');
  var uni = urlParams.get('UNI');
  var year = urlParams.get('YEAR');

  // Send an AJAX request to the same URL with CSRF token
  $.ajax({
    url: window.location.href,
    method: "POST",
    data: { tmp: tmp, uni : uni, year: year },
    headers: {
      'X-CSRFToken': getCSRFToken()
    },
    success: function(response) {
      // Check if the response has a 'message' key (indicating success)
      if ('success' in response) {
        window.location.href = "/";
      } else {
        alert('Oops 😖 , something went wrong ....')
      }
    }
  });

}