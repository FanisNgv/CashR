import React, { useEffect, useState } from "react";
import { VictoryPie, VictoryLegend } from "victory";
import { CSSTransition } from "react-transition-group";
import "../Transactions/Transactions.css";

const OutcomePieChart = ({ filteredTransactions }) => {
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowChart(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const types = {};

    if (filteredTransactions && filteredTransactions.length > 0) {
        filteredTransactions.forEach((transaction) => {
            if (parseFloat(transaction.valueOfTransaction) < 0) {
                const type = transaction.typeOfTransaction;
                const value = parseFloat(transaction.valueOfTransaction);
                if (types[type]) {
                    types[type] += value;
                } else {
                    types[type] = value;
                }
            }
        });

        const data = Object.keys(types).map((type) => ({
            x: type,
            y: -types[type],
        }));

        data.sort((a, b) => b.y - a.y);

        const maxValue = Math.max(...data.map((d) => d.y));
        const legendData = data.map((item) => ({
            name: item.x,
            symbol: { fill: `rgb(${Math.floor((item.y / maxValue) * 255)}, 0, 0)` }
        }));

        return (
            <div>
                <h1>Диаграмма расходов:</h1>
                <CSSTransition
                    in={showChart}
                    timeout={500}
                    classNames="fade"
                    unmountOnExit
                >
                    <div>
                        <VictoryPie
                            data={data}
                            labelComponent={null} // Убираем компонент отображения названий типов
                            labelRadius={120}
                            style={{
                                data: {
                                    fill: ({ datum }) => {
                                        return legendData.find((item) => item.name === datum.x)?.symbol.fill || "black";
                                    },
                                },
                            }}
                            animate={{ duration: 1000 }}
                        />
                        <VictoryLegend
                            x={20}
                            y={0}
                            orientation="vertical"
                            data={legendData}
                            style={{
                                labels: { fontSize: 16, fill: "white" } // Настройка размера шрифта и цвета
                            }}
                        />
                    </div>
                </CSSTransition>
            </div>
        );
    } else {
        return null;
    }
};

export default OutcomePieChart;
