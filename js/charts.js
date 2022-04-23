function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(resultArray) ;
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    //  a. Variable that hold the otu_ids

    var otuIds=result.otu_ids ; 
    var otuIdsSliced = otuIds.slice(0,10).map(otuId => `OTU ${otuId}`).reverse(); 
    console.log(otuIdsSliced);

    //  b. Variable that hold the otu_labels
    var otuLabels =result.otu_labels ;
    var otuLabelsSliced = otuLabels.slice(0,10).reverse() ;
    console.log(otuLabelsSliced) ;

    //  c.Variable that hold the sample_values
    var samplesValues= result.sample_values;
    var samplesValuesSliced = samplesValues.slice(0,10).reverse();
    var colors = [];
    for (let i = 0; i < samplesValuesSliced.length; i++) {
    colors.push("rgb(180," + (samplesValuesSliced[i]) + ",200)");
    console.log(colors) ;
    console.log(samplesValuesSliced);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = otuIdsSliced ;
    
  }
    console.log(colors) ; 
    // 8. Create the trace for the bar chart. 
    var trace= {
      x          : samplesValuesSliced ,
      y          :  yticks ,
      text       : otuLabelsSliced ,
      type       : "bar" ,
      orientation: "h" ,
      mode : "markers" , 
      marker :{
      color : colors ,
      },
    }
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
    
    title : "<b>Top 10 Bacteria Cultured Found</b>"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    // Trace for Bubble Chat 
    
     // 1. Create the trace for the bubble chart.
     var bubbleData = [ {
      x       : otuIds ,
      y       : samplesValues ,
      text    : otuLabels , 
      mode    : "markers" ,
      marker  : {
        size  : samplesValues , 
        color : otuIds , 
        colorscale : "RdBu" 

      }

     }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title     : "<b>Bacteria Cultures per Sample</b>", 
      xaxis     : {title : "OTU ID"} ,
      hovermode : "closest" ,
      height    : 500 }

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble" , bubbleData ,bubbleLayout); 

     // Gauge Chart
     // Create a variable that holds the samples array. 
     var metadata = data.metadata;
     // Filter the data for the object with the desired sample number
     var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
     console.log(resultArray);
 
     var result = resultArray[0];
     console.log(result);
 
     //3. initialize variables and convert to a float
     var wFreq = result.wfreq
     var wFreqFloat = parseFloat(wFreq).toFixed(2)
     console.log(wFreqFloat)
 
     // 4. Create the trace for the gauge chart.
     var gaugeData = [{
       domain: { x: [0, 1], y: [0, 1] } ,
       title: "<b>Belly Button Wash Frequency</b><br>Scrubs Per Week</br>",
       type: "indicator",
       mode: "gauge+number",
       value: wFreqFloat,
       tickmode: 'linear',
       gauge: {
         axis: { range: [null, 10], dtick: 2 },
         bar: { color: "black" },
         bgcolor: "white",
         borderwidth: 2,
         bordercolor: "gray",
         steps: [
           { range: [0, 2], color: "red"},
           { range: [2, 4], color: "orange"},
           { range: [4, 6], color: "yellow"},
           { range: [6, 8], color: "lightgreen" },
           { range: [8, 10], color: "green" },
         ]},
         
     }];
     // 5. Create the layout for the gauge chart.
     var gaugeLayout = { 
       
       titlefont: {"size": 25}
     };
 
     // 6. Use Plotly to plot the gauge data and layout.
     Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}

 


