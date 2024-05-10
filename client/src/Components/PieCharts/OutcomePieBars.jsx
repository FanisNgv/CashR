import React, { useEffect, useState } from "react";
import { VictoryBar } from "victory";
import { CSSTransition } from "react-transition-group";
import "../Transactions/Transactions.css";

const OutcomePieBar = ({ filteredTransactions }) => {
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowChart(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const outcomeTypes = {};

    if (filteredTransactions && filteredTransactions.length > 0) {
        filteredTransactions.forEach((transaction) => {
            if (parseFloat(transaction.valueOfTransaction) < 0) {
                const type = transaction.typeOfTransaction;
                const value = parseFloat(transaction.valueOfTransaction);
                if (outcomeTypes[type]) {
                    outcomeTypes[type] += value;
                } else {
                    outcomeTypes[type] = value;
                }
            }
        });

        const data = Object.keys(outcomeTypes).map((type) => ({
            x: type,
            y: -outcomeTypes[type],
            label: `${type}`,
        }));

        if (data.length > 0) {
            return (
                <div>
                    <h1>Столбцы расходов:</h1>
                    <CSSTransition
                        in={showChart}
                        timeout={500}
                        classNames="fade"
                        unmountOnExit
                    >
                        <VictoryBar
                            data={data}
                            labelRadius={100}
                            style={{
                                labels: { fontSize: 20, fill: "white" },
                                data: {
                                    fill: ({ datum }) => {
                                        const redValue = Math.floor(
                                            (datum.y / Math.max(...data.map((d) => d.y))) * 255 + 50
                                        );
                                        return `rgb(${redValue}, 0 , 0)`;
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
            <h1>Столбцы расходов:</h1>
            <h1>Нет данных</h1>
        </div>
    );
};

export default OutcomePieBar;
