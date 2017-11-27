//
function OnLoad() {
  console.log("Loaded");
  $(".contentblock").css("min-height", $(document).height());
}

function Scroll() {
  console.log("Scrolled");
  $(".contentblock").css("height", $(document).height());
  $(".contentblock").css("min-height", $(window).height());


}

function Resize() {
  console.log("Resized");
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

function slide() {
  $("contentblock").css("min-height", $(window).height());
  $("contentblock").css("height", $(window).height());
  // $(".page0").css("position","fixed");
  // $(".page0").css("bottom",$(window).height());
}
