$(function () {
    $(".menu-link").click(function () {
      $(".menu-link").removeClass("is-active");
      $(this).addClass("is-active");
    });
  });
  
  $(function () {
    $(".main-header-link").click(function () {
      $(".main-header-link").removeClass("is-active");
      $(this).addClass("is-active");
    });
  });

  $('.User-avtar').click(function(){
    if( $(".User-Dropdown").hasClass( "U-open" ) ){
            $('.User-Dropdown').removeClass("U-open");
    }
    else {
            $('.User-Dropdown').addClass("U-open");
    }
  });

  function PickFile () {
    var myButton = document.getElementById('fileID');
    myButton.click();
  }

  function animateAccessDenied() {
    var inputElement = $("#input_title");
    // Apply red color and animate left-right movement
    inputElement.css({position: 'relative' })
        .animate({ left: '-10px' }, 50)
        .animate({ left: '10px' }, 50)
        .animate({ left: '0px' }, 50)
        .animate({ left: '-10px' }, 50)
        .animate({ left: '10px' }, 50)
        .animate({ left: '0px' }, 50)
        .animate({ 'color': 'initial' }, 250); // Return to initial color
  }
  
  const dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("click", e => {
      e.stopPropagation();
      dropdowns.forEach(c => c.classList.remove("is-active"));
      dropdown.classList.add("is-active");
    });
  });
  
  $(".search-bar input").
  focus(function () {
    $(".header").addClass("wide");
  }).
  blur(function () {
    $(".header").removeClass("wide");
  });
  
  $(document).click(function (e) {
    var container = $(".status-button");
    var dd = $(".dropdown");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      dd.removeClass("is-active");
    }
  });
  
  $(function () {
    $(".dropdown").on("click", function (e) {
      $(".content-wrapper").addClass("overlay");
      e.stopPropagation();
    });
    $(document).on("click", function (e) {
      if ($(e.target).is(".dropdown") === false) {
        $(".content-wrapper").removeClass("overlay");
      }
    });
  });
  
  $(function () {
    $(".status-button:not(.open)").on("click", function (e) {
      $(".overlay-app").addClass("is-active");
    });
    $(".pop-up .close").click(function () {
      $(".overlay-app").removeClass("is-active");
    });
  });
  
  $(".status-button:not(.open)").click(function () {
    $(".pop-up").addClass("visible");
  });
  
  $(".pop-up .close").click(function () {
    $(".pop-up").removeClass("visible");
  });
  
  const toggleButton = document.querySelector('.dark-light');
  
  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
  });

  $(document).ready(function() {

    $("#main_link").on("click", function() {
      $(".search_page").css("display", "none");
      $("#uploader").css("display", "none");
      $("#Mycloud").css("display", "none");
      $(".main").fadeIn(1000);
    });

    $("#uploader_link").on("click", function() {
      $(".search_page").css("display", "none");
      $(".main").css("display", "none");
      $("#Mycloud").css("display", "none");
      $("#uploader").fadeIn(1000);
    });

    $("#cloud_link").on("click", function() {
      $(".search_page").css("display", "none");
      $(".main").css("display", "none");
      $("#uploader").css("display", "none");
      $("#Mycloud").fadeIn(1000);
    });

  });

  $(document).ready(function() {

    $("#main_link_2").on("click", function() {
      $("#uploader").css("display", "none");
      $("#Mycloud").css("display", "none");
      $(".main").fadeIn(1000);
      $("#uploader_link").removeClass("is-active");
      $("#cloud_link").removeClass("is-active");
      $("#main_link").addClass("is-active");
    });

    $("#uploader_link_2").on("click", function() {
      $(".main").css("display", "none");
      $("#Mycloud").css("display", "none");
      $("#uploader").fadeIn(1000);
      $("#main_link").removeClass("is-active");
      $("#cloud_link").removeClass("is-active");
      $("#uploader_link").addClass("is-active");
    });

    $("#cloud_link_2").on("click", function() {
      $(".main").css("display", "none");
      $("#uploader").css("display", "none");
      $("#Mycloud").fadeIn(1000);
      $("#main_link").removeClass("is-active");
      $("#uploader_link").removeClass("is-active");
      $("#cloud_link").addClass("is-active");
    });

  });

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

  function LoadSubjects(Semester) {
    // Get the input value
    var semester = Semester;
    // Send an AJAX request to the same URL with CSRF token
    if (semester == "0") {
      $(".semesters").css("display", "none");
      $("#navigator0").css("display", "none");
      $("#navigator3").fadeIn(1000);
      $("#uploader_form").fadeIn(1000);
      var currentUrl = window.location.href;
      var urlParams = new URLSearchParams(window.location.search);
      urlParams.set('course', '0');
      var updatedUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
      history.pushState(null, null, updatedUrl);     
    }else{
      $.ajax({
        url: window.location.href,
        method: "POST",
        data: { semester: semester },
        headers: {
          'X-CSRFToken': getCSRFToken()
        },
        success: function(response) {
          // Check if the response has a 'message' key (indicating success)
          if ('subjects' in response) {
                  // Extract subjects data from the response
                  var subjectsData = response.subjects;
                  // Example: Iterate through subjectsData and create dynamic HTML content
                  var dynamicContent = '';
                  for (var i = 0; i < subjectsData.length; i++) {
                      dynamicContent += '<div class="app-card" style="margin-bottom: 20px;">' +
                          '    <div class="app-card__subtext"> <span style="zoom:120%;">' + subjectsData[i][1] + '</span> </div>' +
                          '    <div class="app-card-buttons">' +
                          '        <button class="content-button status-button" onclick="LoadCourses(\'' + subjectsData[i][2] + '\', \'' + subjectsData[i][0] + '\')">open</button>' +
                          '    </div>' +
                          '</div>';
                  }
                  var subjects = document.getElementById('subjects');
                  subjects.innerHTML = dynamicContent;
                  $(".semesters").css("display", "none");
                  $("#navigator0").css("display", "none");
                  $("#navigator1").fadeIn(1000);
                  $("#subjects").fadeIn(1000);
          }else if ('subject_not_available' in response) {
              alert('Sorry 😖 , subjects not available yet ....')
          }else {
              alert('Oops 😖 , something went wrong ....')
          }
        }
      });
    }
  }

  function LoadCourses(Semester, Subject) {
    // Get the input value
    var semester = Semester;
    var subject = Subject;
    // Send an AJAX request to the same URL with CSRF token
    $.ajax({
      url: window.location.href,
      method: "POST",
      data: {semester : semester  , subject: subject },
      headers: {
        'X-CSRFToken': getCSRFToken()
      },
      success: function(response) {
        // Check if the response has a 'message' key (indicating success)
        if ('courses' in response) {
                // Extract subjects data from the response
                var coursesData = response.courses;
                // Example: Iterate through subjectsData and create dynamic HTML content
                var dynamicContent = '';
                for (var i = 0; i < coursesData.length; i++) {
                    dynamicContent += '<div class="app-card" style="margin-bottom: 20px;">' +
                        '    <div class="app-card__subtext"> <span style="zoom:120%;">' + coursesData[i][1] + '</span> </div>' +
                        '    <div class="app-card-buttons">' +
                        '        <button class="content-button status-button" onclick="LoadUploader(\'' + coursesData[i][0] + '\')">open</button>' +
                        '    </div>' +
                        '</div>';
                }
                var courses = document.getElementById('courses');
                courses.innerHTML = dynamicContent;
                $("#subjects").css("display", "none");
                $("#navigator1").css("display", "none");
                $("#navigator2").fadeIn(1000);
                $("#courses").fadeIn(1000);
        }else {
            alert('Oops 😖 , something went wrong ....')
        }
      }
    });
  }

  function LoadUploader (CourseId) {
    var courseId = CourseId;
    $("#courses").css("display", "none");
    $("#navigator2").css("display", "none");
    $("#navigator3").fadeIn(1000);
    $("#uploader_form").fadeIn(1000);
    var currentUrl = window.location.href;
    var urlParams = new URLSearchParams(window.location.search);
    urlParams.set('course', courseId);
    var updatedUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    history.pushState(null, null, updatedUrl);
  }

  function back1() {
    $("#subjects").css("display", "none");
    $("#navigator1").css("display", "none");
    $("#navigator0").fadeIn(1000);
    $(".semesters").fadeIn(1000);
  }

  function back2() {
    $("#courses").css("display", "none");
    $("#navigator2").css("display", "none");
    $("#navigator1").fadeIn(1000);
    $("#subjects").fadeIn(1000);
  }

  function back3() {
    var urlParams = new URLSearchParams(window.location.search);
    var subjectId = urlParams.get('subject');
    if (subjectId == "0") {
      $("#uploader_form").css("display", "none");
      $("#navigator3").css("display", "none");
      $("#navigator0").fadeIn(1000);
      $(".semesters").fadeIn(1000);
      let filedata = `
      <form method="post" enctype="multipart/form-data">
      <div class="form">
      <h4 style="color:white;">Name your file</h4>
      <div>
      <input id="input_title" type="text" placeholder="eg:(Anatomy notes thorax)" maxlength="25">
      </div>
      <button type="button" onclick="NewLoadedBtnClicked()" id="submit_btn_upload" class="content-button btn">next</button>
      </div>
      </form>`;
      $(".drop_box").html(filedata);
    }else {
      $("#uploader_form").css("display", "none");
      $("#navigator3").css("display", "none");
      $("#navigator2").fadeIn(1000);
      $("#courses").fadeIn(1000);
      let filedata = `
      <form method="post" enctype="multipart/form-data">
      <div class="form">
      <h4 style="color:white;">Name your file</h4>
      <div>
      <input id="input_title" type="text" placeholder="eg:(Anatomy notes thorax)" maxlength="25">
      </div>
      <button type="button" onclick="NewLoadedBtnClicked()" id="submit_btn_upload" class="content-button btn">next</button>
      </div>
      </form>`;
      $(".drop_box").html(filedata);
    }
  }

  // Use event delegation for dynamically added elements
  function NewLoadedBtnClicked () { 
    var title = $("#input_title").val();
    if (title !== '') { 
        var currentUrl = window.location.href;
        var urlParams = new URLSearchParams(window.location.search);
        urlParams.set('title', title);
        var updatedUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
        history.pushState(null, null, updatedUrl);
        let filedata = `
        <form method="post" enctype="multipart/form-data">
            <header> 
                <h4>Select File here</h4>
            </header>
            <p>Files Supported: PDF, TEXT, DOC , DOCX</p>
            <input type="file" hidden accept=".doc,.docx,.pdf,.txt" id="fileID" style="display:none;">
            <button type="button" id="submit_btn_upload_2" onclick="PickFile()" class="content-button btn">Choose File</button>
        </form>`;
        $(".drop_box").html(filedata);
    } else {
        animateAccessDenied();
    }
  } 

  const dropArea = document.querySelector(".drop_box"),
  dragText = dropArea.querySelector("header"),
  input = dropArea.querySelector("#submit_btn_upload");
  let file;
  var filename;

  input.addEventListener("click", function () {
    var title = $("#input_title").val();
    if (title !== '') { 
    var currentUrl = window.location.href;
    var urlParams = new URLSearchParams(window.location.search);
    urlParams.set('title', title);
    var updatedUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    history.pushState(null, null, updatedUrl);
    let filedata = `
    <form method="post" enctype="multipart/form-data">
    <header> 
      <h4>Select File here</h4>
    </header>
    <p>Files Supported: PDF, TEXT, DOC , DOCX</p>
    <input type="file" hidden accept=".doc,.docx,.pdf,.txt" id="fileID" style="display:none;">
    <button type="button" id="submit_btn_upload_2" onclick="PickFile()" class="content-button btn">Choose File</button>
    </form>`;
    dropArea.innerHTML = filedata;
    }else {
      animateAccessDenied();
    }
  });

  function PickFile() {
  // Trigger the file input click
  document.getElementById('fileID').click();

  // Listen for changes in the file input
  document.getElementById('fileID').addEventListener('change', function () {
  // Check if a file has been selected
  if (this.files.length > 0) {
  var csrftoken = getCookie('csrftoken');

  function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
  }

  var formData = new FormData();

  // Loop through all selected files and append them to the FormData object
  for (var i = 0; i < this.files.length; i++) {
  formData.append('file', this.files[i]);
  }

  $("#uploader_form").css("display", "none");
  $("#loader").css("display", "block");

  var urlParams = new URLSearchParams(window.location.search);
  // Access individual query parameters
  var courseId = urlParams.get('course');
  var title= urlParams.get('title');
  // Append additional data (post variables) to the FormData object
  formData.append('course_id', courseId);
  formData.append('title', title);

  $.ajax({
  url: window.location.href,
  type: 'POST',
  data: formData,
  processData: false,
  contentType: false,
  beforeSend: function (xhr, settings) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
  },
  success: function(response) {
    // Check if the response has a 'message' key (indicating success)
    if ('success' in response) {
      window.location.href = "/main?upload=TRUE";
    } else {
      $("#loader").css("display", "none");
      $("#uploader_form").css("display", "block");
      alert('Please make sure your file is under 10 MB and in one of the following formats: .doc, .docx, .pdf.')
    }
  }
  });
  }
  });
  }

  $(document).ready(function () {
    // Use event delegation on a static parent element
    $(document).on('click', '#M233na2', function () {
      // Get the file input element
      var fileInput = $('#fileID')[0];
      // Call the Upload function with the file input and additional variable
      var urlParams = new URLSearchParams(window.location.search);
      // Access individual query parameters
      var subjectId = urlParams.get('subject');
      var title= urlParams.get('title');
      Upload(fileInput, subjectId, title);
    });
  });

  function load_file (Title,Subject,Downoald_Link) {
    var newContent = Title;
    $('#Title').html(newContent);
    var newContent2 =
    '<div style="background-color: transparent; padding: 5px; border-radius: 20px;  display: inline-block; border: solid; border-color: black; border-width: 1px;">' +
    '<span style="text-align: center; opacity: 1;">' +
    Subject +
    '</span>' +
    '</div>';
    $('#category_tag').html(newContent2);
    var newHref = Downoald_Link
    $('#downoald_link').attr('href', newHref);
    $(".overlay-app").addClass("is-active");
    $(".pop-up").addClass("visible");
  }
  
  function load_file_2 (Title,Subject,Downoald_Link) {
    var newContent = Title;
    $('#Title_2').html(newContent);
    var newContent2 =
    '<div style="background-color: transparent; padding: 5px; border-radius: 20px;  display: inline-block; border: solid; border-color: black; border-width: 1px;">' +
    '<span style="text-align: center; opacity: 1;">' +
    Subject +
    '</span>' +
    '</div>';
    $('#category_tag_2').html(newContent2);
    var newHref = Downoald_Link
    $('#downoald_link_2').attr('href', newHref);
    $(".overlay-app").addClass("is-active");
    $(".pop-up").addClass("visible");
  }

  const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

  const itemsPerPage = 10;
  let currentPage = 1;

  function displayItems(page) {
      // This function is not needed since we are only displaying the index navigator
  }

  function updatePagination() {
      const totalPages = Math.ceil(items.length / itemsPerPage);

      const paginationElement = document.getElementById('pagination');
      paginationElement.innerHTML = '';

      const numPageLinks = 3; // Number of visible page links

      let startPage = Math.max(1, currentPage - Math.floor(numPageLinks / 2));
      let endPage = Math.min(startPage + numPageLinks - 1, totalPages);

      if (currentPage <= Math.floor(numPageLinks / 2) + 1) {
          endPage = Math.min(numPageLinks, totalPages);
      } else if (currentPage >= totalPages - Math.floor(numPageLinks / 2)) {
          startPage = Math.max(1, totalPages - numPageLinks + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
          const div = document.createElement('div');
          const a = document.createElement('a');
          a.href = i;
          a.textContent = i;
          a.addEventListener('click', () => {
              currentPage = i;
              updatePagination();
          });

          if (i === currentPage) {
              a.classList.add('active');
          }

          div.appendChild(a);
          paginationElement.appendChild(div);
      }
  }

  // Initial display
  updatePagination();
  
  function Main_Back_1() {
    $("#item-list-2").css("display", "none");
    $("#second-index").css("display", "none");
    $("#main-index").fadeIn(1000);
    $("#item-list").fadeIn(1000);
    $("#pagination").fadeIn(1000);
  }

  function Main_Back_2() {
    $("#item-list-3").css("display", "none");
    $("#third-index").css("display", "none");
    $("#pagination-2").css("display", "none");
    $("#second-index").fadeIn(1000);
    $("#item-list-2").fadeIn(1000);
  }

  function Main_Back_3() {
    $("#item-list-4").css("display", "none");
    $("#fourth-index").css("display", "none");
    $("#pagination-3").css("display", "none");
    $("#third-index").fadeIn(1000);
    $("#pagination-2").fadeIn(1000);
    $("#item-list-3").fadeIn(1000);
  }

  function Main_Back_4() {
    $("#item-list-5").css("display", "none");
    $("#fifth-index").css("display", "none");
    $("#pagination-4").css("display", "none");
    $("#third-index").fadeIn(1000);
    $("#pagination-2").fadeIn(1000);
    $("#item-list-3").fadeIn(1000);
  }

  function Main_Back_5() {
    $("#Search_page").css("display", "none");
    $("#File_explorer").fadeIn(1000);
  }

  function LoadSubject2 (Session) {
    $.ajax({
      url: window.location.href,
      method: "POST",
      data: {session_fetch : Session},
      headers: {
        'X-CSRFToken': getCSRFToken()
      },
      success: function(response) {
        // Check if the response has a 'message' key (indicating success)
        if ('subjects_2' in response) {

      // Sample data for demonstration
      const namesArray = response.subjects_2;

      const itemsPerPage2 = 3;
      let currentPage2 = 1;

      function displayItems() {
          const itemListElement = document.getElementById('item-list-3');
          itemListElement.innerHTML = '';

          const startIndex = (currentPage2 - 1) * itemsPerPage2;
          const endIndex = startIndex + itemsPerPage2;

          for (let i = startIndex; i < endIndex && i < namesArray.length; i++) {
              const li = document.createElement('li');
              li.classList.add('item');
              li.innerHTML =
              '<div class="products">' +
              '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
              '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
              '</svg>' +
              namesArray[i][1] +
              '</div>' +
              '<div class="button-wrapper">' +
              '<button class="content-button status-button" onclick="LoadCourses2(\'' + namesArray[i][0] + '\',\'' + namesArray[i][1] + '\')">open</button>' +
              '</div>';
              itemListElement.appendChild(li);
          }
      }

      function updatePagination2() {
          const totalPages = Math.ceil(namesArray.length / itemsPerPage2);

          const paginationElement = document.getElementById('pagination-2');
          paginationElement.innerHTML = '';

          const numPageLinks = 3; // Number of visible page links

          let startPage = Math.max(1, currentPage2 - Math.floor(numPageLinks / 2));
          let endPage = Math.min(startPage + numPageLinks - 1, totalPages);

          if (currentPage2 <= Math.floor(numPageLinks / 2) + 1) {
              endPage = Math.min(numPageLinks, totalPages);
          } else if (currentPage2 >= totalPages - Math.floor(numPageLinks / 2)) {
              startPage = Math.max(1, totalPages - numPageLinks + 1);
          }

          for (let i = startPage; i <= endPage; i++) {
              const div = document.createElement('div');
              const a = document.createElement('a');
              a.href = '#';
              a.textContent = i;
              a.addEventListener('click', () => {
                  currentPage2 = i;
                  updatePagination2(); // Corrected function call
                  displayItems();
              });

              if (i === currentPage2) {
                  a.classList.add('active');
              }

              div.appendChild(a);
              paginationElement.appendChild(div);
          }

          displayItems();
      }

      // Initial display
      updatePagination2();

      $("#item-list-2").css("display", "none");
      $("#second-index").css("display", "none");
      $("#third-index").fadeIn(1000);
      $("#item-list-3").fadeIn(1000);
      $("#pagination-2").fadeIn(1000);

      }else {
          alert('Oops 😖 , something went wrong ....')
      }

      }
    });
  } 

  function LoadCourses2 (Subject_id,Subject_name) {
     
    $.ajax({
      url: window.location.href,
      method: "POST",
      data: {courses_fetch : Subject_id},
      headers: {
        'X-CSRFToken': getCSRFToken()
      },
      success: function(response) {
        // Check if the response has a 'message' key (indicating success)
        if ('course_data_2' in response) {

      // Sample data for demonstration
      const namesArray2 = response.course_data_2;

      const itemsPerPage3 = 3;
      let currentPage3 = 1;

      function displayItems() {
          const itemListElement = document.getElementById('item-list-4');
          itemListElement.innerHTML = '';

          const startIndex = (currentPage3 - 1) * itemsPerPage3;
          const endIndex = startIndex + itemsPerPage3;

          for (let i = startIndex; i < endIndex && i < namesArray2.length; i++) {
              const li = document.createElement('li');
              li.classList.add('item');
              li.innerHTML =
              '<div class="products">' +
              '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
              '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
              '</svg>' +
              namesArray2[i][1] +
              '</div>' +
              '<div class="button-wrapper">' +
              '<button class="content-button status-button" onclick="LoadFiles2(\'' + namesArray2[i][0] + '\',\'' + Subject_name + '\')">open</button>' +
              '</div>';
              itemListElement.appendChild(li);
          }
      }

      function updatePagination2() {
          const totalPages = Math.ceil(namesArray2.length / itemsPerPage3);

          const paginationElement = document.getElementById('pagination-3');
          paginationElement.innerHTML = '';

          const numPageLinks = 3; // Number of visible page links

          let startPage = Math.max(1, currentPage3 - Math.floor(numPageLinks / 2));
          let endPage = Math.min(startPage + numPageLinks - 1, totalPages);

          if (currentPage3 <= Math.floor(numPageLinks / 2) + 1) {
              endPage = Math.min(numPageLinks, totalPages);
          } else if (currentPage3 >= totalPages - Math.floor(numPageLinks / 2)) {
              startPage = Math.max(1, totalPages - numPageLinks + 1);
          }

          for (let i = startPage; i <= endPage; i++) {
              const div = document.createElement('div');
              const a = document.createElement('a');
              a.href = '#';
              a.textContent = i;
              a.addEventListener('click', () => {
                  currentPage3 = i;
                  updatePagination2(); // Corrected function call
                  displayItems();
              });

              if (i === currentPage3) {
                  a.classList.add('active');
              }

              div.appendChild(a);
              paginationElement.appendChild(div);
          }

          displayItems();
      }

      // Initial display
      updatePagination2();

      $("#item-list-3").css("display", "none");
      $("#third-index").css("display", "none");
      $("#pagination-2").css("display", "none");
      $("#fourth-index").fadeIn(1000);
      $("#item-list-4").fadeIn(1000);
      $("#pagination-3").fadeIn(1000);

      }else {
          alert('Oops 😖 , something went wrong ....')
      }

      }
    });
  } 

  function LoadFiles2 (Course_id,Subject_name) {
     
    $.ajax({
      url: window.location.href,
      method: "POST",
      data: {files_fetch : Course_id},
      headers: {
        'X-CSRFToken': getCSRFToken()
      },
      success: function(response) {
        // Check if the response has a 'message' key (indicating success)
        if ('file_data_2' in response) {

      // Sample data for demonstration
      const namesArray3 = response.file_data_2;

      const itemsPerPage4 = 3;
      let currentPage4 = 1;

      function displayItems() {
          const itemListElement = document.getElementById('item-list-5');
          itemListElement.innerHTML = '';

          const startIndex = (currentPage4 - 1) * itemsPerPage4;
          const endIndex = startIndex + itemsPerPage4;

          for (let i = startIndex; i < endIndex && i < namesArray3.length; i++) {
              const li = document.createElement('li');
              li.classList.add('item');
              li.innerHTML =
              '<div class="products">' +
              '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
              '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
              '</svg>' +
              namesArray3[i][1] +
              '</div>' +
              '<div class="button-wrapper">' +
              '<button class="content-button status-button" onclick="load_file(\'' + namesArray3[i][1] + '\',\'' + Subject_name + '\',\'' + namesArray3[i][2] + '\')">open</button>' +
              '</div>';
              itemListElement.appendChild(li);
          }
      }

      function updatePagination2() {
          const totalPages = Math.ceil(namesArray3.length / itemsPerPage4);

          const paginationElement = document.getElementById('pagination-4');
          paginationElement.innerHTML = '';

          const numPageLinks = 3; // Number of visible page links

          let startPage = Math.max(1, currentPage4 - Math.floor(numPageLinks / 2));
          let endPage = Math.min(startPage + numPageLinks - 1, totalPages);

          if (currentPage4 <= Math.floor(numPageLinks / 2) + 1) {
              endPage = Math.min(numPageLinks, totalPages);
          } else if (currentPage4 >= totalPages - Math.floor(numPageLinks / 2)) {
              startPage = Math.max(1, totalPages - numPageLinks + 1);
          }

          for (let i = startPage; i <= endPage; i++) {
              const div = document.createElement('div');
              const a = document.createElement('a');
              a.href = '#';
              a.textContent = i;
              a.addEventListener('click', () => {
                  currentPage4 = i;
                  updatePagination2(); // Corrected function call
                  displayItems();
              });

              if (i === currentPage4) {
                  a.classList.add('active');
              }

              div.appendChild(a);
              paginationElement.appendChild(div);
          }

          displayItems();
      }

      // Initial display
      updatePagination2();

      $("#item-list-4").css("display", "none");
      $("#fourth-index").css("display", "none");
      $("#pagination-3").css("display", "none");
      $("#fifth-index").fadeIn(1000);
      $("#item-list-5").fadeIn(1000);
      $("#pagination-4").fadeIn(1000);

      }else {
          alert('Oops 😖 , something went wrong ....')
      }

      }
    });
  } 

  function LoadFiles3 (Course_id, Subject_name) {
     
    $.ajax({
      url: window.location.href,
      method: "POST",
      data: {files_fetch : Course_id},
      headers: {
        'X-CSRFToken': getCSRFToken()
      },
      success: function(response) {
        // Check if the response has a 'message' key (indicating success)
        if ('file_data_2' in response) {

      // Sample data for demonstration
      const namesArray3 = response.file_data_2;

      const itemsPerPage4 = 3;
      let currentPage4 = 1;

      function displayItems() {
          const itemListElement = document.getElementById('item-list-5');
          itemListElement.innerHTML = '';

          const startIndex = (currentPage4 - 1) * itemsPerPage4;
          const endIndex = startIndex + itemsPerPage4;

          for (let i = startIndex; i < endIndex && i < namesArray3.length; i++) {
              const li = document.createElement('li');
              li.classList.add('item');
              li.innerHTML =
              '<div class="products">' +
              '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
              '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
              '</svg>' +
              namesArray3[i][1] +
              '</div>' +
              '<div class="button-wrapper">' +
              '<button class="content-button status-button" onclick="load_file(\'' + namesArray3[i][1] + '\',\'' + Subject_name + '\',\'' + namesArray3[i][2] + '\')">open</button>' +
              '</div>';
              itemListElement.appendChild(li);
          }
      }

      function updatePagination2() {
          const totalPages = Math.ceil(namesArray3.length / itemsPerPage4);

          const paginationElement = document.getElementById('pagination-4');
          paginationElement.innerHTML = '';

          const numPageLinks = 3; // Number of visible page links

          let startPage = Math.max(1, currentPage4 - Math.floor(numPageLinks / 2));
          let endPage = Math.min(startPage + numPageLinks - 1, totalPages);

          if (currentPage4 <= Math.floor(numPageLinks / 2) + 1) {
              endPage = Math.min(numPageLinks, totalPages);
          } else if (currentPage4 >= totalPages - Math.floor(numPageLinks / 2)) {
              startPage = Math.max(1, totalPages - numPageLinks + 1);
          }

          for (let i = startPage; i <= endPage; i++) {
              const div = document.createElement('div');
              const a = document.createElement('a');
              a.href = '#';
              a.textContent = i;
              a.addEventListener('click', () => {
                  currentPage4 = i;
                  updatePagination2(); // Corrected function call
                  displayItems();
              });

              if (i === currentPage4) {
                  a.classList.add('active');
              }

              div.appendChild(a);
              paginationElement.appendChild(div);
          }

          displayItems();
      }

      // Initial display
      updatePagination2();

      $("#item-list").css("display", "none");
      $("#main-index").css("display", "none");
      $("#pagination").css("display", "none");
      $("#other-index").fadeIn(1000);
      $("#item-list-5").fadeIn(1000);
      $("#pagination-4").fadeIn(1000);

      }else {
          alert('Oops 😖 , something went wrong ....')
      }

      }
    });
  } 

  document.getElementById("search_box").addEventListener("keydown", function (event) {
    // Check if the pressed key is Enter
    if (event.key === "Enter" || event.keyCode === 13) {
        // Prevent the default behavior of the Enter key (form submission)
        event.preventDefault();

        // Get the input value and check if it's not empty
        var search_query = this.value.trim(); // trim() removes leading and trailing whitespaces

        if (search_query !== "") {

            // Send an AJAX request to the same URL with CSRF token
            $.ajax({
              url: window.location.href,
              method: "POST",
              data: { search_query: search_query },
              headers: {
                'X-CSRFToken': getCSRFToken()
              },
              success: function(response) {
                // Check if the response has a 'message' key (indicating success)
                if ('search_results' in response) {

                  // Sample data for demonstration
                  const namesArray5 = response.search_results;

                  const itemsPerPage5 = 3;
                  let currentPage5 = 1;

                  function displayItems() {
                      const itemListElement = document.getElementById('item-list-6');
                      itemListElement.innerHTML = '';

                      const startIndex = (currentPage5 - 1) * itemsPerPage5;
                      const endIndex = startIndex + itemsPerPage5;

                      for (let i = startIndex; i < endIndex && i < namesArray5.length; i++) {
                          const li = document.createElement('li');
                          li.classList.add('item');
                          li.innerHTML =
                          '<div class="products">' +
                          '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
                          '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
                          '</svg>' +
                          namesArray5[i][1] +
                          '</div>' +
                          '<div class="button-wrapper">' +
                          '<button class="content-button status-button" onclick="load_file_2(\'' + namesArray5[i][1] + '\',\'' + namesArray5[i][3] + '\',\'' + namesArray5[i][2] + '\')">open</button>' +
                          '</div>';
                          itemListElement.appendChild(li);
                      }
                  }

                  function updatePagination2() {
                      const totalPages = Math.ceil(namesArray5.length / itemsPerPage5);

                      const paginationElement = document.getElementById('pagination-5');
                      paginationElement.innerHTML = '';

                      const numPageLinks = 3; // Number of visible page links

                      let startPage = Math.max(1, currentPage5 - Math.floor(numPageLinks / 2));
                      let endPage = Math.min(startPage + numPageLinks - 1, totalPages);

                      if (currentPage5 <= Math.floor(numPageLinks / 2) + 1) {
                          endPage = Math.min(numPageLinks, totalPages);
                      } else if (currentPage5 >= totalPages - Math.floor(numPageLinks / 2)) {
                          startPage = Math.max(1, totalPages - numPageLinks + 1);
                      }

                      for (let i = startPage; i <= endPage; i++) {
                          const div = document.createElement('div');
                          const a = document.createElement('a');
                          a.href = '#';
                          a.textContent = i;
                          a.addEventListener('click', () => {
                              currentPage3 = i;
                              updatePagination2(); // Corrected function call
                              displayItems();
                          });

                          if (i === currentPage5) {
                              a.classList.add('active');
                          }

                          div.appendChild(a);
                          paginationElement.appendChild(div);
                      }

                      displayItems();
                  }

                  // Initial display
                  updatePagination2();

                  $("#File_explorer").css("display", "none");
                  $("#Search_page").fadeIn(1000);

                } 
              }
            });

        }

    }
  });

  function LoadSessions (Year) {

    if (Year == "1") {

      var newContent =
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S1' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" onclick="LoadSubject2(\'S1\')" >open</button>' +
      '</div>' +
      '</li>'+
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S2' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" LoadSubject2(\'S2\')>open</button>' +
      '</div>' +
      '</li>';
      $('#item-list-2').html(newContent);

    }else if (Year == "2") {

      var newContent =
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S3' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" LoadSubject2(\'S3\')>open</button>' +
      '</div>' +
      '</li>'+
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S4' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" LoadSubject2(\'S4\')>open</button>' +
      '</div>' +
      '</li>';
      $('#item-list-2').html(newContent);

    }else if (Year == "3") {

      var newContent =
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S5' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" LoadSubject2(\'S5\')>open</button>' +
      '</div>' +
      '</li>'+
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S6' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" LoadSubject2(\'S6\')>open</button>' +
      '</div>' +
      '</li>';
      $('#item-list-2').html(newContent);

    }else if (Year == "4") {

      var newContent =
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S7' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" LoadSubject2(\'S7\')>open</button>' +
      '</div>' +
      '</li>'+
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S8' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" LoadSubject2(\'S8\')>open</button>' +
      '</div>' +
      '</li>';

      $('#item-list-2').html(newContent);
    }else if (Year == "5") {

      var newContent =
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S9' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" LoadSubject2(\'S9\')>open</button>' +
      '</div>' +
      '</li>'+
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S10' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" LoadSubject2(\'S10\')>open</button>' +
      '</div>' +
      '</li>';
      $('#item-list-2').html(newContent);

    }else if (Year == "6") {

      var newContent =
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S11' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" LoadSubject2(\'S11\')>open</button>' +
      '</div>' +
      '</li>'+
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'S12' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" LoadSubject2(\'S12\')>open</button>' +
      '</div>' +
      '</li>';
      $('#item-list-2').html(newContent);
    }
    $("#item-list").css("display", "none");
    $("#main-index").css("display", "none");
    $("#pagination").css("display", "none");
    $("#item-list-2").fadeIn(1000);
    $("#second-index").fadeIn(1000);
  }

  $(document).ready(function() {

    // Replace 'Your Link Content' with the actual content you're looking for
    var linkContentToFind1 = '1';
    var linkContentToFind2 = '2';
    var linkContentToFind3 = '3';

    // Use event delegation to attach a click event to any matching link
    $(document).on('click', 'a[href="1"]:contains(' + linkContentToFind1 + ')', function(event) {
        event.preventDefault(); // Prevent the default behavior of the link
        var newContent =
        '<li class="adobe-product">' +
        '<div class="products">' +
        '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
        '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
        '</svg>' +
        '1st year ' +
        '</div>' +
        '<div class="button-wrapper">' +
        '<button class="content-button status-button open" style="opacity:1; border: none; background-color: #3a6df0; color: white;" onclick="LoadSessions(\'1\')">open</button>' +
        '</div>' +
        '</li>'+
        '<li class="adobe-product">' +
        '<div class="products">' +
        '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
        '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
        '</svg>' +
        '2nd year ' +
        '</div>' +
        '<div class="button-wrapper">' +
        '<button class="content-button status-button open" style="opacity:1; border: none; background-color: #3a6df0; color: white;" onclick="LoadSessions(\'2\')">open</button>' +
        '</div>' +
        '</li>'+
        '<li class="adobe-product">' +
        '<div class="products">' +
        '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
        '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
        '</svg>' +
        '3rd year ' +
        '</div>' +
        '<div class="button-wrapper">' +
        '<button class="content-button status-button open" style="opacity:1; border: none; background-color: #3a6df0; color: white;" onclick="LoadSessions(\'3\')">open</button>' +
        '</div>' +
        '</li>';
        $('#item-list').html(newContent);
    });

    // Use event delegation to attach a click event to any matching link
    $(document).on('click', 'a[href="2"]:contains(' + linkContentToFind2 + ')', function(event) {
      event.preventDefault(); // Prevent the default behavior of the link
      var newContent =
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      '4th year ' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button open" style="opacity:1; border: none; background-color: #3a6df0; color: white;" onclick="LoadSessions(\'4\')">open</button>' +
      '</div>' +
      '</li>'+
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      '5th year ' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button open" style="opacity:1; border: none; background-color: #3a6df0; color: white;" onclick="LoadSessions(\'5\')">open</button>' +
      '</div>' +
      '</li>'+
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      '6th year ' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button open" style="opacity:1; border: none; background-color: #3a6df0; color: white;" onclick="LoadSessions(\'6\')">open</button>' +
      '</div>' +
      '</li>';
      $('#item-list').html(newContent);
    })

    // Use event delegation to attach a click event to any matching link
    $(document).on('click', 'a[href="3"]:contains(' + linkContentToFind3 + ')', function(event) {
      event.preventDefault(); // Prevent the default behavior of the link
      var newContent =
      '<li class="adobe-product">' +
      '<div class="products">' +
      '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" style="color: #3a6df0">' +
      '<path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z"/>' +
      '</svg>' +
      'other' +
      '</div>' +
      '<div class="button-wrapper">' +
      '<button class="content-button status-button" onclick="LoadFiles3(\'0\', \'other\')">open</button>' +
      '</div>' +
      '</li>';
      $('#item-list').html(newContent);
    });

  });

  document.addEventListener("DOMContentLoaded", function() {
    var urlParams = new URLSearchParams(window.location.search);
    var check_upload_status = urlParams.get('upload');
    if (check_upload_status == "TRUE") {
      $(".main").css("display", "none");
      $("#uploader").css("display", "none");
      $("#Mycloud").fadeIn(1000);
      $("#main_link").removeClass("is-active");
      $("#uploader_link").removeClass("is-active");
      $("#cloud_link").addClass("is-active");
    }
  });

  function Settings () {
    $(".setting-panel").addClass("visible");
    $(".overlay-app").addClass("is-active");
  }


  function Change_Username() {
    // Get the input value
    var new_username = $("#input_username").val();
    // Send an AJAX request to the same URL with CSRF token
    if (new_username !== '') { 
      $.ajax({
        url: window.location.href,
        method: "POST",
        data: {new_username: new_username},
        headers: {
          'X-CSRFToken': getCSRFToken()
        },
        success: function(response) {
          // Check if the response has a 'message' key (indicating success)
          if ('success' in response) {
            alert('Username changed to' + ': ' + new_username)
          }
        }
      });
    }else {
      alert('Empty shake 😔')
    }
  } 

  function Edit_file(file_id) {
    // Get the input value
    var new_file_name = prompt('New Shake, Your Suggested Flavor?');
    // Send an AJAX request to the same URL with CSRF token
    if (new_file_name !== '') { 
      $.ajax({
        url: window.location.href,
        method: "POST",
        data: {new_file_name: new_file_name, file_id_edit: file_id},
        headers: {
          'X-CSRFToken': getCSRFToken()
        },
        success: function(response) {
          // Check if the response has a 'message' key (indicating success)
          if ('success' in response) {
            alert('File name changed to' + ': ' + new_file_name)
            var newContent = new_file_name;
            $('#file_name_'+file_id).html(newContent);
          }
        }
      });
    }else {
      alert('Empty shake 😔')
    }
  } 

  function Delete_file(file_id) {

    var userConfirmation = confirm("Ready to pour the shake? Confirm with a shake! 🥤💫");

    if (userConfirmation) {

      $.ajax({
        url: window.location.href,
        method: "POST",
        data: {file_to_delete_id: file_id},
        headers: {
          'X-CSRFToken': getCSRFToken()
        },
        success: function(response) {
          // Check if the response has a 'message' key (indicating success)
          if ('success' in response) {
            $('#'+file_id).css("display", "none");
          }
        }
      });

    }

  } 