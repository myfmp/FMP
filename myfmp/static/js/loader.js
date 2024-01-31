// script.js

document.addEventListener("DOMContentLoaded", function () {
    // Display the loader and overlay
    document.getElementById("pulse").style.display = "block";
    document.querySelector(".overlay_2").style.display = "block";
  
    // Wait for 2 seconds before hiding the loader, overlay, and making the content visible
    setTimeout(function () {
      // Hide the loader, overlay
      document.getElementById("pulse").style.display = "none";
      document.querySelector(".overlay_2").style.display = "none";
  
      // Make the content wrapper visible with a smooth transition
      document.getElementById("contentWrapper").style.opacity = "1";
      document.getElementById("contentWrapper").style.visibility = "visible";
    }, 4000);
  });
  