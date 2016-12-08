google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

	   var data = google.visualization.arrayToDataTable([
        ['Job', 'Percentage',],
        ['Job 1 by contract 1', Math.random()*100],
        ['Job 2 by contract 2', Math.random()*100],
        ['Job 3 by contract 3', Math.random()*100],
        ['Job 3 by contract 3', Math.random()*100],
      ]);

      var options = {
        width: document.getElementById('jobprocess').width * 0.9,
        height:document.getElementById('jobprocess').height * 0.7,
        // title: 'Process of Jobs Started',
        chartArea: {width: '80%'},
        hAxis: {
          // title: 'Job process',
          minValue: 0
        },
        vAxis: {
          title: 'Jobs'
        },
        legend: { position: "top" },
      };

      var chart = new google.visualization.BarChart(document.getElementById('jobprocess'));

      chart.draw(data, options);

};



google.charts.setOnLoadCallback(drawChartBids);

function drawChartBids() {


     $.get('/homeowner/overviewbids', function(response) {

        var totalJobs = response.length;
        var totalBids = 0;
        var jobsOpen = 0;
        var bidsOpenJobs = 0;
        var jobsOffers  = 0;
        var bidsOfferJobs = 0;

        for(var i in response){

            var row = response[i];
            totalBids += parseInt(row.numBids);
            if(row.bidID ==  null){

                jobsOpen += 1;
                bidsOpenJobs += row.numBids;
            }
            else{

                jobsOffers += 1;
                bidsOfferJobs += row.numBids;
            }

        }

       var data = google.visualization.arrayToDataTable([
        ['Job vs Bids',                'Counts',     { role: 'annotation' },   {role:'style'}],
        ['Job Created',                totalJobs,      totalJobs,             'color:#22AA99'],
        ['Total Bids',                 totalBids,      totalBids,              'color:#FF9900'],
        ['Jobs Bidding',                jobsOpen ,     jobsOpen ,              'color:#66AA00'],
        ['Bids on opening jobs', bidsOpenJobs,  bidsOpenJobs,            'color:#FF9900'],
        ['Jobs Offered',               jobsOffers,      jobsOffers,            'color:#3366CC'],
        ['Bids on offering jobs',   0,            0,                     'color:#FF9900'],
        ['Jobs Complete',                 0,            0,                     'color:#B82E2E'],
        ['Bids on completed jobs',  0,            0,                     'color:#FF9900'],
      ]);

       // console.log(JSON.stringify(data));

      var options = {
        width: document.getElementById('jobbids').width ,
        height:document.getElementById('jobbids').height * 0.8,
        // title: 'Process of Jobs Started',
        chartArea: {width: '80%'},
        hAxis: {
          // title: 'Job process',
          minValue: 0
        },
        legend: { position: "none" },
        // colors : ['#22AA99','#FF9900','#66AA00','#FF9900','#3366CC','#FF9900','#B82E2E','#FF9900']
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('jobbids'));

      chart.draw(data, options);

  });

};




function drawChartJobBids() {


     $.get('/homeowner/bids/2', function(response) {

      alert(response);

      //  var data = google.visualization.arrayToDataTable([
      //   ['Bids on offering jobs',   0,            0,                     'color:#FF9900'],
      //   ['Jobs Complete',                 0,            0,                     'color:#B82E2E'],
      //   ['Bids on completed jobs',  0,            0,                     'color:#FF9900'],
      // ]);

      //  // console.log(JSON.stringify(data));

      // var options = {
      //   width: document.getElementById('jobbids').width ,
      //   height:document.getElementById('jobbids').height * 0.8,
      //   // title: 'Process of Jobs Started',
      //   chartArea: {width: '80%'},
      //   hAxis: {
      //     // title: 'Job process',
      //     minValue: 0
      //   },
      //   legend: { position: "none" },
      //   // colors : ['#22AA99','#FF9900','#66AA00','#FF9900','#3366CC','#FF9900','#B82E2E','#FF9900']
      // };

      // var chart = new google.visualization.ColumnChart(document.getElementById('jobbids'));

      // chart.draw(data, options);

  });

};



// [{"id":5,"hoID":1,"jobDesc":"new jobs","street":"addd","city":"ddd","state":"AF","zipcode":10000,"numBids":0,"bidID":null,"createdAt":"2016-12-05T06:40:42.291Z","updatedAt":"2016-12-05T06:40:42.291Z"},{"id":2,"hoID":1,"jobDesc":"create a new job ","street":"new york","city":"new york ","state":"AL","zipcode":10000,"numBids":0,"bidID":null,"createdAt":"2016-12-05T01:53:40.390Z","updatedAt":"2016-12-05T01:53:40.390Z"},{"id":1,"hoID":1,"jobDesc":"create a new project ","street":"chinatown","city":"new york ","state":"NY","zipcode":1000,"numBids":0,"bidID":null,"createdAt":"2016-12-04T17:03:36.872Z","updatedAt":"2016-12-04T17:03:36.872Z"}]