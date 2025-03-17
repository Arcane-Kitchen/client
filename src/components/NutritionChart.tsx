import React from 'react';
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DailyCaloriesAndMacros } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

interface NutritionChartProps {
    dataValues: DailyCaloriesAndMacros | null;
    labels: string[]
}

const NutritionChart: React.FC<NutritionChartProps> = ({ dataValues, labels}) => {

    const data = {
        labels,
        datasets: [{
          data: [dataValues?.carbs.inCalories, dataValues?.fats.inCalories, dataValues?.protein.inCalories],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
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
                display: true,
                color: "#FFFFFF",
                font: {
                    size: 10,
                },
                anchor: "start",
                align: "end",
                offset: 5,
                formatter: (value: any, context: any) => {

                    if (dataValues) {
                        const percentage = ((value / dataValues.calories) * 100).toFixed();

                        // Show macronutrient labels with their respective calorie value
                        const label = context?.chart?.data?.labels[context?.dataIndex];
                        return `${label.toUpperCase()}:\n${value.toLocaleString()} kcal(${percentage}%)`; // Show macronutrient with calories
                    }
                },
            },
        },
    }
    return <Doughnut data={data} options={options}/>
}

export default NutritionChart;
