$(document).ready(function(){
google.charts.load('current', {'packages':['bar']});

// google.charts.setOnLoadCallback(drawChartBids);

var url  = window.location.href;
var jobID = url.split("/").pop();

var result = [];
 $.get('/homeowner/dataBids/' + jobID , function(response) {

   
     //draw chart for each row  in #barChart_ + bidID
    for(var i in response){

      var row = response[i];
      var bidID = row.bidID;
      var graphID = "barChart_" + bidID;

      var data  = [['Comparison', 'Estimate Cost', 'Estimate Days', 'Points']];
      var estCost = parseInt(row.estCost);
      var estDays = 0;
      var estHours = 0;
      if(row.estDays)
         estDays = parseInt(row.estDays);
      if(row.estHours)
         estDays  += (parsefloat(row.estHours)/24.0).toFixed(1);

       //generate random points for example use
       var points = parseInt(Math.random() * 10000);

       $('[id=bidID_'+ row.bidID+']').find('[name=points]').text(points);
      var label = name + ': $' + estCost + '/' + estDays + ' days/' + points + ' points';
       data.push([label, estCost, estDays, points]);

      DrawChartBids(data,graphID);
    }
 });



//  $(".panel-bid").each(function(){

//    var graphID = $(this).find(".graph").attr("id");

//  });



// function DrawChartBids(data, graphID) {

//   google.charts.setOnLoadCallback(drawChart);

//    function drawChart(){
        
//     var dataTable = new google.visualization.arrayToDataTable(data);

//       var options = {
//         // width: document.getElementById('bids').width*0.8,
//         chart: {
//           // title: 'Compare Estimate Cost and Estimate Days',
//           // subtitle: 'Estimate Cost on the left, Estimate Days on the right'
//         },
//         series: {
//           0: { axis: 'Estimate Cost' }, // Bind series 0 to an axis named 'Estimate Cost'.
//           1: { axis: 'Estimate Days' },
//           2: { axis: 'Points' },// Bind series 1 to an axis named ''Estimate Days'.
//         },
//         axes: {
//           y: {
//             "Estimate Cost": {label: 'Estimate Cost'}, // Left y-axis.
//             "Estimate Days" : {side: 'right', label: 'Estimate Days'},
//             "Points": {label: 'Points'}// Right y-axis.
//           }
//         },
//         legend: {position:"none"},

//         vAxis : {
//           maxValue : 1000
//         },

//       };

//     var chart = new google.charts.Bar(document.getElementById(graphID));
//     chart.draw(dataTable, options);

//     };
//   }

});

