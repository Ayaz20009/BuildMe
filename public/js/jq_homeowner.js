$(document).ready(function(){


   //click btn Delete
  $(".btnDeleteJob").click(function(){

    var jobInfo_html = $(this).closest('.panel').children('.jobInfo').html();
    $('#modal_delete_job').find('.modal-body').html(jobInfo_html);
  });


 //add class btn-default to current option 
	var url   = window.location.href;
	var option = url.split("homeowner/")[1].split("/")[0];
	$('#sidebar a[href*="'+ option  +'"]').addClass("btn-success");


    $(".btnChooseBid").click(function(){
    
        var panelBid = $(this).closest('.panel-bid');
        var estCost = panelBid.find("[name=estCost]").text();
        var startDate = new Date(panelBid.find("[name=startDate]").text());
        var startDateString = (startDate.getMonth() + 1 ) + "/" + startDate.getDate() + "/" + startDate.getFullYear(); 
        var modal = $('#modal_offer');
        modal.find('[name=estCost]').text(estCost);
        modal.find('.finalCost').addClass("hidden");
        modal.find('input[name=finalCost]').val(estCost);
        modal.find('input[name=startDate]').val(startDateString);
   });


    $("#btnChangeCost").click(function(){

        $('#modal_offer .finalCost').removeClass("hidden");
    });


    $("#btnCancelChange").click(function(){

        $(this).parent().addClass("hidden");
        var estCost = $('#modal_offer [name=estCost]').text();
        $('#modal_offer input[name=finalCost]').val();

    });

});

