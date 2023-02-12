import { useState, useEffect } from "react"
import $ from 'jquery'
import LeadTable from './subComp/LeadTable'
import './dashboard.css'
import Upload from './subComp/Upload'
import Home from './subComp/Home'
import Logs from './subComp/Logs'
import Account from './subComp/Account'
import Calculator from "./subComp/Calculator"
import parse from 'html-react-parser'


export default function Dashboard(props) {

    const [pending, setPending] = useState(0)

    const [formState, setformState] = useState('Home')

    // EXPORTING
    const [leadDatas, setleadDatas] = useState()

    const [clientReadyMsg, setclientReadyMsg] = useState(-1)

    const [clientReadyStatus, setclientReadyStatus] = useState(-1)

    const [clientActively, setclientActively] = useState(-1)
    const [offerAcceptedStatus, setofferAcceptedStatus] = useState(-1)

    const [disableBtn, setdisableBtn] = useState(true)

    const [leadData, setleadData] = useState('')
    const [Msg, setMsg] = useState('')

    const [loanOfficers, setloanOfficers] = useState([])

    let session;
    let leadInfo = {};

    // Chekcing is the users session is their   
    if (props.session === null) {
        window.location.href = '/user/'
    } else {
        session = props.session
        if(session.is_admin)
            window.location.href = '/console/'
    }
    $('.hide_it').hide()

    async function fetchLeads() {
        fetch(props.endpoint + '/fetchLeads?emailAddress=' + session['emailAddress'], {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(function (val) {
            if (val['msg']) {
                // Fill leads
                let leadData = []
                setPending(0)
                val['data'].map(data => {
                    let credits = ((parseFloat(data.loanAmt) * process.env.REACT_APP_CALCULATOR) / 100).toFixed(2)
                    if (data.transaction === 'OPEN')
                        setPending(pending => (parseFloat(pending) + parseFloat(credits)).toFixed(2))
                    leadData.push(<LeadTable key={data['uid']} uid={data['uid']} credits={credits} transaction={data['transaction']} leadname={data['fname']} mail={data['inputEmail']} phone={data['inputPhone']} leadamt={data['loanAmt']} leadstatus={data['offerAcceptedStatus'] === false ? "Not Yet" : "Approved"} />);
                });
                setleadDatas(val['data'])
                setleadData(leadData)
            } else {
                // No Leads
                setleadDatas(undefined)
                setleadData('')
            }
        });
    }

    const fetchLoanOfficers = async () => {
        fetch(props.endpoint + '/fetchLoanOfficers', {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(function (val) {
            if (val['msg']) {
                setloanOfficers([val['data']])
            }
        });
    }

    useEffect(() => {
        props.calculator($('.loanAmount2'), $('.credits'))
        fetchLeads()

        // Fetching all loan Officers
        fetchLoanOfficers()

        // setformData({ ...formData, fname: 'Hari' })
        setTimeout(() => {
            props.checkUserExists(props.session)
        }, 1000)
    }, [''])

    function submitIt(leadInfo) {
        fetch(props.endpoint + '/addLead', {
            method: 'POST',
            body: JSON.stringify(leadInfo),
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(function (val) {
            if (val['msg']) {
                setMsg("Awesome! You are all set. See you at closing!")
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            } else {
                setMsg("Something went wrong...")
            }
        });
    }

    function isNumeric(value) {
        if (value !== '')
            return /^-?\d+$/.test(value);
        else
            return false
    }

    function isString(value) {
        if (value !== '')
            return $.type(value) === "string";
        else
            return false
    }

    const submitLeadData = (e) => {

        e.preventDefault()
        setdisableBtn(true)
        setMsg('Processing...')

        let fname = $('#inputfirstName').val()
        let lname = $('#inputlastName').val()
        let loanAmt = $('#inputloanAmt').val()
        let credits = $('#inputCredits').text()
        let inputEmail = $('#inputEmail').val()
        let inputPhone = $('#inputPhone').val()

        let inputAddress = $('#inputAddress').val()
        let selectedloanOfficer = $('#selectedloanOfficer').val()
        let inputclosingdate = $('#inputclosingdate').val()

        let inputNotes = $('#inputNotes').val()


        try {
            if ((isString(fname)) &&
                (isString(lname)) &&
                (isNumeric(loanAmt)) &&
                (inputEmail !== '') &&
                (inputEmail.includes('@')) &&
                (isNumeric(inputPhone)) &&
                (clientActively !== -1) &&
                (clientReadyStatus !== -1) &&
                (offerAcceptedStatus !== -1)) {

                leadInfo.fname = fname
                leadInfo.lname = lname
                leadInfo.loanAmt = loanAmt
                leadInfo.credits = credits.split('$')[1]
                leadInfo.inputEmail = inputEmail
                leadInfo.inputPhone = inputPhone
                leadInfo.emailAddress = session['emailAddress']
                leadInfo.password = session['password']
                leadInfo.name = session['name']
                leadInfo.phoneNumber = session['phoneNumber']
                leadInfo.createdon = new Date()

                // Checking client ready status 
                let dateTime = $('#dateTime').val()
                if ((dateTime !== '') || (clientReadyStatus === 2)) {
                    if (clientReadyStatus === 1) {
                        leadInfo.clientReady = dateTime;
                    } else if (clientReadyStatus === 0) {
                        leadInfo.talkFirst = dateTime;
                    } else if (clientReadyStatus === 2) {
                        leadInfo.connectwithLender = true
                    }
                } else {
                    throw "Invalid dateTime";
                }

                // Checking client actively yes or no
                if (clientActively === 1) {
                    leadInfo.clientActivelyLooking = true
                } else if (clientActively === 2) {
                    leadInfo.clientActivelyLooking = false
                } else if (clientActively === 0) {
                    leadInfo.clientActivelyLooking = 'escrow'

                } else {
                    throw "Input all fields !!!";
                }

                // Checking client accepted yes or no + fields
                if (offerAcceptedStatus === 1) {
                    if ((inputAddress !== '') &&
                        (selectedloanOfficer !== 0) &&
                        (inputclosingdate !== '') &&
                        (inputNotes !== '')) {
                        leadInfo.offerAcceptedStatus = {
                            "selectedloanOfficer": selectedloanOfficer,
                            "inputAddress": inputAddress,
                            "inputNotes": inputNotes,
                            "inputclosingdate": inputclosingdate
                        }
                    } else {
                        throw "Invalid Address !!!";
                    }
                } else if (offerAcceptedStatus === 0) {
                    leadInfo.offerAcceptedStatus = false
                } else {
                    throw "Input all fields !!!";
                }

                leadInfo.uid = Math.random().toString(36).slice(2)

                submitIt(leadInfo)

            } else {
                throw "Input all fields !!!";
            }
        } catch (e) {
            console.log(e)
            // setMsg("Please enter valid data!!!")
            setMsg(e)
            setdisableBtn(false)
        }
    }

    return (
        <>

            <div className="sideCon">
                <button className="thm-btn sp">Welcome: <span className="username"></span></button>
                <button className="thm-btn sp"><a href="#" style={{ color: 'white' }}>Credits: $<span className="credits_div">0</span></a></button>
                <button style={{ background: 'grey' }} className="thm-btn sp"><a href="#" style={{ color: 'white' }}>Pending: $<span className="pending_credits_div">{pending}</span></a></button>
            </div>

            <main style={{ overflow: 'auto' }}>
                <div className="flex-shrink-0 p-3 bg-white" style={{ "width": 15 + "%", height: 200 + 'vh' }}>
                    <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom"
                        style={{

                            padding: '0px'
                        }}>

                        <img className="mx-auto text-center" src="/static/logoBlack.png" />

                    </a>
                    <ul className="list-unstyled ps-0">
                        <li className="mb-1">
                            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                data-bs-target="#home-collapse" aria-expanded="true">
                                Main
                            </button>
                            <div className="collapse show" id="home-collapse">
                                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                    <li><a onClick={() => setformState('Home')} className="cur link-dark rounded">Home</a></li>
                                    {/* <li><a onClick={() => setformState('Logs')} className="cur link-dark rounded">Activity</a></li> */}
                                    <li><a onClick={() => setformState('Leads')} className="cur link-dark rounded">Your Leads</a></li>
                                    <li><a onClick={() => setformState('LeadForm')} className="cur link-dark rounded">Add Lead</a></li>
                                    <li><a onClick={() => setformState('Account')} className="cur link-dark rounded">Account</a></li>
                                    <li><a onClick={() => setformState('Calculator')} className="cur link-dark rounded">Calculator</a></li>
                                </ul>
                            </div>
                        </li>
                        <li className="mb-1">
                            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                data-bs-target="#dashboard-collapse" aria-expanded="true">
                                Reciepts
                            </button>
                            <div className="collapse show" id="dashboard-collapse">
                                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                    <li><a onClick={() => setformState('Upload')} className="cur link-dark rounded">Upload</a></li>
                                </ul>
                            </div>
                        </li>
                        <li className="mb-1">
                            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                data-bs-target="#orders-collapse" aria-expanded="false">
                                Support
                            </button>
                            <div className="collapse show" id="orders-collapse">
                                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                    <li><a href="/logout" className="link-dark rounded">Logout</a></li>
                                    <li><a href="#" className="link-dark rounded">Contact Us</a></li>
                                    <li><a href="#" className="link-dark rounded">FAQ</a></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="sideTop" style={{ "width": 100 + "%" }}>


                    <div className={formState === 'LeadForm' ? "show padTop" : "hide"} >
                        <div className="popup col-md-12">
                            <section className='popDiv col-md-12 elementor-section elementor-top-section elementor-element elementor-element-9c276d4 elementor-section-full_width elementor-section-height-default elementor-section-height-default'
                                data-id="9c276d4" data-element_type="section" style={{ marginTop: 0 + 'px' }}>
                                <div className="elementor-container elementor-column-gap-no">
                                    <div
                                        className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-a3457b0"
                                        data-id="a3457b0" data-element_type="column">
                                        <div className="elementor-widget-wrap elementor-element-populated">
                                            <div
                                                className="elementor-element elementor-element-9aa5474 elementor-widget elementor-widget-qutiiz-contact-form"
                                                data-id="9aa5474" data-element_type="widget" data-widget_type="qutiiz-contact-form.default">
                                                <div className="elementor-widget-container">

                                                    <section className='contact-page contact-page-two cpa'>
                                                        <div className="col-md-10">
                                                            <div className="row">
                                                                <div className="col-xl-12">
                                                                    <div className="contact-page__form">
                                                                        <div role="form" className="wpcf7" id="wpcf7-f169-p592-o1" lang="en-US" dir="ltr">
                                                                            <div className="mx-auto text-left">
                                                                                <h1>Lead Info</h1>
                                                                                <br />
                                                                            </div>
                                                                            <form className="wpcf7-form init">
                                                                                <div className="comment-one__form ">
                                                                                    <div className='row'>
                                                                                        <div className="col-xl-6">
                                                                                            <div className="comment-form__input-box">
                                                                                                <span className="wpcf7-form-control-wrap"
                                                                                                    data-name="your-name">
                                                                                                    <input id="inputfirstName" type="text" size="40"
                                                                                                        className="wpcf7-form-control wpcf7-text"
                                                                                                        aria-required="true" aria-invalid="false" placeholder="First Name" /></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-xl-6">
                                                                                            <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                                data-name="your-name"><input id="inputlastName" type="text" size="40"
                                                                                                    className="wpcf7-form-control wpcf7-text"
                                                                                                    aria-required="true" aria-invalid="false" placeholder="Last Name" /></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='row'>
                                                                                        <div className="col-xl-6">
                                                                                            <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                                data-name="your-phone"><input id="inputloanAmt" type="number" size="40"
                                                                                                    className="loanAmount2 wpcf7-form-control" aria-invalid="false"
                                                                                                    placeholder="Loan Amount" /></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-xl-6">
                                                                                            <div className="comment-form__input-box creditText">
                                                                                                Credits: <b id="inputCredits" className="credits">$0</b>
                                                                                                <h6>Estimated Credits Upon Closing</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-xl-6">
                                                                                            <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                                data-name="your-email"><input id="inputEmail" type="email"
                                                                                                    size="40"
                                                                                                    className="wpcf7-form-control wpcf7-text"
                                                                                                    aria-required="true" aria-invalid="false"

                                                                                                    placeholder="Email" /></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-xl-6">
                                                                                            <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                                data-name="your-email"><input id="inputPhone" type="number"
                                                                                                    size="40"
                                                                                                    className="wpcf7-form-control wpcf7-text"
                                                                                                    aria-required="true" aria-invalid="false"

                                                                                                    placeholder="Phone" /></span>
                                                                                            </div>
                                                                                        </div>

                                                                                    </div>
                                                                                    <div className="row pd-left">
                                                                                        <div className="col-xl-4">
                                                                                            <div className="comment-form__input-box">
                                                                                                <span className="wpcf7-form-control-wrap">
                                                                                                    <div onClick={() => { setclientReadyStatus(2); setclientReadyMsg(-1); }} className="custom-control custom-radio custom-control-inline">
                                                                                                        <input type="radio" id="clientReadyStatus" name="clientReadyStatus" className="input2 custom-control-input" />
                                                                                                        <label className="custom-control-label" htmlFor="clientReadyStatus">Connected with Lender</label>
                                                                                                    </div>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-xl-4">
                                                                                            <div className="comment-form__input-box">
                                                                                                <span className="wpcf7-form-control-wrap">
                                                                                                    <div onClick={() => { setclientReadyStatus(1); setclientReadyMsg(1) }} className="custom-control custom-radio custom-control-inline">
                                                                                                        <input type="radio" id="clientReadyStatus" name="clientReadyStatus" className="input2 custom-control-input" />
                                                                                                        <label className="custom-control-label" htmlFor="clientReadyStatus">My Client is Ready for a Call</label>
                                                                                                    </div>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-xl-4">
                                                                                            <div className="comment-form__input-box">
                                                                                                <span className="wpcf7-form-control-wrap">
                                                                                                    <div onClick={() => { setclientReadyStatus(0); setclientReadyMsg(0) }} className="custom-control custom-radio custom-control-inline">
                                                                                                        <input type="radio" id="clientReadyStatus2" name="clientReadyStatus" className="input2 custom-control-input" />
                                                                                                        <label className="custom-control-label" htmlFor="clientReadyStatus2">Let's Talk First</label>
                                                                                                    </div>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className={clientReadyMsg !== -1 ? "show col-xl-12" : "hide"} style={{ background: '#fff', borderRadius: '10px' }}>
                                                                                            <div className="comment-form__input-box col-xl-12 mx-auto text-center" style={{ padding: 20 + 'px' }}>
                                                                                                <p>{clientReadyMsg === 1 ? parse("Awesome! Please confirm your client is expecting our call.<br/>Please give us the best day and time to contact your client") : parse("We won't contact your client until you give us the green light.<br/>What's the best time to connect with you?")}</p>
                                                                                                <div className="col-xl-4 mx-auto text-center">
                                                                                                    <span className="wpcf7-form-control-wrap"
                                                                                                        data-name="your-email">
                                                                                                        <input id="dateTime" type="datetime-local" size="40" className="wpcf7-form-control wpcf7-text" />
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <hr style={{background: 'grey'}}/>
                                                                                    <div className="row pd-left">
                                                                                        <label>Is your client actively looking?</label>
                                                                                        <div className="col-xl-4">
                                                                                            <div className="comment-form__input-box">
                                                                                                <span className="wpcf7-form-control-wrap">
                                                                                                    <div onClick={() => setclientActively(0)} className="custom-control custom-radio custom-control-inline">
                                                                                                        <input type="radio" id="customRadioInline3" name="customRadioInline3" className="input2 custom-control-input" />
                                                                                                        <label className="custom-control-label" htmlFor="customRadioInline3">In escrow</label>
                                                                                                    </div>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-xl-4">
                                                                                            <div className="comment-form__input-box">
                                                                                                <span className="wpcf7-form-control-wrap">
                                                                                                    <div onClick={() => setclientActively(1)} className="custom-control custom-radio custom-control-inline">
                                                                                                        <input type="radio" id="customRadioInline3" name="customRadioInline3" className="input2 custom-control-input" />
                                                                                                        <label className="custom-control-label" htmlFor="customRadioInline3">Yes</label>
                                                                                                    </div>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-xl-4">
                                                                                            <div className="comment-form__input-box">
                                                                                                <span className="wpcf7-form-control-wrap">
                                                                                                    <div onClick={() => setclientActively(2)} className="custom-control custom-radio custom-control-inline">
                                                                                                        <input type="radio" id="customRadioInline4" name="customRadioInline3" className="input2 custom-control-input" />
                                                                                                        <label className="custom-control-label" htmlFor="customRadioInline4">No</label>
                                                                                                    </div>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <hr style={{background: 'grey'}}/>
                                                                                    <div className="row pd-left">
                                                                                        <label>Has offer been Accepted?</label>
                                                                                        <div className="col-xl-4">
                                                                                            <div className="comment-form__input-box">
                                                                                                <span className="wpcf7-form-control-wrap">
                                                                                                    <div onClick={() => setofferAcceptedStatus(1)} className="custom-control custom-radio custom-control-inline">
                                                                                                        <input type="radio" id="customRadioInline5" name="customRadioInline5" className="input2 custom-control-input" />
                                                                                                        <label className="custom-control-label" htmlFor="customRadioInline5">Yes</label>
                                                                                                    </div>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-xl-4">
                                                                                            <div className="comment-form__input-box">
                                                                                                <span className="wpcf7-form-control-wrap">
                                                                                                    <div onClick={() => setofferAcceptedStatus(0)} className="custom-control custom-radio custom-control-inline">
                                                                                                        <input type="radio" id="customRadioInline6" name="customRadioInline5" className="input2 custom-control-input" />
                                                                                                        <label className="custom-control-label" htmlFor="customRadioInline6">No</label>
                                                                                                    </div>
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className={offerAcceptedStatus === 1 ? "show shownCon col-xl-12" : "hide shownCon col-xl-12"}>
                                                                                            <label>Great Job!!!</label>
                                                                                            <div className="col-xl-12">
                                                                                                <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                                    data-name="your-name"><input id="inputAddress" type="text" size="40"
                                                                                                        className="wpcf7-form-control wpcf7-text"
                                                                                                        aria-required="true" aria-invalid="false" placeholder="Address" /></span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-xl-12">
                                                                                                <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                                    data-name="your-name">
                                                                                                    <select className="form-select" id="selectedloanOfficer">
                                                                                                        <option value="0" defaultValue>Choose Loan Officer</option>
                                                                                                        {
                                                                                                            // console.log(loanOfficers)
                                                                                                            loanOfficers.length !== 0 ?
                                                                                                                loanOfficers[0].map((data, i) => {
                                                                                                                    return <option key={i} value={data.emailAddress}>{data.name}</option>
                                                                                                                })
                                                                                                                : () => { return null }
                                                                                                        }
                                                                                                    </select>
                                                                                                </span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-xl-12">
                                                                                                <div className="comment-form__input-box">
                                                                                                    <span className="wpcf7-form-control-wrap"
                                                                                                        data-name="your-email">
                                                                                                        <textarea id="inputNotes" type="text"
                                                                                                            rows="2"
                                                                                                            className="wpcf7-form-control wpcf7-text"
                                                                                                            aria-required="true" aria-invalid="false"
                                                                                                            placeholder="Notes" ></textarea>
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-xl-4">
                                                                                                <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                                    data-name="your-name">
                                                                                                    <label>Expected Closing:</label>
                                                                                                    <input id="inputclosingdate" type="datetime-local" size="40"
                                                                                                        className="wpcf7-form-control wpcf7-text" placeholder="Expected Closing Date" /></span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className={offerAcceptedStatus === 0 ? "show shownCon col-xl-12" : "hide shownCon col-xl-12"}>
                                                                                            <div className="offerNotAccepted mx-auto text-center col-md-8">
                                                                                                <p style={{ padding: 5 + 'px' }}>No problem. You can wait to get your offer accepted or add a credit card so not to delay your marketing campaign. After your transaction closed we will reimburse your account.</p>
                                                                                                <button onClick={submitLeadData} type="submit" className="tb thm-btn">Add Credit Card</button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <hr style={{background: 'grey'}}/>
                                                                                    <div className="col-xl-12 pd-left">
                                                                                        <div className="comment-form__input-box">
                                                                                            <span className="wpcf7-form-control-wrap">
                                                                                                <div className="custom-control custom-radio custom-control-inline">
                                                                                                    <input onClick={() => { setdisableBtn(!disableBtn); console.log(disableBtn) }} type="checkbox" id="accept" name="accept" className="input2 custom-control-input" />
                                                                                                    <label className="custom-control-label">I accept to lead generation <a target="_blank" style={{ color: 'blue' }} href="https://docs.google.com/document/d/1rwrycIQmI2_m5CXppq6IVmafzJtIF3Wo/">terms & conditions</a></label>
                                                                                                </div>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="wpcf7-response-output" style={{ display: 'block', color: 'red' }}>
                                                                                        {Msg}
                                                                                    </div>
                                                                                    <div className="row mx-auto text-left" style={{ marginBottom: 20 + 'px' }}>
                                                                                        <div className="col-md-12">
                                                                                            <button onClick={submitLeadData} type="submit" disabled={disableBtn === true ? true : false} className="tb thm-btn">Add Lead</button>
                                                                                        </div>
                                                                                        {/* <div className="col-md-6">
                                                                                        <button type="button" onClick={() => setformState(0)} className="tb thm-btn">Go Back</button>
                                                                                    </div> */}
                                                                                    </div>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    <div className="padTop">
                        {/* Leads Table */}
                        <div id="leadTableCon" className={formState == 'Leads' ? 'show mx-auto col-md-12' : 'hide'}>
                            <h1>Your Leads</h1>
                            <br />
                            <table className="table table-stripe">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Lead Name</th>
                                        <th scope="col">Lead Email</th>
                                        <th scope="col">Lead Phone</th>
                                        <th scope="col">Loan Amount</th>
                                        <th scope="col">Credits</th>
                                        <th scope="col">Offer Accepted</th>
                                        <th scope="col">Transaction</th>
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
                                        </tr>}
                                </tbody>
                            </table>
                        </div>

                        <Upload endpoint={props.endpoint} emailAddress={session['emailAddress']} password={session['password']} credits={session['credits']} leadNames={leadDatas} formState={formState} />

                        <Home endpoint={props.endpoint} leadDatas={leadDatas} formState={formState} emailAddress={session['emailAddress']} />

                        <Account session={props.session} endpoint={props.endpoint} formState={formState} />

                        {/* <Logs formState={formState} endpoint={props.endpoint} session={props.session} /> */}

                        <Calculator formState={formState} calculator={props.calculator} />
                    </div>

                </div>
            </main>

        </>
    )
}
