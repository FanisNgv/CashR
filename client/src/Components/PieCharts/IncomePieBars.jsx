import React, { useEffect, useState } from "react";
import { VictoryBar } from "victory";
import { CSSTransition } from "react-transition-group";
import "../Transactions/Transactions.css";

const IncomePieBar = ({ filteredTransactions }) => {
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowChart(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const incomeTypes = {};

    if (filteredTransactions && filteredTransactions.length > 0) {
        filteredTransactions.forEach((transaction) => {
            if (transaction.come === "Income") {
                const type = transaction.typeOfTransaction;
                const value = parseFloat(transaction.valueOfTransaction);
                if (incomeTypes[type]) {
                    incomeTypes[type] += value;
                } else {
                    incomeTypes[type] = value;
                }
            }
        });

        const data = Object.keys(incomeTypes).map((type) => ({
            x: type,
            y: incomeTypes[type],
            label: `${type}`,
        }));

        // Сортировка данных по возрастанию значений y
        data.sort((a, b) => a.y - b.y);

        if (data.length > 0) {
            return (
                <div>
                    <h1>Столбцы доходов:</h1>
                    <CSSTransition
                        in={showChart}
                        timeout={500}
                        classNames="fade"
                        unmountOnExit
                    >
                        <VictoryBar
                            data={data}
                            barWidth={40}
                            labelRadius={100}
                            style={{
                                labels: { fontSize: 12, fill: "white" },
                                data: {
                                    fill: ({ datum }) => {
                                        const greenValue = Math.floor(
                                            (datum.y / Math.max(...data.map((d) => d.y))) * 255 + 50
                                        );
                                        return `rgb(0, ${greenValue}, 0)`;
                                    },
                                },
                            }}
                            animate={{ duration: 1000 }}
                        />
                    </CSSTransition>
                </div>
            );
        }
    }

    return (
        <div>
            <h1>Столбцы доходов:</h1>
            <h1>Нет данных</h1>
        </div>
    );
};

export default IncomePieBar;
