import { useState, useEffect } from "react"
import $ from 'jquery'
import Container from './Container'
import '../dashboard.css'
import Receipts from "./Receipts"
import Leads from "./Leads"
import Search from "./Search"
import Account from "../subComp/Account"
import AddUsers from "./AddUsers"
import Note from './Note'

export default function Dashboard(props) {

    const [note, setNote] = useState()

    const [formState, setformState] = useState('Leads')

    const [leads, setLeads] = useState()
    const [receipts, setReceipts] = useState()

    const [disableBtn, setdisableBtn] = useState(false)

    const [receiptData, setreceiptData] = useState([])
    const [openContainer, setopenContainer] = useState(false)

    const [leadData, setleadData] = useState('')
    const [receiptsData, setreceiptsData] = useState('')

    let session, is_loanOfficer;

    // Chekcing is the users session is their   
    if (props.session === null) {
        window.location.href = '/user/'
    } else {
        session = props.session
        if (session.is_loanOfficer !== undefined)
            is_loanOfficer = true
        else if (session.is_admin === true)
            is_loanOfficer = false
        else
            window.location.href = '/user/'
    }
    $('.hide_it').hide()

    async function fetchLeads() {
        fetch(props.endpoint + '/fetchAllLeads', {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(function (val) {
            if (val['msg']) {
                // Fill leads
                let leadData = []
                setLeads(val['data'])
                console.log(val.data);
                val['data'].map(data => {
                    leadData.push(<Leads
                        setopenContainer={setopenContainer}
                        showNote={showNote}
                        is_loanOfficer={is_loanOfficer}
                        useremailAddress={data.emailAddress}
                        deleteLead={deleteLead}
                        closeLead={closeLead}
                        key={data['uid']}
                        uid={data['uid']}
                        transaction={data['transaction']}
                        leadname={data['fname']}
                        leadmail={data['inputEmail']}
                        phone={data['inputPhone']}
                        leadamt={data['loanAmt']}
                        note={data['offerAcceptedStatus']['inputNotes']}
                        leadstatus={data['offerAcceptedStatus'] === false ? "Not Yet" : "Approved"} />);
                });
                setleadData(leadData)
            } else {
                // No Leads
                setleadData('')
            }
        });
    }

    async function fetchLoanLeads(loanOfficer) {
        fetch(props.endpoint + '/fetchLoanLeads?loanOfficer=' + loanOfficer, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(function (val) {
            if (val['msg']) {
                // Fill leads
                let leadData = []
                setLeads(val['data'])
                val['data'].map(data => {
                    console.log(data)
                    leadData.push(<Leads
                        setopenContainer={setopenContainer}
                        showNote={showNote}
                        is_loanOfficer={is_loanOfficer}
                        useremailAddress={data.emailAddress}
                        key={data['uid']}
                        uid={data['uid']}
                        transaction={data['transaction']}
                        leadname={data['fname']}
                        leadmail={data['inputEmail']}
                        note={data['offerAcceptedStatus']['inputNotes']}
                        phone={data['inputPhone']}
                        leadamt={data['loanAmt']}
                        leadstatus={data['offerAcceptedStatus'] === false ? "Not Yet" : "Approved"} />);
                });
                setleadData(leadData)
            } else {
                // No Leads
                setleadData('')
            }
        });
    }

    async function closeLead(uid, emailAddress) {
        let response = window.confirm("Are you sure you want to close the lead?");
        if (response)
            fetch(props.endpoint + '/closeLead', {
                method: 'POST',
                body: JSON.stringify({ uid, emailAddress }),
                headers: { "Content-Type": "application/json" }
            }).then(function (response) {
                return response.json()
            }).then(function (val) {
                if (val['msg']) {
                    alert("Lead Closed !!!")
                    fetchLeads()
                } else {
                    alert(val.response)
                }
            });
    }

    async function updateCredits(setrecAmt, setBTN, uid, inputRecAmt, emailAddress) {

        setdisableBtn(true)

        fetch(props.endpoint + '/updateCredits', {
            method: 'POST',
            body: JSON.stringify({ uid, inputRecAmt, emailAddress }),
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(async function (val) {
            if (val['msg']) {
                alert("Credit Deducted !!!")
                await fetchReceipts()
            } else {
                alert(val.response)
            }
            setdisableBtn(false)
            setBTN("Deduct")
            setrecAmt(0)
        });

    };

    function setData(props) {
        // View container
        setreceiptData(<Container disableBtn={disableBtn} setopenContainer={setopenContainer} updateCredits={updateCredits} endpoint={props.endpoint} uid={props.uid} emailAddress={props.emailAddress} imageFile={props.imageFile} inputRecAmt={props.inputRecAmt} inputtxnAdd={props.inputtxnAdd} />)
    }

    function showNote(props) {
        // View notes
        setNote(<Note note={props.note} setopenContainer={setopenContainer} />)
    }

    async function deleteLead(uid, emailAddress, leadMailAddress) {
        let response = window.confirm("Are you sure you want to do delete the lead?");
        if (response)
            fetch(props.endpoint + '/deleteLead', {
                method: 'POST',
                body: JSON.stringify({ uid, emailAddress, leadMailAddress }),
                headers: { "Content-Type": "application/json" }
            }).then(function (response) {
                return response.json()
            }).then(function (val) {
                console.log(val);
                if (val['msg']) {
                    alert("Lead Deleted !!!")
                    fetchLeads()
                } else {
                    alert("Something went wrong !!!")
                }
            });
    }

    async function deleteIt(prs) {
        let response = window.confirm("Are you sure you want to delete the receipt?");
        if (response)
            fetch(props.endpoint + '/deleteReceipt', {
                method: 'POST',
                body: JSON.stringify({ uid: prs.uid }),
                headers: { "Content-Type": "application/json" }
            }).then(function (response) {
                return response.json()
            }).then(async (val) => {
                if (val['msg']) {
                    // Fill leads
                    alert("Deleted !!!")
                    await fetchReceipts()
                } else {
                    alert("Unable to delete !!!")
                }
            });
    }

    async function revertIt(prs) {
        let response = window.confirm("Are you sure you want to revert the deduction?");
        if (response)
            fetch(props.endpoint + '/revertReceipt', {
                method: 'POST',
                body: JSON.stringify({ uid: prs.uid, emailAddress: prs.emailAddress }),
                headers: { "Content-Type": "application/json" }
            }).then(function (response) {
                return response.json()
            }).then(async (val) => {
                if (val['msg']) {
                    // Fill leads
                    alert("Amount reverted !!!")
                    await fetchReceipts()
                } else {
                    alert("Unable to delete !!!")
                }
            });
    }

    async function fetchReceipts() {
        fetch(props.endpoint + '/fetchAllReceipts', {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(function (val) {
            if (val['msg']) {
                // Fill leads
                let receiptsData = []
                setReceipts(val['data'])
                val['data'].map(data => {
                    receiptsData.push(<Receipts deleteIt={deleteIt} revertIt={revertIt} setopenContainer={setopenContainer} setData={setData} endpoint={props.endpoint} key={data['uid']} uid={data['uid']} used={data.used} emailAddress={data['emailAddress']} imageFile={data['imageFile']} inputRecAmt={data['inputRecAmt']} inputtxnAdd={data.inputtxnAdd} />);
                });
                setreceiptsData(receiptsData)
            } else {
                // No Leads
                setreceiptsData('')
            }
        });
    }

    useEffect(() => {

        if (!is_loanOfficer) {
            fetchLeads()
            fetchReceipts()
        } else {
            fetchLoanLeads(props.session.emailAddress)
            // fetchLoanLeads("glozano@sl-lending.com")
        }
        setTimeout(() => {
            props.checkUserExists(props.session)
        }, 1000)
    }, [''])


    return (
        <>

            <div className="sideCon">
                <button className="thm-btn sp">Welcome: <span className="username"></span></button>
            </div>

            <div className={openContainer ? "show" : "hide"} id="overlay"></div>
            <div className={openContainer ? "show positionAbs col-md-6" : "hide"}>
                {receiptData}
            </div>
            <div className={openContainer ? "show positionAbs col-md-6" : "hide"}>
                {note}
            </div>

            <main>
                <div className="flex-shrink-0 p-3 bg-white" style={{ "width": 15 + "%" }}>
                    <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom"
                        style={{
                            background: '#000',
                            padding: '10px'
                        }}>

                        <img className="mx-auto text-center" src="/static/logoWhite.png" />

                    </a>
                    <ul className="list-unstyled ps-0">
                        <li className="mb-1">
                            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                data-bs-target="#home-collapse" aria-expanded="true">
                                Admin Main
                            </button>
                            <div className="collapse show" id="home-collapse">
                                <ol className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                    <li><a onClick={() => setformState('Leads')} className="cur link-dark rounded">Leads</a></li>
                                    {is_loanOfficer !== true ?
                                        <li><a onClick={() => setformState('Receipts')} className="cur link-dark rounded">Receipts</a></li>
                                        : ""}
                                    {is_loanOfficer !== true ?
                                        <li><a onClick={() => setformState('AddUsers')} className="cur link-dark rounded">Add Users</a></li>
                                        : ""}
                                    <li><a onClick={() => setformState('Account')} className="cur link-dark rounded">Account</a></li>
                                </ol>
                            </div>
                        </li>
                        <li className="mb-1">
                            <button className="btn btn-toggle list-unstyled align-items-center rounded collapsed" data-bs-toggle="collapse"
                                data-bs-target="#orders-collapse" aria-expanded="false">
                                Support
                            </button>
                            <div className="collapse show" id="orders-collapse">
                                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                    <li><a href="/logout" className="link-dark rounded">Logout</a></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="sideTop" style={{ "width": 100 + "%" }}>

                    <div className="padTop">
                        {/* Leads Table */}
                        <div id="leadTableCon" className={formState == 'Leads' ? 'show mx-auto col-md-12' : 'hide'}>
                            <h1>Leads</h1>
                            <br />
                            <Search deleteLead={deleteLead} leadData={leadData} setleadData={setleadData} is_loanOfficer={is_loanOfficer} leads={leads} searchleads={true} />
                            <br />
                            <table className="table table-stripe">
                                <thead>
                                    <tr>
                                        <th scope="col">UID</th>
                                        <th scope="col">User</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Credits</th>
                                        <th scope="col">Note</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Transaction</th>
                                        {is_loanOfficer !== true ? <th scope="col">Action</th> : ""}
                                    </tr>
                                </thead>
                                <tbody id="leadData">
                                    {leadData !== '' ? leadData :
                                        <tr>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                        </tr>}
                                </tbody>
                            </table>
                        </div>

                        <div id="leadTableCon" className={formState == 'Receipts' ? 'show mx-auto col-md-12' : 'hide'}>
                            <h1>Receipts</h1>
                            <br />
                            <Search setreceiptsData={setreceiptsData} receiptsData={receiptsData} setopenContainer={setopenContainer} endpoint={props.endpoint} setData={setData} deleteLead={deleteLead} setleadData={setleadData} is_loanOfficer={is_loanOfficer} leads={null} receipts={receipts} searchleads={false} />
                            <br />
                            <table className="table table-stripe">
                                <thead>
                                    <tr>
                                        <th scope="col">UID</th>
                                        <th scope="col">User's Email</th>
                                        <th scope="col">Receipt</th>
                                        <th scope="col">Receipt Amount</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody id="leadData">
                                    {receiptsData !== '' ? receiptsData :
                                        <tr>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                            <th scope="col">...</th>
                                        </tr>}
                                </tbody>
                            </table>
                        </div>

                        <div id="leadTableCon" className={formState == 'AddUsers' ? 'show mx-auto col-md-12' : 'hide'}>
                            <h1>Add Users</h1>
                            <AddUsers endpoint={props.endpoint} />
                        </div>

                        <Account session={props.session} endpoint={props.endpoint} formState={formState} />

                    </div>

                </div>
            </main>

        </>
    )
}
