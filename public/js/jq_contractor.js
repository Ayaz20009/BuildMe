$(document).ready(function(){

      //click btn Delete
  $(".btnDeleteBid").click(function(){

    var bidInfo_html = $(this).closest('.panel').find('.bidInfo').html();
     $('#modal_delete_bid').find('.modal-body').html(bidInfo_html);
   });


});

