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
  ],
  position: {my: "center", at: "center", of: window}

});

$('.dropdown-toggle').dropdown();

$(".ui-dialog-titlebar").hide();


$("input.numeric").keyup(function (e) {
     //if the letter is not digit then display error and don't type anything
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        $(this).val("");
    }
});

// $("#modal_bid").modal("show");

$('a[data-toggle=tab]').click(function(){
 
  if($(this).text() == "Homeowner")
    $(this).closest('.panel').removeClass('panel-primary').addClass('panel-success');
  else
    $(this).closest('.panel').removeClass('panel-success').addClass('panel-primary');
});


// $('a[data-toggle="tab",href="#homeowner"]').addClass("btn-success");


 $( "#datepicker" ).datepicker();


 $(".btnDays").click(function(){

    $(this).toggleClass("btn-info");

 });

 $("#btnResetDays").click(function(){

    $(".btnDays").removeClass("btn-info");
 });


  $('.sidebar').css('top',$('#navbar').height());


$('#btnEditProfile').click(function(){

   $(this).addClass("hidden").siblings().removeClass("hidden");
   var input =  $(this).closest('form').find('input.form-control');
   input.removeClass("hidden").prev().addClass('hidden');
});

$("#btnCancel").click(function(){

   var input =  $(this).closest('form').find('input.form-control');
   input.each(function(){
     $(this).addClass("hidden").val($(this).prev().text()).prev().removeClass('hidden');

   });

   $('#btnEditProfile').removeClass("hidden").siblings().addClass("hidden");
});


$("#btnPass").click(function(){
   $("#formPass").removeClass("hidden");
});

$("#btnCancelPass").click(function(){
  $("#formPass").addClass("hidden").find('input').val("");

});


$(".btnBid").click(function(){

  var jobInfo = $(this).closest('.panel').find('.jobInfo').html();
  $('#modal_bid').find('#jobInfo').html(jobInfo);
});


$('#modal_bid [type=checkbox]').change(function(){

   if($(this).is(":checked")){

    $("#modal_bid").find("[name=months]").val("");
    $("#modal_bid").find("[name=weeks]").val("");
    $("#modal_bid").find("[name=days]").val("");
   }


});


});

