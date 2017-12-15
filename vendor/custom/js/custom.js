// Event functions
function OnLoad() {
  lazyLoad();
  countPages();
  overlay();
  straightPage();
  scaleBackground()
}
//
function Resize() {
  straightPage();
  scaleBackground();
}
// Events
//
//Trigger OnLoad() when page is fully loaded.
$(document).ready(function() {
  OnLoad();
})
$(window).resize(function() {
  Resize();
});
//
//Functions
var currentPage = 0; // Start page
var pages = 0; // Amount of pages we have
var lock = false; // simple lock system to prevent bugs
var loaded = false; // is the site loaded?
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
    if (currentPage == 0) {
      page0Timeout = 500;
      $(".page" + currentPage).css("transition", "0.5s");
      $(".page0").css("max-width", "");
    } else {
      page0Timeout = 0;
    }
    setTimeout(function() {
      $(".page" + currentPage).css("transition", "0s");
      // Scaling
      straightPage();
      overlay();
      // Nullify the difference between position: fixed and static
      $(".page" + currentPage).css("left", $(".page" + currentPage).offset().left);

      // Compensate for the scrolled position
      $(".page" + currentPage).css("top", -$(document).scrollTop());
      $(".page" + newPage).css("top", parseInt($(".page" + newPage).css("top"), 10) - $(document).scrollTop());

      setTimeout(function() { // work around
        // Enable animation
        $(".page" + currentPage).css("transition", "1s");
        $(".page" + newPage).css("transition", "1s");
        // Place the currentPage above or under the visible screen, depending on direction
        if (down) {
          $(".page" + currentPage).css("top", -$(".page" + currentPage).height());
        } else {
          $(".page" + currentPage).css("top", $(".page" + newPage).height());
        }
        // "Freeze" the page so it wont cause any issues while hidden
        $(".page" + currentPage).css("position", "fixed");
        // Bring in the new page
        $(".page" + newPage).css("top", 0);
        // Wait for the animation
        setTimeout(function() {
          // Disable animation
          $(".page" + currentPage).css("transition", "0s");
          $(".page" + newPage).css("transition", "0s");
          $(".page" + newPage).css("position", "static");
          $(".page" + newPage).css("left", "0px");
          if (newPage == 0) {
            $(".page" + newPage).css("transition", "0.5s");
            $(".page0").css("max-width", "100%");
          }
          // Update currentPage
          currentPage = newPage;
          // Scaling
          straightPage();
          overlay();
          lock = false;
        }, 1000);
      }, 100);
    }, page0Timeout);
  }
}

function page0() {

  if (newPage !== 0) {
    $(".page0").css("max-width", "");
  }
}
// Set the right configuration of pages
function straightPage() {
  for (var i = 0; i <= pages; i++) {
    $(".page" + i).css("min-height", $(window).height()); // Reset the min-height
    $(".page" + i).css("height", $(window).height()); // Reset the height
    $(".page" + i).css("height", $(".height" + i).height()); // Set the actual height
    if (i < currentPage && i !== currentPage) {
      $(".page" + i).css("top", -$(".page" + i).height());
    } else if (i > currentPage) {
      $(".page" + i).css("top", $(document).height());
    }
    if (i !== currentPage) {
      $(".page" + i).css("left", ($(window).width() - $(".page" + i).width()) / 2 - 30);
    }
  }
}
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
    $('.overlay-content').imagesLoaded(function() {
      $(".overlay-content").css("opacity", "1");
      $(".overlay-content").css("top", "0");
    });
  }
}
//We need to check if our background fits the screen.
//If not change the way how we calculate the width or height of the picturel.
// only needed for greeting overlay. both mobile en desktop
function scaleBackground() {
  var Background = $(".background");
  if (!loaded) {
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
  $(window).scrollTop(0);
  $(".overlay").css("opacity", "0");
  $(".background").css("opacity", "0");
  $(".navbar-custom").css("opacity", "1");
  $(".container").css("opacity", "1");
  $(".btn-circle").css("opacity", "1");
  setTimeout(function() {
    $(".overlay").css("display", "none");
    $(".background").css("display", "none");
    setTimeout(function() {
      $(".page0").css("transition", "0");    
      $(".page0").css("max-width", "100%");
      straightPage();
    }, 50);
    loaded = true;
    overlay();
  }, 500);

}

function reload() {
  $(".overlay").css("display", "inline");
  $(".background").css("display", "inline");
  $(".overlay").css("opacity", "1");
  $(".background").css("opacity", "1");
  $(".background2").css("opacity", "0");
  $(".navbar-custom").css("opacity", "0");
  $(".container").css("opacity", "0");
  $(".btn-circle").css("opacity", "0");
  loaded = false;
  scaleBackground();
  movePage(0, NaN);
}
var lock2 = false;

function contacts(show) {
  if (!lock2) {
    lock2 = true;
    if (show) {
      $(".contact-box").css("display", "inline");
      setTimeout(function() {
        $(".contact-box").css("opacity", "1");
        lock2 = false;
      }, 10);
    } else {
      $(".contact-box").css("opacity", "0");
      setTimeout(function() {
        $(".contact-box").css("display", "none");
        lock2 = false;
      }, 500);
    }
  }
}

function lazyLoad() {
  $(".lazyload").each(function() {
    $(this).attr("src", $(this).attr("data-src"));
  });
}
