import { useEffect, useState } from "react"
import Chart, { controllers } from 'chart.js/auto';

export default function Home(props) {

    const [avgLoanAmt, setavgLoanAmt] = useState(0)
    const [totalTxn, settotalTxn] = useState(0)
    const [totalDebits, settotalDebits] = useState(0)
    const [closedTxn, setclosedTxn] = useState(0)
    const ctx = document.getElementById('myChart');

    function renderChart(months, totalTxn, ctx) {

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Total Transactions',
                    data: totalTxn,
                    borderWidth: 2,
                    borderColor: 'red',
                    backgroundColor: 'white',
                    tension: 0.4
                }]
            },
            options: {
                animations: {
                    radius: {
                        duration: 400,
                        easing: 'linear',
                        loop: (context) => context.active
                    }
                },
                hoverRadius: 12,
                hoverBackgroundColor: 'yellow',
                interaction: {
                    mode: 'nearest',
                    intersect: false,
                    axis: 'x'
                },
                plugins: {
                    tooltip: {
                        enabled: false
                    }
                }
            },
        });

    }


    async function fetchReceipts() {
        fetch(props.endpoint + '/fetchReceipts?emailAddress=' + props.emailAddress, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(function (val) {
            if (val['msg']) {
                // totalDebits: total debits are all receipts they upload
                let totalDebits = 0;
                val.data.map(data => {
                    totalDebits = totalDebits + parseInt(data.inputRecAmt)
                });
                settotalDebits(totalDebits)
            } else {
                // No Receipts
                settotalDebits(0)
            }
        });
    }

    useEffect(() => {
        /*
        Home: 
        1.Average of all closed loans 
        2.total transactions by year. 
        3.Total debits are all receipts they upload. The total amount 
        4.closed transactions are yearly closed. 
        5.sales progress graph, this is a yearly graphic showing transactions close per month. As they slid the dot the number of closed transaction will populate. 
        6.total should be the same as top total transactions. I put the wrong number should 9.
        */
        if (props.leadDatas !== undefined) {
            let totaltxn = 0
            let avgcount = 0
            let closedTxn = 0
            let avgLoanAmt = 0
            let totalTransactions = {}
            let dict_of_months = {
                1: 'JAN',
                2: 'FEB',
                3: 'MAR',
                4: 'APR',
                5: 'MAY',
                6: 'JUN',
                7: 'JUL',
                8: 'AUG',
                9: 'SEP',
                10: 'OCT',
                11: 'NOV',
                12: 'DEC'
            }
            props.leadDatas.map(data => {

                // Need to fetch the total transactions as per the month
                let leads_month = parseInt(new Date(data.createdon).getMonth())
                let current_month = dict_of_months[leads_month + 1]

                if (totalTransactions[current_month] !== undefined)
                    totalTransactions[current_month] = totalTransactions[current_month] + 1
                else
                    totalTransactions[current_month] = 1

                // totalTxn: total transactions by year. 
                if (parseInt(new Date(data.createdon).getFullYear()) === new Date().getFullYear()) {
                    if (data.transaction === 'CLOSED') {
                        // closedTxn: closed transactions are yearly closed
                        closedTxn++
                    }
                    totaltxn++
                }

                if (data.transaction === 'CLOSED') {
                    // avgLoanAmt: Average of all closed loans
                    avgcount++
                    avgLoanAmt = avgLoanAmt + parseInt(data.loanAmt)
                }

            });

            renderChart(Object.keys(totalTransactions), Object.values(totalTransactions), ctx)

            if (avgLoanAmt !== 0)
                setavgLoanAmt(avgLoanAmt / avgcount)

            settotalTxn(totaltxn)
            setclosedTxn(closedTxn)
        }

        fetchReceipts()
    }, [props.leadDatas])

    return (
        <div className={props.formState === 'Home' ? 'col-md-9 show' : 'hide'}>
            <h1>Home</h1>
            <br />
            <div className="row">
                <div className="col-md-6">
                    <div className="conw concw wc fst" style={{ background: '#835ea8' }}>
                        <h1>${avgLoanAmt}</h1>
                        <span>Average Loan Amount</span>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="conw concw wc snd" style={{ background: '#492d7e' }}>
                        <h1>{totalTxn}</h1>
                        <span>Total Transactions</span>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="conw concw wc trd" style={{ background: '#cbbedd' }}>
                        <h3>${totalDebits}</h3>
                        <span>Total Debits</span>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="conw concw wc fth" style={{ background: '#a495c7' }}>
                        <h3>{closedTxn}</h3>
                        <span>Closed Transactions</span>
                    </div>
                </div>
            </div>
            <br />
            <div>
                <canvas id="myChart"></canvas>
            </div>
        </div>
    )
}