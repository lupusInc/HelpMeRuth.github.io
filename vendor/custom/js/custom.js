// Event functions
function OnLoad() {
  countPages();
  overlay();
  scalePage();
  straightPage();
  scaleBackground()
}
//
function Scroll() {
  // Height can change on mobile whilst scrolling e.g chrome
}

//
function Resize() {
  scalePage();
  straightPage();
  scaleBackground();
}
// Events
//
//Trigger OnLoad() when page is fully loaded.
$(document).ready(function() {
  OnLoad();
})
//
//When page is scrolled
$(window).scroll(function() {
  Scroll();
});
$(window).resize(function() {
  Resize();
});
//
//Functions
var currentPage = 0; // Start page
var pages = 0; // Amount of pages we have
var lock = false; // simple lock system to prevent bugs
// Count the amount of pages we have
function countPages() {
  for (var found = false; !found;) {
    if ($(".page" + pages).length == 1) {
      pages++;
    } else {
      found = true;
      pages--;
    }
  }
}
// Scroll up or down, to any page number or right under or above the current page
function movePage(newPage, down) {
  if (!lock) {
    lock = true;
    // Check for defined direction if not given calculate automaticly
    if (isNaN(down) && !isNaN(newPage)) {
      if ($(".page" + currentPage).css("top") > $(".page" + newPage).css("top")) {
        down = false;
      } else {
        down = true;
      }
    }
    // Check for defined newPage
    if (isNaN(newPage)) {
      if (down) {
        newPage = currentPage + 1;
      } else if (currentPage !== 0) {
        newPage = currentPage - 1;
      }
    } else if (newPage > pages) {
      newPage = pages;
    }
    //
    $(".page" + currentPage).css("left", $(".page" + currentPage).offset().left);
    $(".page" + currentPage).css("left", $(".page" + currentPage).offset().left);
    // Enable animation
    $(".page" + currentPage).css("transition", "1s");
    $(".page" + newPage).css("transition", "1s");
    // Place the currentPage above or under the visible screen, depending on direction
    if (down) {
      $(".page" + currentPage).css("top", -$(".page" + currentPage).height() + "px");
    } else {
      $(".page" + currentPage).css("top", $(".page" + newPage).height() + "px");
    }
    // "Freeze" the page so it wont cause any issues while hidden
    $(".page" + currentPage).css("position", "fixed");

    // Bring in the new page
    $(".page" + newPage).css("top", "0px");
    // straightPage()
    // Wait for the animation
    setTimeout(function() {
      // Disable animation
      $(".page" + currentPage).css("transition", "0s");
      $(".page" + newPage).css("transition", "0s");
      $(".page" + newPage).css("position", "initial");
      $(".page" + newPage).css("left", "0px");
      // Update currentPage
      currentPage = newPage;
      // Scaling bullshit
      scalePage();
      straightPage();
      overlay();
      lock = false;
    }, 1000);
  }
}
// Set the right configuration of pages
function straightPage() {
  for (var i = 0; i <= pages; i++) {
    if (i < currentPage && i !== currentPage) {
      $(".page" + i).css("top", -$(".page" + i).height());
    } else if (i > currentPage) {
      $(".page" + i).css("top", $(document).height());
    }
    if (i !== currentPage) {
      $(".page" + i).css("left", $(".page" + currentPage).offset().left);
      $(".page" + i).css("left", $(".page" + currentPage).offset().left);
    }
  }
}
// Scale the content
function scalePage() {
  for (var i = 0; i <= pages; i++) {
    $(".page" + i).css("min-height", $(window).height()); // Reset the min-height
    $(".page" + i).css("height", $(window).height()); // Reset the height
    $(".page" + i).css("height", $(".height" + i).height()); // Set the actual height
  }
}
var loaded = false;
// Animate the scroll buttons(hide and show on first and last page)
function overlay() {
  if (loaded) {
    if (currentPage == 0) {
      $(".btn-up").css("opacity", "0");
      $(".btn-up").css("right", "-60px");
    } else {
      $(".btn-up").css("opacity", "1");
      $(".btn-up").css("right", "20px");
    }
    if (currentPage == pages) {
      $(".btn-down").css("opacity", "0");
      $(".btn-down").css("right", "-60px");
      $(".btn-up").css("bottom", "80px");
    } else {
      $(".btn-down").css("opacity", "1");
      $(".btn-down").css("right", "20px");
      $(".btn-up").css("bottom", "140px");
    }
    $("p:last").text(currentPage + 1);
  } else {
    setTimeout(function() {
      //Put all simple start animations here
      $(".overlay-content").css("opacity", "1");
      $(".overlay-content").css("top", "0");
    }, 600);
  }
}
//
//We need to check if our background fits the screen.
//If not change the way how we calculate the width or height of the picturel.
// only needed for greeting overlay. both mobile en desktop
function scaleBackground() {
  var Background = $(".background");
  if (!loaded) {
    //Main magic
    if ($(window).height() > Background.height()) {
      Background.css("max-width", "none");
      Background.css("max-height", "100%");
    }
    if ($(window).width() > Background.width()) {
      Background.css("max-width", "100%");
      Background.css("max-height", "none");
    }
  }
}

function continuePage() {
  $(".overlay").css("opacity", "0");
  $(".background").css("opacity", "0");
  $(".navbar-custom").css("opacity", "1");
  $(".container").css("opacity", "1");
  $(".btn-circle").css("opacity", "1");
  loaded = true;
}

function reload() {
  $(".overlay").css("opacity", "1");
  $(".background").css("opacity", "1");
  $(".navbar-custom").css("opacity", "0");
  $(".container").css("opacity", "0");
  $(".btn-circle").css("opacity", "0");
  setTimeout(function() {
    $(".overlay").css("display", "initial");
    $(".background").css("display", "initial");
    loaded = false;
    overlay();
    scaleBackground();
  }, 500);
}
