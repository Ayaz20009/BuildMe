$(document).ready(function(){

var d = new Date();
var currentDate = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
// console.log(currentDate);

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


 $( "#datepicker" ).datepicker({ minDate: 0 });
 $("#datepicker").val(currentDate);


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
     $(this).addClass("hidden").siblings().removeClass('hidden');
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



//change time value 
  $('.btnASAP').click(function(){

    if($(this).hasClass("btn-danger")){
       ASAP(true);
    }
    else{
        ASAP(false);
    }
  });


//if has a date, make ASAP false
  $("input.time").keyup(function(){

     if($(this).val() > 0)
         ASAP(false);

     var week = parseInt($.trim($('input.time[name=week]').val()));
     var day = parseInt($.trim($('input.time[name=day]').val()));

     if(!week)
       week = 0;
     if(!day)
       day = 0;

     var total = 7*week + day;
     var d = new Date();
     d.setDate(d.getDate() + total);
     var dateFormat =  d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
     $('#datepicker').val(dateFormat);

  });



  $("#datepicker").on('change', function(){
 
      var date  = new Date($(this).val());

       if(date != "Invalid Date" && $(this).val().split("/").length == 3){
          //empty other input
         $("input.time").val("");
         ASAP(false);
       }
       else{
          alert("Invalid Date");
          $(this).val("");
       }
          
  });


/*@arg TRUE OR FALSE, def. FALSE
 make button .btnASAP show TRUE OR FALSE
*/
  function ASAP(arg){

      if(arg == true){
         //change false to true
        $(".btnASAP").removeClass("btn-danger").addClass("btn-success").text("TRUE");
        $(".btnASAP").siblings('input[name=ASAP]').val(true);
        //remove value of .date
        $("input.time").val("");
        $("#datepicker").val(currentDate);
      }
      else{
        //change true to false
        $(".btnASAP").addClass("btn-danger").removeClass("btn-success").text("FALSE");
        $(".btnASAP").siblings('input[name=ASAP]').val(false);
      }


  };



});

