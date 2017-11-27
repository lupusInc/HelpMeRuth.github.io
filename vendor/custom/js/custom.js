// Event functions
function OnLoad() {
  console.log("Loaded"); //event log
  $(".contentblock").css("height", $(document).height());
  countPages()
  resetPages();
}

function Scroll() {
  console.log("Scrolled"); //event log
  // Height can change on mobile whilst scrolling e.g chrome
  scalePage();
}

function Resize() {
  console.log("Resized"); //event log
  scalePage();
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
var currentPage = 0;
var pages = 0;

function countPages() {
  pages = 0;
  for (var found = false; !found;) {
    if ($(".page" + pages).length == 1) {
      pages++;
    } else {
      found = true;
      pages--;
    }
  }
}

function slide(newPage, down) {
  if (down) {
    $(".page" + currentPage).css("top", -$(document).height() + "px");
  } else {
    $(".page" + currentPage).css("top", $(document).height() + "px");
  }
  $(".page" + currentPage).css("position", "fixed");
  $(".page" + newPage).css("top", "0px");
  setTimeout(function() {
    $(".page" + newPage).css("position", "initial");
  }, 1000);
  currentPage = newPage;
}

function resetPages() {
  for (var i = 0; i <= pages; i++) {
    if (i == currentPage) {
      j = 0;
    } else {
      j = $(document).height();
    }
    $(".page" + i).css("top", j + "px");
  }
}

function scalePage() {
  $(".contentblock").css("height", $(window).height()); // Reset the height
  $(".contentblock").css("height", $(document).height()); // Set the actual height
}
