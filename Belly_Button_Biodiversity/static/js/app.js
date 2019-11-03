function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((info) => {
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var SMPanel = d3.select("#sample-metadata");
      
    // Use `.html("") to clear any existing metadata
    SMPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(info).forEach(([key, value]) => {
        SMPanel.append("h6").text(`${key} : ${value}`);      
      });
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  
  });
  
};


function buildCharts(sample) {
  console.log("ran buildCharts");
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((info) => {


    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: info.otu_ids,
      y: info.sample_values,
      text: info.otu_labels,
      mode: 'markers',
      marker: {

        color: info.otu_ids,
        size: info.sample_values,
        opacity: 1
      }
    };

    var plotData = [trace1];
    
    var layout = {
      //title: 'Chart Title',
      showlegend: false,
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('bubble', plotData, layout);


    // @TODO: Build a Pie Chart
    const svTop10 = info.sample_values.slice(0,10);
    const otuidTop10 = info.otu_ids.slice(0,10);
    const labelTop10 = info.otu_labels.slice(0,10);
    console.log(svTop10);
    console.log(otuidTop10);
    console.log(labelTop10);

    var plotData = [{
      values: svTop10,
      labels: otuidTop10,
      hovertext: labelTop10,
      type: 'pie'
    }];

    var layout = {
      height: 500,
      width: 500,
      margin: {
        l: 10,
        r: 10,
        b: 10,
        t: 10,
        pad: 4
      }
    };

  Plotly.newPlot('pie', plotData, layout);

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and otu_labels (10 each).


  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected

  buildMetadata(newSample);
  buildCharts(newSample);

}

// Initialize the dashboard
init();
