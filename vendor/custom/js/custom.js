// Event functions
function OnLoad() {
  lazyLoad();
  countPages();
  welcome();
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
var currentPage = 0; // Start page
var pages = 0; // Amount of pages we have
var scrollLock = false; // simple scrollLock system to prevent bugs
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
  if (!scrollLock) {
    scrollLock = true;
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
    // Scaling
    straightPage();
    if (currentPage == 0) {
      $(".page0").animate({
        width: $(".page1").width() + 60
      }, 500);
      page0Timeout = 500;
    } else {
      page0Timeout = 0;
    }

    setTimeout(function() {
      // Nullify the difference between position: fixed and static
      $(".page" + currentPage).css("left", $(".page" + currentPage).offset().left);

      // Compensate for the scrolled position
      $(".page" + currentPage).css("top", -$(document).scrollTop());
      $(".page" + newPage).css("top", parseInt($(".page" + newPage).css("top"), 10) - $(document).scrollTop());

      // Animate currentPage
      $(".page" + currentPage).css("position", "fixed");
      if (down) {
        $(".page" + currentPage).animate({
          top: -$(".page" + currentPage).height()
        }, 1000);
      } else {
        $(".page" + currentPage).animate({
          top: $(".page" + newPage).height()
        }, 1000);
      }
      // Animate newPage
      $(".page" + newPage).animate({
        top: 0
      }, 1000, function() { // unfreeze
        $(".page" + newPage).css("position", "static");
        $(".page" + newPage).css("left", "0px");
        if (newPage === 0) {
          $(".page0").animate({
            width: $(window).width()
          }, 500, function() {
            currentPage = newPage;
            overlay();
            straightPage();
            scrollLock = false;
          });
        } else {
          currentPage = newPage;
          overlay();
          straightPage();
          scrollLock = false;
        }
      })
    }, page0Timeout);
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
reset = false;

function overlay() {
  if (loaded) {
    if (currentPage == 0) {
      $(".btn-up").animate({
        opacity: 0,
        right: -60
      }, 300);
    } else {
      $(".btn-up").animate({
        opacity: 1,
        right: 20
      }, 300);
    }
    if (currentPage == pages) {
      $(".btn-down").animate({
        opacity: 0,
        right: -60
      }, 300, function() {
        $(".btn-up").animate({
          bottom: 80
        }, 300);
        reset = true;
      });
    } else if (reset) {
      $(".btn-up").animate({
        bottom: 140
      }, 300, function() {
        $(".btn-down").animate({
          opacity: 1,
          right: 20
        }, 300);
      });
      reset = false;
    }
    $("p:last").text(currentPage + 1);
  }
}

function welcome() {
  $('.overlay-content').imagesLoaded(function() {
    $(".overlay-content").css("opacity", "1");
    $(".overlay-content").css("top", "0");
  });
}

//We need to check if our background fits the screen.
//If not change the way how we calculate the width or height of the picturel.
// only needed for greeting overlay. both mobile en desktop
function scaleBackground() {
  if (!loaded) {
    var Background = $(".background");
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

  $(".page0").css("max-width", "100%");
  $(".overlay").css("opacity", "0");
  $(".background").css("opacity", "0");
  $(".navbar-custom").css("opacity", "1");
  $(".container").css("opacity", "1");
  $(".btn-circle").css("opacity", "1");
  setTimeout(function() {
    $(".overlay").css("display", "none");
    $(".background").css("display", "none");
    setTimeout(function() {
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
var contactlock = true;

function contacts(show) {
  if (contactlock) {
    contactlock = false;
    if (show) {
      $(".contact-box").css("display", "inline");
      $(".contact-box").animate({
        opacity: 1
      }, 200, function() {
        contactlock = true;
      });
    } else {
      $(".contact-box").animate({
        opacity: 0
      }, 200, function() {
        contactlock = true;
        $(".contact-box").css("display", "none");
      });
    }
  }
}

function lazyLoad() {
  $(".lazyload").each(function() {
    $(this).attr("src", $(this).attr("data-src"));
  });
}