import { NoEncryption } from '@mui/icons-material';
import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';



export default (...props) => {
    let groupbysum = props[0].rows.reduce((acc, curr) => {
        const skillList = props[0].uniqueSkills
        for (let i = 0; i < skillList.length; i++) {
          if (acc[skillList[i]]) {
              acc[skillList[i]] += curr[skillList[i]]
          } else {
              acc[skillList[i]] = curr[skillList[i]]
          }
      }
      return acc;
    }, {});
    console.log(Object.keys(groupbysum))

    const data = {
        labels: Object.keys(groupbysum),          
      datasets: [{
        borderColor: 'white',
        fontColor: 'white',
        borderWidth: 0,
        data: Object.values(groupbysum),
        backgroundColor: [
        '#120078',
        '#9D0191',
        '#FD3A69',
        '#FECD1A'
        ],
        hoverBackgroundColor: [
            '#1F00CD',
            '#CF01BE',
            '#FE7293',
            '#FEDB5C'
        ]
      }]
      };

      const options = {
        layout: {
            padding: 0
        },
        plugins:{
            datalabels  : {
                display: true
              },
            font:{
                defaultFontFamily: 'Roboto'
            },
            legend:{
                display: true,
                labels: {
                    color: 'white',
                    textAlign: 'left',
                }
            },
            tooltip:{
                callback: function(tooltipItem, data) {
                    return data.labels[tooltipItem[0].index] + ': ' + data.datasets[0].data[tooltipItem[0].index] + '%';
                }
            }
        }
      };
    return(
 <div>
    <h2>Skills Distribution</h2>
    <Doughnut
        data={data}
        options={options}
        width={400}
        height={400}
    />
</div>
    );
};