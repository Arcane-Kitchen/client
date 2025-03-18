import React from 'react';
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DailyCaloriesAndMacros } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

interface NutritionChartProps {
    dataValues: number[];
    labels: string[]
}

const NutritionChart: React.FC<NutritionChartProps> = ({ dataValues, labels}) => {

    const data = {
        labels,
        datasets: [{
          data: dataValues,
          backgroundColor: [
            "#d14b3a",
            "#4a6e37",
            "#f0c046"
          ],
        }]
    };
    
    const options = {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
            tooltip: {
                enabled: false,
            },
            legend: {
                display: false,
            },
            datalabels: {
                display: false,
            },
        },
    }
    return <Doughnut data={data} options={options}/>
}

export default NutritionChart;
