import React, { useEffect, useState } from "react";
import {VictoryBar, VictoryPie} from "victory";
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

        return (
            <div>
                <h1>Столбцы доходов:</h1>
                {data.length > 0 ? (
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
                ) : null}
            </div>
        );
    } else {
        return null;
    }
};

export default IncomePieBar;
