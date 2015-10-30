(function() {

  var allNavItems = $(".main-nav li");
  var allTabs = $(".tab");

  allNavItems.on("click", function(e) {

    e.preventDefault();

    allNavItems.removeClass("active");
    allTabs.removeClass("active");

    // this = list item
    $(this).addClass("active");

    var selector = $(this).find("a").attr("href");
    $(selector).addClass("active");

  });

})();