import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useIntl } from "react-intl";

const LineChart = ({ isDashboard, targetYearChart }) => {
    const intl = useIntl();

    const chartData = [
        {
            name: intl.formatMessage({ id: "chart.sold" }),
            color: "#9be082",
            //   color: "#f77b52",
            data: Array.from({ length: 12 }, () => 0),
        },
        {
            name: intl.formatMessage({ id: "chart.redeemed" }),
            color: "#f77b52",
            // color: "#9be082",
            data: Array.from({ length: 12 }, () => 0),
        },
    ];

    targetYearChart.forEach((data) => {
        const monthIndex = data._id - 1;
        chartData[0].data[monthIndex] = data.totalAmountGenerated;
        chartData[1].data[monthIndex] = data.totalAmountRedeemed;
    });

    const options = {
        chart: {
            type: "areaspline",
        },
        title: {
            text: " ",
        },
        xAxis: {
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
            color: 'rgba(68, 170, 213, .2)'
        },
        yAxis: {
            title: {
                text: "",
            },
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                    radius: 3,
                },
            },
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: chartData,
        credits: {
            enabled: false,
        },
        legend: {
            align: "right",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemMarginTop: 0,
            itemMarginBottom: 10,
        },
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChart;
