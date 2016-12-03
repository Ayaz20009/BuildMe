$(document).ready(function(){

   //click btn Delete
  $(".btnDeleteJob").click(function(){

    var jobInfo_html = $(this).closest('.panel').children('.jobInfo').html();
    $('#modal_delete_job').find('.modal-body').html(jobInfo_html);
  });


});

