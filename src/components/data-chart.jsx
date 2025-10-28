import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const DataChart = ({ grafico }) => {

    console.log(grafico);


    if (!grafico) return <p>No hay datos de gráfico disponibles</p>;

    const chartData = grafico.labels.map((label, i) => ({
        mes: `Mes ${label}`,
        ingresos: grafico.ingresos[i],
        gastos: grafico.gastos[i]
    }));

    return (
        <div className="w-full h-80 mt-10">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ingresos" fill="#377888" />
                    <Bar dataKey="gastos" fill="#d5ab5d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DataChart;
