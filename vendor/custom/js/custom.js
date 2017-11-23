//Global variables, mostly for testing purposes in console.
var currentTab = 1;
var Fade = 0.3;
var Background = $(".background");
//Functions
//
//One page fade effect to switch through different html elements.
//Every object with the tab(newTab) class is affected.
function LoadNewContent(newTab) {
  //Configure the fade in duration, keep in mind the total duration is equal to Fade * 2~. Fade is is in seconds.
  $(".tab" + newTab).css("transition", "opacity" + " " + Fade + "s");
  $(".tab" + currentTab).css("transition", "opacity" + " " + Fade + "s");
  //Main magic
  $(".tab" + currentTab).css("opacity", "0");
  setTimeout(function() { // Execute when the full animation has ended
    $(".tab" + currentTab).css("display", "none");
    $(".tab" + newTab).css("display", "initial");
  }, Fade * 1000); // setTimeout works with ms
  setTimeout(function() {
    currentTab = newTab;
    $(".tab" + newTab).css("opacity", "1");
  }, Fade * 2000);
}
//
function OnLoad() {
  scaleBackground();
  setTimeout(function() { // wait for the site to be loaded (makes it smoother)
    //Put all simple start animations here
    $(".overlay-content").css("opacity", "1");
    $(".overlay-content").css("top", "0");
  }, 500);
  if (!mobileMode()) {
    // desktop mode
    scrollEvent()
  } else {
    // mobile mode



  }
}

function continueSite() {
  if (!mobileMode()) {
    // desktop mode
    $(".tab").css("opacity", "1");
    $(".overlay").css("opacity", "0");
    $(".overlay").css("height", "0%");
    $(".navbar-custom").css("top", "0px");
    $(".background").css("filter", "blur(0px)");
    $(".background").css("display", "none");
    pageScroll(0);
    $(".btn-circle").css("display", "initial");
    sizeTabs();
  } else {
    // mobile mobile mode



  }
}
//
//We need to check if our background fits the screen.
//If not change the way how we calculate the width or height of the picturel.
// only needed for greeting overlay. both mobile en desktop
function scaleBackground() {
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

function sizeTabs() {
  $(".tab").css("height", $(window).height());
}
// Events
//
//Trigger scaleBackground() when screen is resized.
$(window).resize(function() {
  scaleBackground();
  if (!mobileMode()) {
    sizeTabs();
  }
});
//
//Trigger OnLoad() when page is fully loaded.
$(document).ready(function() {
  OnLoad();
})
//
//When page is scrolled
$(window).scroll(function() {
  scrollEvent();
});

function scrollEvent() {
  if (!mobileMode()) {
    //desktop mode
    if ($(window).scrollTop() < 50) {
      $(".navbar-custom").css("background-color", "rgba(33, 33, 33, 0.7)");
      $(".btn-circle").css("opacity", "0");
      $(".btn-circle").css("right", "-20px");
    } else {
      $(".navbar-custom").css("background-color", "rgba(66, 66, 66, 0.7)");
      $(".btn-circle").css("opacity", "1");
      $(".btn-circle").css("right", "20px");
    }
  } else {
    //mobile mode

  }

}

function pageScroll(x, down) {
  var scrollLength = 0;
  if (isNaN(x)) {
    if (parseInt($(window).scrollTop() / $(window).height()) === ($(window).scrollTop() / $(window).height())) {
      if (down) {
        scrollLength = $(window).height() + $(window).scrollTop();
      } else if ($(window).scrollTop() !== 0) {
        scrollLength = $(window).scrollTop() - $(window).height();
      }
    } else {
      if (down) {
        scrollLength = $(window).height() * Math.ceil($(window).scrollTop() / $(window).height());
      } else {
        scrollLength = ($(window).height() * Math.ceil($(window).scrollTop() / $(window).height())) - $(window).height();
      }
    }
  } else {
    scrollLength = $(window).height() * x;
  }
  $("html, body").animate({
    scrollTop: scrollLength
  }, 1000);
}
// check if we're on mobile
function mobileMode() {
  if ($(window).width() > 450) {
    return false
  } else {
    return true
  }
}
