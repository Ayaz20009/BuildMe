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

	$('.btnAccept').click(function(){

     $("#modal_accept #jobInfo").html($(this).closest(".panel-offer").find(".jobInfo").html());

	});


  $(".btnUpdateProgress").click(function(){
     
     var panel = $(this).closest(".panel-job");
     $("#modal_update_progress #jobInfo").html(panel.find(".jobInfo").html());
     var jobID = panel.find("input[name=jobID]");
     var percentage = panel.find("input[name=percentage]").val();
      SetPercentage(percentage);

  });

    $("#modal_update_progress input.updatedPercentage").change(function(){

         var percentage = $("#modal_update_progress input[name=percentage]").val();
         var updatedPercentage = $(this).val();

         if(updatedPercentage > percentage || updatedPercentage <= 100)
           SetPercentage(updatedPercentage);
         else
           SetPercentage(percentage);

    });

    function SetPercentage(pt){

       $("#modal_update_progress input.updatedPercentage").val(pt);
       $("#modal_update_progress span.updatedPercentage").text(pt + " %");
       $("#modal_update_progress .progress-bar").css("width",pt + "%");

    };

});

