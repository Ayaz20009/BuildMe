$(document).ready(function(){
google.charts.load('current', {'packages':['bar']});

google.charts.setOnLoadCallback(drawChartBids);

var url  = window.location.href;
var jobID = url.split("/").pop();

function drawChartBids() {

     $.get('/homeowner/dataBids/' + jobID , function(response) {

     // 	alert(response);

        var data  = [['Name', 'Estimate Cost', 'Estimate Days', 'points']];

        for(var i in response){

            var row = response[i];
            var name = (parseInt(i) + 1) + " : " + row.firstName + " " + row.lastName ;
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
             data.push([name, estCost, estDays, points ]);
        }

      var dataTable = new google.visualization.arrayToDataTable(data);

        var options = {
          width: document.getElementById('bids').width*0.8,
          chart: {
            title: 'Compare Estimate Cost and Estimate Days',
            subtitle: 'Estimate Cost on the left, Estimate Days on the right'
          },
          series: {
            0: { axis: 'Estimate Cost' }, // Bind series 0 to an axis named 'Estimate Cost'.
            1: { axis: 'Estimate Days' },
            2: { axis: 'Points' },// Bind series 1 to an axis named ''Estimate Days'.
          },
          axes: {
            y: {
              "Estimate Cost": {label: 'Estimate Cost'}, // Left y-axis.
              "Estimate Days" : {side: 'right', label: 'Estimate Days'},
              "Points": {label: 'Points'}// Right y-axis.
            }
          }
        };

      var chart = new google.charts.Bar(document.getElementById('bids'));
      chart.draw(dataTable, options);

  });

};




});

