  (function() {
      var viz = {
          // id: "transposed_table",      // id is only necessary for legacy custom visualizations
          // label: "Transposed Table",   // label is only necessary for legacy custom visualizations
          options: {
              color_range: {
                section: "Formatting",
                type: "array",
                label: "Color Range",
                display: "colors"
                ,default: ['green', 'red', 'blue']
              }
              , y_min: {
                section: "Formatting",
                type: "number",
                label: "Y-Axis Minimum Value",
                display: "number",
                default: 0
              }
              , money: {
                section: "Formatting",
                type: "boolean",
                label: "Money Value Labels",
                display: "radio",
                default: false
              }
              , value_1: {
                  section: "Positive / Negative",
                  type: "boolean",
                  label: "Value 1 - is Negative?",
                  display: "radio",
                  default: false
              }
              , value_2: {
                  section: "Positive / Negative",
                  type: "boolean",
                  label: "Value 2 - is Negative?",
                  display: "radio",
                  default: false
              }
              , value_3: {
                  section: "Positive / Negative",
                  type: "boolean",
                  label: "Value 3 - is Negative?",
                  display: "radio",
                  default: true
              }
              , value_4: {
                  section: "Positive / Negative",
                  type: "boolean",
                  label: "Value 4 - is Negative?",
                  display: "radio",
                  default: true
              }
              , value_5: {
                  section: "Positive / Negative",
                  type: "boolean",
                  label: "Value 5 - is Negative?",
                  display: "radio",
                  default: false
              }
              , value_6: {
                  section: "Positive / Negative",
                  type: "boolean",
                  label: "Value 6 - is Negative?",
                  display: "radio",
                  default: false
              }
              , value_7: {
                  section: "Positive / Negative",
                  type: "boolean",
                  label: "Value 7 - is Negative?",
                  display: "radio",
                  default: false
              }
              , value_8: {
                  section: "Positive / Negative",
                  type: "boolean",
                  label: "Value 8 - is Negative?",
                  display: "radio",
                  default: false
              }
              , value_9: {
                  section: "Positive / Negative",
                  type: "boolean",
                  label: "Value 9 - is Negative?",
                  display: "radio",
                  default: false
              }
          },

          // Set up the initial state of the visualization
          create: function(element, config) {
              // initialize a div to place the table
              // var css = element.innerHTML = `<div id="transposed_table"></div>`;
              element.innerHTML = '<div id="container" style="height:100%; width:100%; position:absolute; margin: 0 auto"></div>';
          },
          // Render in response to the data or settings changing
          updateAsync: function(data, element, config, queryResponse) {
              debug = false;

              if (debug) {
                console.log('data: ');
                console.log(data);
                console.log('qr: ');
                console.log(queryResponse);
              }

              // Clear any errors from previous updates.
              this.clearErrors();

              // Throw some errors and exit if the shape of the data isn't what this chart needs.
              if (queryResponse.fields.dimensions.length == 0) {
                this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
                return;
              } else if (queryResponse.fields.measures.length + queryResponse.fields.table_calculations.length == 0) {
                this.addError({title: "No Measures / Table Calcs", message: "This chart requires measures or table calculations."});
                return;
              }

              var clmns = [];
              var clmn_names = [];
              var positive_rows = [];
              var positive_rows_rendered = [];
              var negative_rows = [];
              var offset = [];
              var total = [];

              for (var i = 0; i < queryResponse.fields.measures.length; i++) {
                clmns.push(queryResponse.fields.measures[i].label_short);
                clmn_names.push(queryResponse.fields.measures[i].name);
              }

              for (var i = 0; i < queryResponse.fields.table_calculations.length; i++) {
                clmns.push(queryResponse.fields.table_calculations[i].label);
                clmn_names.push(queryResponse.fields.table_calculations[i].name);
              }

              clmns.push('Total');

              running_total = 0;
              total_val = 0;
              for (var i = 0; i < clmn_names.length; i++) {
                
                var field = clmn_names[i];
                var current_value = data[0][field].value;
                var current_value_rendered = '';
                if (data[0][field].rendered != null) {
                  current_value_rendered = data[0][field].rendered
                } else {
                  current_value_rendered = data[0][field].value;
                }

                if (config['value_' + (i + 1)]) {
                  is_positive = false;
                } else {
                  is_positive = true;
                }

                if (is_positive) {
                  offset.push(running_total);
                  positive_rows.push(current_value);
                  negative_rows.push(0)
                  running_total += current_value;
                  
                } else {
                  positive_rows.push(0)
                  negative_rows.push(current_value);
                  running_total -= current_value;
                  offset.push(running_total);
                }

                total.push(0); 
              }

              positive_rows.push(0);
              negative_rows.push(0);
              offset.push(0);
              total.push(running_total);

              if (debug) {
                console.log(offset);
                console.log(positive_rows);
                console.log(negative_rows);
                console.log(total);
              }

              Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                  text: ''
                },
                xAxis: {
                    categories: clmns
                },
                yAxis: {
                    min: config.y_min,
                    title: {
                      enabled: false
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                legend: {
                  enabled: false
                },
                exporting: {
                  enabled: false
                },
                series: [{
                    name: 'Positive',
                    data: positive_rows,
                    color: config.color_range[0],
                    dataLabels: {
                      enabled: true,
                      formatter: function() {
                          if (this.y != 0) {

                            var formatted_number;
                            if (config.money) {
                              formatted_number = this.y > 999 ? '$' + (this.y/1000).toFixed(1) + 'k' : '$' + this.y;
                            } else {
                              formatted_number = this.y;
                            }
                            
                            return formatted_number;
                          } else {
                            return null;
                          }
                      }
                    }
                }, {
                    name: 'Negative',
                    data: negative_rows,
                    color: config.color_range[1],
                    dataLabels: {
                      enabled: true,
                      formatter: function() {
                          if (this.y != 0) {

                            var formatted_number;
                            if (config.money) {
                              formatted_number = this.y > 999 ? '$' + (this.y/1000).toFixed(1) + 'k' : '$' + this.y;
                            } else {
                              formatted_number = this.y;
                            }
                            
                            return formatted_number;
                          } else {
                            return null;
                          }
                      }
                    }
                }, {
                    name: 'Offset',
                    data: offset,
                    color: 'transparent',
                    dataLabels: false
                }, {
                    name: 'Total',
                    data: total,
                    color: config.color_range[2],
                    dataLabels: {
                      enabled: true,
                      formatter: function() {
                          if (this.y != 0) {

                            var formatted_number;
                            if (config.money) {
                              formatted_number = this.y > 999 ? '$' + (this.y/1000).toFixed(1) + 'k' : '$' + this.y;
                            } else {
                              formatted_number = this.y;
                            }
                            
                            return formatted_number;
                          } else {
                            return null;
                          }
                      }
                    }
                }]  
              });

              // done();
          }
      };

      // initialize visualization with data
      looker.plugins.visualizations.add(viz);
  }());