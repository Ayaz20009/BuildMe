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
        $("input.numeric").val("");
    }
});

$('a[data-toggle=tab]').click(function(){
 
  if($(this).text() == "Homeowner")
    $(this).closest('.panel').removeClass('panel-primary').addClass('panel-success');
  else
    $(this).closest('.panel').removeClass('panel-success').addClass('panel-primary');
});


 $( "#datepicker" ).datepicker();


 $(".btnDays").click(function(){

    $(this).toggleClass("btn-info");

 });

 $("#btnResetDays").click(function(){

    $(".btnDays").removeClass("btn-info");
 });


  $('.sidebar').css('top',$('#navbar').height());

//add class btn-default to current option 
var url      = window.location.href;
var urlSplit = url.split("/");
var path = urlSplit[3] + "/" + urlSplit[4];
$('a[href*="'+ path +'"]').addClass("btn-success").siblings().removeClass("btn-success");


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

//select project set proj_id
$(".btnSelect").click(function(){
  
  var panel = $(this).closest('.panel');
  var proj_id = panel.attr('id');
  $('input[name=proj_id]').val(proj_id);

});

$(".btnDelete").click(function(){

  var panel_body_html = $(this).closest('.panel').children('.panel-body').html()
  $('#modal_delete').find('.modal-body').html(panel_body_html);
});

// $('#dlg_delete').dialog('option', 'position',  {my: "center", at: "center", of: window});

});

