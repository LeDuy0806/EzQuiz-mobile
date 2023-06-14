import React from 'react';
import { Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';

const dataPie = [
    {
        name: 'Math',
        population: 21500000,
        color: 'rgba(131, 167, 234, 1)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
    },
    {
        name: 'Music',
        population: 2800000,
        color: '#F00',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
    },
    {
        name: 'Tech',
        population: 527612,
        color: 'red',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
    },
    {
        name: 'Science',
        population: 8538000,
        color: 'gray',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
    },
    {
        name: 'Sport',
        population: 11920000,
        color: 'rgb(0, 0, 255)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
    },
];

const dataBar = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            data: [20, 45, 28, 80, 99, 43],
        },
    ],
};

const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(39, 106,245, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
};

const screenWidth = Dimensions.get('window').width;

export const PieChartCompo = () => {
    return (
        <PieChart
            data={dataPie}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
        />
    );
};

export const BarChartCompo = () => {
    return (
        <BarChart
            data={dataBar}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
        />
    );
};
