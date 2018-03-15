// All functions called on load
function OnLoad() {
  lazyLoad();
  scaleBackground()
  welcome();
  countPages();
  straightPage();
}

// account for changing screensize e.g. desktops
function Resize() {
  if (currentPage !== 0) {
    $(".page0").css("width", $(".page1").width() + 60);
  } else {
    $(".page0").css("width", $(window).width());

  }
  straightPage();
  scaleBackground();
}

// Events
$(document).ready(function() {
  OnLoad();
})
$(window).resize(function() {
  Resize();
});

// variables
var currentPage = 0;
var pages = 0;
var scrollLock = false;
var loaded = false;
var contactlock = true;
var reset = false;
var scrollduration = 1000;
var overlayduration = 450;
var overlayease = "easeInOutBack"
jQuery.easing.def = "easeInOutSine";

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
        if (currentPage == pages) {
          newPage = currentPage;
        } else {
          newPage = currentPage + 1;
        }
      } else if (currentPage !== 0) {
        newPage = currentPage - 1;
      } else {
        newPage = currentPage;
      }
    } else if (newPage > pages) {
      newPage = pages;
    }

    // Fancy animation for page0
    if (currentPage == 0) {
      $(".page0").animate({
        width: $(".page1").width() + 60
      }, scrollduration / 2);
      page0Timeout = scrollduration / 2;
    } else {
      page0Timeout = 0;
    }

    setTimeout(function() { // This is needed cuz im not good enough
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
        }, scrollduration);
      } else {
        $(".page" + currentPage).animate({
          top: $(".page" + newPage).height()
        }, scrollduration);
      }

      // Animate newPage
      $(".page" + newPage).animate({
        top: 0
      }, scrollduration, function() {
        $(".page" + newPage).css("position", "static");
        $(".page" + newPage).css("left", "0px");
        if (newPage === 0) {
          currentPage = newPage;
          overlay();
          $(".page0").animate({
            width: $(window).width()
          }, 500, function() {
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
  var windowHeight = $(window).height();
  for (var i = 0; i <= pages; i++) {
    $(".page" + i).css("min-height", windowHeight).css("height", windowHeight).css("height", $(".height" + i).height());
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
      $(".btn-up").animate({
        opacity: 0,
        right: -60
      }, overlayduration, overlayease);
    } else {
      $(".btn-up").animate({
        opacity: 1,
        right: 20
      }, overlayduration, overlayease);
    }
    if (currentPage == pages) {
      $(".btn-down").animate({
        opacity: 0,
        right: -60
      }, {
        duration: overlayduration,
        queue: false,
        easing: overlayease,
        compvare: function() {
          reset = true;
        }
      });
      $(".btn-up").animate({
        bottom: 80
      }, {
        duration: overlayduration,
        queue: false,
        easing: overlayease
      });
    } else if (reset) {
      $(".btn-up").animate({
        bottom: 140
      }, {
        duration: overlayduration,
        queue: false,
        easing: overlayease,
        compvare: function() {

        }
      });
      $(".btn-down").animate({
        opacity: 1,
        right: 20
      }, {
        duration: overlayduration,
        queue: false,
        easing: overlayease
      });
      reset = false;
    }
    $("p:last").text(currentPage + 1);
  }
}

// Load smooth welcome screen
function welcome() {
  $('.overlay-content').imagesLoaded(function() {
    $(".overlay-content").animate({
      opacity: 1
    }, {
      duration: 500,
      queue: false
    });
    $(".overlay-content").animate({
      top: 0
    }, {
      duration: 500,
      queue: false,
      ease: overlayease
    });
  });

}

// Just like it says
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
    Background.css("opacity", "1");
  }
}

// Setup the main website for use
function continuePage() {
  $(window).scrollTop(0);
  $(".page0").css("max-width", "100%");
  $(".overlay").animate({
    opacity: 0
  }, 500);
  $(".background").animate({
    opacity: 0
  }, 500);
  $(".navbar-custom").animate({
    opacity: 1
  }, 500);
  $(".container").css("opacity", "1");
  $(".btn-circle").animate({
    opacity: 1
  }, 500, function() {
    $(".overlay").css("display", "none");
    $(".background").css("display", "none");
    setTimeout(function() {
      straightPage();
    }, 50);
    loaded = true;
    overlay();
  });


}

// Go back to the welcome screen
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

// Fade animation for the contacts button
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

// Load all picture asynchronously to speed up physical browser load time
function lazyLoad() {
  $(".lazyload").each(function() {
    $(this).attr("src", $(this).attr("data-src"));
  });
}