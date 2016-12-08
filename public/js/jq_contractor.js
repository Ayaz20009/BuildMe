$(document).ready(function(){

      //click btn Delete
  $(".btnDeleteBid").click(function(){

    var bidInfo_html = $(this).closest('.panel').find('.bidInfo').html();
     $('#modal_delete_bid').find('.modal-body').html(bidInfo_html);
   });



//add class btn-default to current option 
	var url   = window.location.href;
	var option = url.split("contractor/")[1].split("/")[0];
	$('#sidebar a[href*="'+ option  +'"]').addClass("btn-primary");


});

