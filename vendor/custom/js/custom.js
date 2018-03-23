// All functions called on load
function OnLoad() {
  lazyLoad();
  scaleBackground()
  setTimeout(welcome, 200);
  countPages();
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
$(document).ready(OnLoad)
$(window).resize(Resize);
$(document).on("click", hidepop);
$(document).on("scroll", hidepop);

// variables
var limit = false;
var perf = false;
var currentPage = 0;
var pages = 0;
var scrollLock = false;
var loaded = false;
var contactlock = true;
var reset = false;
var popped = false;
var SCROLL_DURATION = 1000;
var OVERLAY_DURATION = 450;
var POP_DURATION = 10000;
var scrollduration, overlayduration;
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
function movePage(newPage, down, animate) {
  if (!popped && isNaN(animate)) {
    hidepop();
    popped = true;
  }
  if (animate || isNaN(animate)) {
    var scrollduration = SCROLL_DURATION;
    var overlayduration = OVERLAY_DURATION;
  } else {
    var scrollduration = 0;
    var overlayduration = 0;
  }

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
      if (down && currentPage !== pages) {
        newPage = currentPage + 1;
        limit = false;
      } else if (currentPage !== 0 && !down) {
        newPage = currentPage - 1;
        limit = false;
      } else {
        limit = true;
      }
    } else if (newPage == pages + 1 || newPage < 0 || (newPage == 0 && isNaN(animate) && currentPage == 0) || (newPage == pages && currentPage == pages)) {
      limit = true;
    } else {
      limit = false;
    }
    if (!limit) {
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
            overlay(animate);
            $(".page0").animate({
              width: $(window).width()
            }, overlayduration, function() {
              straightPage();
              scrollLock = false;
            });
          } else {
            currentPage = newPage;
            overlay(animate);
            straightPage();
            scrollLock = false;
          }
        })
      }, page0Timeout);
    } else {
      scrollLock = false;
    }
  }
}
// Set the right configuration of pages
function straightPage() {
  var t0 = performance.now();
  var windowHeight = $(window).height();
  var documentHeight = $(document).height();
  var windowWidth = $(window).width();
  for (var i = 0; i <= pages; i++) {
    var pageWidth = $(".page" + i).width();
    var pageHeight = $(".page" + i).height();
    if (parseInt($(".page" + i).css("min-height"), 10) !== windowHeight) {
      $(".page" + i).css("min-height", windowHeight);
    }
    if (i < currentPage && i !== currentPage) {
      if ($(".page" + i).position().top !== -pageHeight) {
        $(".page" + i).css("top", -pageHeight);
      }
    } else if (i > currentPage) {
      if ($(".page" + i).position().top !== documentHeight) {
        $(".page" + i).css("top", documentHeight);
      }
    }
    if (i !== currentPage) {
      if ($(".page" + i).position().left !== (windowWidth - pageWidth) / 2 - 30) {
        $(".page" + i).css("left", (windowWidth - pageWidth) / 2 - 30);
      }
    }
  }
  var t1 = performance.now();
  if (perf) {
    console.log("straightPage() took " + (t1 - t0) + " milliseconds.");
  }
}

// Animate the scroll buttons(hide and show on first and last page)
function overlay(animate) {
  if (!popped && isNaN(animate)) {
    $(".haspop").popover("show");
    $(".haspop").popover("toggleEnabled");
  }
  if (loaded) {
    if (currentPage == 0) {
      $(".btn-up").animate({
        opacity: 0,
        right: -60
      }, OVERLAY_DURATION, overlayease);
    } else {
      $(".btn-up").animate({
        opacity: 1,
        right: 20
      }, OVERLAY_DURATION, overlayease);
    }
    if (currentPage == pages) {
      $(".btn-down").animate({
        opacity: 0,
        right: -60
      }, {
        duration: OVERLAY_DURATION,
        queue: false,
        easing: overlayease,
        complete: function() {
          reset = true;
        }
      });
      $(".btn-up").animate({
        bottom: 80
      }, {
        duration: OVERLAY_DURATION,
        queue: false,
        easing: overlayease
      });
    } else if (reset) {
      $(".btn-up").animate({
        bottom: 140
      }, {
        duration: OVERLAY_DURATION,
        queue: false,
        easing: overlayease,
        complete: function() {

        }
      });
      $(".btn-down").animate({
        opacity: 1,
        right: 20
      }, {
        duration: OVERLAY_DURATION,
        queue: false,
        easing: overlayease
      });
      reset = false;
    }
    $("p:last").text(currentPage + 1);
  }
}

function hidepop() {
  $(".haspop").popover("toggleEnabled");
  $(".haspop").popover("hide");
  $(".haspop").popover("toggleEnabled");
}
// Load smooth welcome screen
function welcome() {
  $('.overlay-content').imagesLoaded(function() {
    movePage(0, NaN, false); // bypasses some awesome css magicrap
    $(".overlay-content").animate({
      opacity: 1
    }, {
      duration: OVERLAY_DURATION,
      queue: false
    });
    $(".overlay-content").animate({
      top: 0
    }, {
      duration: OVERLAY_DURATION,
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
  if ($(window).width() < 768 && !popped) {
    $(window).scrollTop($(".testing").position().top - 100);
  }
  $(".page0").css("max-width", "100%");
  $(".overlay").animate({
    opacity: 0
  }, OVERLAY_DURATION);
  $(".background").animate({
    opacity: 0
  }, OVERLAY_DURATION);
  $(".navbar-custom").animate({
    opacity: 1
  }, OVERLAY_DURATION);
  $(".container").css("opacity", "1");
  $(".btn-circle").animate({
    opacity: 1
  }, OVERLAY_DURATION, function() {
    $(".overlay").css("display", "none");
    $(".background").css("display", "none");
    loaded = true;
    overlay();
    setTimeout(function() {
      hidepop()
    }, POP_DURATION);
  });
}

// Go back to the welcome screen
function reload() {
  $(".overlay").css("display", "inline");
  $(".background").css("display", "inline");
  $(".overlay").animate({
    opacity: 1
  }, OVERLAY_DURATION);
  $(".background").animate({
    opacity: 1
  }, OVERLAY_DURATION);
  $(".navbar-custom").animate({
    opacity: 0
  }, OVERLAY_DURATION);
  $(".container").css("opacity", "0");
  $(".btn-circle").animate({
    opacity: 0
  }, OVERLAY_DURATION, function() {
    loaded = false;
    scaleBackground();
    if (currentPage !== 0) {
      movePage(0, NaN, false);
    }
    popped = false;
    loaded = false;
  });
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