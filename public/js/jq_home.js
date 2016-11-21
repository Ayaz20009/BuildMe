$(document).ready(function(){

// $('.nav-tabs').tab();

$(".ui-dialog").dialog({
   autoOpen: false,
   buttons: [
    {
      text: "CLOSE",
      click: function() {
        $( this ).dialog( "close" );
      }
    }
  ]

});

$(".dropdown-content a").css("background-color",$("#navbar").css("background-color"));
// $(".ui-dialog-titlebar").hide();
 // $("#dlgLogin").dialog({
 //     width:500,
 //     show:'fade',
 //     hide: 'blind',
 //     draggable: false,
 //     resizable: false,
 //  });

 // $("#btnLogin").click(function(){
 
 //     $("#dlgLogin").dialog("open");
       
 // });

// $('.nav-tabs a').click(function(){
//     $(this).tab('show');
// });

$('[data-toggle=tab]').click(function(){

  $(this).addClass('active').siblings().removeClass('active');
  $($(this).attr('href')).addClass('active').siblings().removeClass('active');

});

 $( "#datepicker" ).datepicker();


 $(".btnDays").click(function(){

    $(this).toggleClass("btn-info");

 });

 $("#btnResetDays").click(function(){

    $(".btnDays").removeClass("btn-info");
 });




 $(".btnUserType").click(function(){

    $(this).addClass("btn-info").siblings().removeClass("btn-info");

 });



 $('[data-toggle=tab]').click(function(){
  var li = $(this).parent();
  li.addClass("in active").siblings().removeClass("in active");
   var link = $(this).attr('href');
   $(link).addClass("in active").siblings().removeClass("in active");

 });


});
			 