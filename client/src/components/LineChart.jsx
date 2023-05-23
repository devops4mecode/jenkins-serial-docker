import { ResponsiveLine } from "@nivo/line"
import { useIntl } from "react-intl"
import '../'


const LineChart = ({ isDashboard, monthlyGenerated, monthlyRedeemed }) => {

    const intl = useIntl();

    const chartData = [
        {
            id: intl.formatMessage({ id: "chart.redeemed" }),
            color: '#9be082',
            data: [
                { x: "Jan", y: 0 },
                { x: "Feb", y: 0 },
                { x: "Mar", y: 0 },
                { x: "Apr", y: 0 },
                { x: "May", y: 0 },
                { x: "Jun", y: 0 },
                { x: "Jul", y: 0 },
                { x: "Aug", y: 0 },
                { x: "Sep", y: 0 },
                { x: "Oct", y: 0 },
                { x: "Nov", y: 0 },
                { x: "Dec", y: 0 },
            ],
        },
        {
            id: intl.formatMessage({ id: "chart.sold" }),
            color: '#f77b52',
            data: [
                { x: "Jan", y: 0 },
                { x: "Feb", y: 0 },
                { x: "Mar", y: 0 },
                { x: "Apr", y: 0 },
                { x: "May", y: 0 },
                { x: "Jun", y: 0 },
                { x: "Jul", y: 0 },
                { x: "Aug", y: 0 },
                { x: "Sep", y: 0 },
                { x: "Oct", y: 0 },
                { x: "Nov", y: 0 },
                { x: "Dec", y: 0 },
            ],
        },
    ];

    // Map monthly generated data to chart data
    monthlyGenerated.forEach((data) => {
        const index = data.month - 1;
        chartData[1].data[index].y = data.givenCredit;
    });

    // Map monthly redeemed data to chart data
    monthlyRedeemed.forEach((data) => {
        const index = data.month - 1;
        chartData[0].data[index].y = data.givenCredit;
    });

    return (
        <ResponsiveLine
            data={chartData}


            theme={{
                axis: {
                    domain: { line: { stroke: "#141414" } },
                    legend: { text: { fill: "#141414" } },
                    ticks: {
                        line: { stroke: "#141414", strokeWidth: 1 },
                        text: { fill: "#141414" }
                    }
                },
                legends: { text: { fill: "#141414" } },
                tooltip: { container: { color: "#141414" } }
            }}
            colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
            margin={{ top: 50, right: 30, bottom: 50, left: 40 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                // stacked: true,
            }}
            yFormat=" >-.2f"
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : '',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickValues: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : '',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            pointSize={3}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            // debugMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'row',
                    justify: false,
                    translateX: -20,
                    translateY: 60,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 70,
                    itemHeight: 30,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    )
}

export default LineChart