// $(document).ready(function(){
google.charts.load('current', {'packages':['bar']});

google.charts.setOnLoadCallback(drawChartBids);

var url  = window.location.href;
var jobID = url.split("/").pop();

function drawChartBids() {

     $.get('/homeowner/bids/' + jobID , function(response) {

     // 	alert(response);

        var data  = [['id', 'Estimate Cost', 'Estimate Days',{type:'string', role:'annotation'},{type:'string', role:'annotation'}]];

        for(var i in response){
            var row = response[i];
            var id = parseInt(row.id);
            var estCost = parseInt(row.estCost);
            var estDays = parseInt(row.estHours);
            var estHours = parseInt(row.estHours);
            if(estHours)
               estDays  += (estDays/24.0).toFixed(1);

             data.push([id, estCost, estDays, estCost, estDays]);
        }

      var dataTable = new google.visualization.arrayToDataTable(data);

        var options = {
          width: document.getElementById('bids').width*0.9,
          chart: {
            title: 'Compare Estimate Cost and Estimate Days',
            subtitle: 'Estimate Cost on the left, Estimate Days on the right'
          },
          series: {
            0: { axis: 'Estimate Cost' }, // Bind series 0 to an axis named 'Estimate Cost'.
            1: { axis: 'Estimate Days' } // Bind series 1 to an axis named ''Estimate Days'.
          },
          axes: {
            y: {
              "Estimate Cost": {label: ''}, // Left y-axis.
              'Estimate Days' : {side: 'right', label: ''} // Right y-axis.
            }
          }
        };

      var chart = new google.charts.Bar(document.getElementById('bids'));
      chart.draw(dataTable, options);

  });

};




// });

