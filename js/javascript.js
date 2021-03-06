Plotly.d3.csv("https://raw.githubusercontent.com/flobrec/plotly/master/data_cantons.csv", function(err, rows){
	
	  function filter_and_unpack(rows, key, date) {
	  return rows.filter(row => row['Date'] == date).map(row => row[key])
	  }
	
	  var frames_cases = []
    var frames_cphk = []
	  var slider_steps = []
	  
	  max_cases = Plotly.d3.max(rows, function(d) { return +d.Cases; })
	  max_cases = Math.ceil(max_cases/200)*200
    max_cphk = Plotly.d3.max(rows, function(d) { return +d.CasesPer100k; })
	  max_cphk = Math.ceil(max_cphk/50)*50
 
	  min_date_str = Plotly.d3.min(rows, function(d) { return d.Date; })
	  max_date_str = Plotly.d3.max(rows, function(d) { return d.Date; })
	  
	  
	  var curr_date = new Date(min_date_str)
    var max_date = new Date(max_date_str)
	  var i=0
	  while (curr_date <= max_date) {
	    num_str = curr_date.toISOString().substr(0,10)
	    var z_cases = filter_and_unpack(rows, 'Cases', num_str)
      var z_cphk = filter_and_unpack(rows, 'CasesPer100k', num_str)
	    var locations = filter_and_unpack(rows, 'Canton', num_str)
	    frames_cases[i] = {data: [{z: z_cases, locations: locations, text: locations}], name: num_str}
      frames_cphk[i] = {data: [{z: z_cphk, locations: locations, text: locations}], name: num_str}
	    slider_steps.push ({
	        label: num_str,
	        method: "animate",
	        args: [[num_str], {
	            mode: "immediate",
	            transition: {duration: 300},
	            frame: {duration: 300}
	          }
	        ]
	      })
	    curr_date.setDate(curr_date.getDate() + 1)
      i++
	  }
	
	var data_cases = [{
	      type: "choroplethmapbox",
	      geojson: "https://raw.githubusercontent.com/flobrec/plotly/master/swiss_cantons.json",
	      locations: frames_cases[0].data[0].locations,
	      z: frames_cases[0].data[0].z,
	      text: frames_cases[0].data[0].locations,
	      zauto: false,
	      zmin: 0,
	      zmax: max_cases
	
	}];
  
  var data_cphk = [{
	      type: "choroplethmapbox",
	      geojson: "https://raw.githubusercontent.com/flobrec/plotly/master/swiss_cantons.json",
	      locations: frames_cphk[0].data[0].locations,
	      z: frames_cphk[0].data[0].z,
	      text: frames_cphk[0].data[0].locations,
	      zauto: false,
	      zmin: 0,
	      zmax: max_cphk
	
	}];
	  
	var config = {mapboxAccessToken: "pk.eyJ1IjoiZmxvYnJlY2h0IiwiYSI6ImNrODRoaHI0bzE5bWYzdG1zMTZ4NmYxZTUifQ.vrpEIGfPE92RFKgQnYbPxA"};  
	  
	var layout = {
		title: {text: 'Cases per Canton',font: {size: 28},},
		paper_bgcolor: 'rgb(241, 241, 241)',
		mapbox: {style:'carto-darkmatter', center: {lon: 8.3, lat: 47.05}, zoom: 6.5},
	              width: 1000, height:800,
		geo:{
	       scope: 'world',
	       countrycolor: 'rgb(255, 255, 255)',
	       showland: true,
	       landcolor: 'rgb(217, 217, 217)',
	       showlakes: true,
	       lakecolor: 'rgb(255, 255, 255)',
	       subunitcolor: 'rgb(255, 255, 255)',
	       lonaxis: {},
	       lataxis: {}
	    },
	    updatemenus: [{
	      x: 0.1,
	      y: 0,
	      yanchor: "top",
	      xanchor: "right",
	      showactive: false,
	      direction: "left",
	      type: "buttons",
	      pad: {"t": 87, "r": 10},
	      buttons: [{
	        method: "animate",
	        args: [null, {
	          fromcurrent: true,
	          transition: {
	            duration: 200,
	          },
	          frame: {
	            duration: 500
	          }
	        }],
	        label: "Play"
	      }, {
	        method: "animate",
	        args: [
	          [null],
	          {
	            mode: "immediate",
	            transition: {
	              duration: 0
	            },
	            frame: {
	              duration: 0
	            }
	          }
	        ],
	        label: "Pause"
	      }]
	    }],
	    sliders: [{
	      active: 0,
	      steps: slider_steps,
	      x: 0.1,
	      len: 0.9,
	      xanchor: "left",
	      y: 0,
	      yanchor: "top",
	      pad: {t: 50, b: 10},
	      currentvalue: {
	        visible: true,
	        prefix: "Date:",
	        xanchor: "right",
	        font: {
	          size: 20,
	          color: "#666"
	        }
	      },
	      transition: {
	        duration: 300,
	        easing: "cubic-in-out"
	      }
	    }]
	};
	  
	Plotly.newPlot('myDivCases', data_cases, layout,config).then(function() {
	    Plotly.addFrames('myDivCases', frames_cases);
	  });
	layout.title.text='Cases per Canton per 100k Inhabitants'
	Plotly.newPlot('myDivCphk', data_cphk, layout,config).then(function() {
	    Plotly.addFrames('myDivCphk', frames_cphk);
	  });
  
	});
