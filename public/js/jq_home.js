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
// $(".ui-dialog-titlebar").hide();
 $("#dlgLogin").dialog({
     width:500,
     show:'fade',
     hide: 'blind',
     draggable: false,
     resizable: false,
  });

 $("#btnLogin").click(function(){
 
     $("#dlgLogin").dialog("open");
       
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
			 