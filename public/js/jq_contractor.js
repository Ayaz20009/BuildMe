$(document).ready(function(){

      //click btn Delete
  $(".btnDeleteBid").click(function(){

    var bidInfo_html = $(this).closest('.panel').find('.bidInfo').html();
     $('#modal_delete_bid').find('.modal-body').html(bidInfo_html);
   });


//add class btn-default to current option 
var url      = window.location.href;
var urlSplit = url.split("/");
var path = urlSplit[3] + "/" + urlSplit[4];
$('.sidebar a[href*="'+ path +'"]').addClass("btn-primary").siblings().removeClass("btn-primary");


});

