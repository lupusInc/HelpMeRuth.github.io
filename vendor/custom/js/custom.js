//
function OnLoad() {
  console.log("Loaded"); //event log
  $(".contentblock").css("height", $(document).height());
}

function Scroll() {
  console.log("Scrolled"); //event log
}

function Resize() {
  console.log("Resized"); //event log
  $(".contentblock").css("height", $(window).height()); // Reset the height
  $(".contentblock").css("height", $(document).height()); // Set the actual height
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

function slide() {}
