/**
 * Welcome to the Looker Visualization Builder! Please refer to the following resources 
 * to help you write your visualization:
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 **/

const visObject = {
    /**
     * Configuration options for your visualization. In Looker, these show up in the vis editor
     * panel but here, you can just manually set your default values in the code.
     **/
     options: {
        color: {
            type: "string",
            label: "font-color",
            default: "black"
        },
        fontSize: {
            type: "number",
            label: "font-size",
            default: 24
        },
        fontWeight: {
            type: "number",
            label: "font-weight",
            default: 100
        },
        textAlign: {
            type: "string",
            label: "text-align",
            default: "center"
        },
        verticalAlign: {
            type: "string",
            label: "vertical-align",
            default: "middle"
        },
        padding: {
            type: "string",
            label: "padding",
            default: "10px 10px 10px 10px"
        },
        margin: {
            type: "string",
            label: "margin",
            default: "10px 10px 10px 10px"
        },
        fontFamily: {
            type: "string",
            label: "font-family",
            default: '"Open Sans","Noto Sans JP","Noto Sans","Noto Sans CJK KR",Helvetica,Arial,sans-serif'
        }
     },
    
    /**
     * The create function gets called when the visualization is mounted but before any
     * data is passed to it.
     **/
       create: function(element, config){
           element.innerHTML = '<div id="container" ></div>';
       },
   
    /**
     * UpdateAsync is the function that gets called (potentially) multiple times. It receives
     * the data and should update the visualization with the new data.
     **/
       updateAsync: function(data, element, config, queryResponse, details, doneRendering){
           console.log(data);
           console.log(queryResponse);
            var measure_name = queryResponse['fields']['measures'][0]['name']
            var val = data[0][measure_name]['rendered'];
            var container = document.getElementById('container');
            container.innerHTML = val;
            container.style.color = config.color;
            container.style.fontSize = config.fontSize + 'px';
            container.style.textAlign = config.textAlign;
            container.style.verticalAlign = config.verticalAlign;
            container.style.padding = config.padding;
            container.style.margin = config.margin;
            container.style.fontFamily = config.fontFamily;
            container.style.fontWeight = config.fontWeight;
            
            doneRendering();
        }
   };
   
   looker.plugins.visualizations.add(visObject);