google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

	   var data = google.visualization.arrayToDataTable([
        ['Job', 'Percentage',],
        ['Job 1 by contract 1', 90],
        ['Job 2 by contract 2', 80],
        ['Job 3 by contract 3', 75],
        ['Job 3 by contract 3', 40],
      ]);

      var options = {
        width: document.getElementById('jobprocess').width * 0.9,
        height:document.getElementById('jobprocess').height * 0.7,
        title: 'Process of Jobs Started',
        chartArea: {width: '50%'},
        hAxis: {
          // title: 'Job process',
          minValue: 0
        },
        vAxis: {
          title: 'Job'
        }
      };

      var chart = new google.visualization.BarChart(document.getElementById('jobprocess'));

      chart.draw(data, options);

};