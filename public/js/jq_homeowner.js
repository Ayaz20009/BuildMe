$(document).ready(function(){


   //click btn Delete
  $(".btnDeleteJob").click(function(){

    var jobInfo_html = $(this).closest('.panel').children('.jobInfo').html();
    $('#modal_delete_job').find('.modal-body').html(jobInfo_html);
  });


 //add class btn-default to current option 
var url      = window.location.href;
var urlSplit = url.split("/");
var path = urlSplit[3] + "/" + urlSplit[4];
$('.sidebar a[href*="'+ path +'"]').addClass("btn-success").siblings().removeClass("btn-success");





});

