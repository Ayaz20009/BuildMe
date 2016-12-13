$(document).ready(function(){

  $(".btnDeleteJob").click(function(){

    var jobInfo_html = $(this).closest('.panel').children('.jobInfo').html();
    $('#modal_delete_job').find('.modal-body').html(jobInfo_html);
  });


 //add class btn-default to current option 
	var url   = window.location.href;
	var option = url.split("homeowner/")[1].split("/")[0];
	$('#sidebar a[href*="'+ option  +'"]').addClass("btn-success");

    $(".btnChooseBid").click(function(){

        var panel = $(this).closest('.panel-bid');
        var modal = $('#modal_offer');
        modal.find("#bidInfo").html(panel.find('.bidInfo').html());
        
        var estCost = modal.find("input[name=estCost]").val();
        modal.find('div[name=estCost]').text(estCost);

        modal.find(".finalCost").addClass("hidden");
        modal.find('input[name=finalCost]').val(estCost);

        var startDate = new Date(panel.find("[name=startDate]").text());

        var startDateString = (startDate.getMonth() + 1 ) + "/" + startDate.getDate() + "/" + startDate.getFullYear(); 
        modal.find('input[name=startDate]').val(startDateString);
   });


    $("#btnChangeCost").click(function(){

        $('#modal_offer .finalCost').removeClass("hidden");
    });


    $("#btnCancelChange").click(function(){

        $(this).parent().addClass("hidden");
        var estCost = $('#modal_offer [name=estCost]').text();
        $('#modal_offer input[name=finalCost]').val(estCost);

    });

    // $("input[name=finalCost]").(function(){


    // });

    $("#btnOffer").click(function(){

        var finalCost = $('#modal_offer [name=finalCost]').val();
        var startDate = $('#modal_offer [name=startDate]').val();

        // alert("finalCost : "+ finalCost + "startDate" + startDate);

    });


    $(".btnConfirmProgress").click(function(){
     
     var panel = $(this).closest(".panel-job");
     $("#modal_confirm_progress #jobInfo").html(panel.find(".jobInfo").html());
    });

});

