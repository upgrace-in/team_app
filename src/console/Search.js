import { useState } from "react";
import Receipts from "./Receipts";
import Leads from "./Leads";

export default function Search(props) {

    const [searchBar, searchHandler] = useState('')

    const leads = props.leads
    const receipts = props.receipts

    function putLeadData(leads) {
        let filteredLeads = []
        leads.map(data => {
            filteredLeads.push(<Leads
                is_loanOfficer={props.is_loanOfficer}
                useremailAddress={data.emailAddress}
                deleteLead={props.deleteLead}
                key={data['uid']}
                uid={data['uid']}
                transaction={data['transaction']}
                leadname={data['fname']}
                leadmail={data['inputEmail']}
                phone={data['inputPhone']}
                leadamt={data['loanAmt']}
                leadstatus={data['offerAcceptedStatus'] === false ? "Not Yet" : "Approved"} />
            )
        });
        props.setleadData(filteredLeads)
    }

    function filterLeads(val) {
        // Search system
        // UID
        if (val.length === 11) {
            for (var i = 0; i < leads.length; i++)
                if (leads[i].uid === val)
                    return putLeadData([leads[i]])
        } else {
            // User Email Address
            let userEmailLeads = []
            for (var i = 0; i < leads.length; i++)
                if (leads[i].emailAddress === val)
                    userEmailLeads.push(leads[i])
            putLeadData(userEmailLeads)

            if (userEmailLeads.length === 0) {
                // Loan Officer
                let loanEmailLeads = []
                for (var i = 0; i < leads.length; i++)
                    if (leads[i].offerAcceptedStatus !== false)
                        if (leads[i].offerAcceptedStatus.selectedloanOfficer === val)
                            loanEmailLeads.push(leads[i])
                console.log(loanEmailLeads);
                putLeadData(loanEmailLeads)
            }
        }

    }

    function putReceiptData(receipts) {
        let filteredReceipts = []
        receipts.map(data => {
            filteredReceipts.push(<Receipts
                setopenContainer={props.setopenContainer}
                setData={props.setData}
                endpoint={props.endpoint}
                key={data['uid']}
                uid={data['uid']}
                leadUID={data['leadUID']}
                emailAddress={data['emailAddress']}
                imageFile={data['imageFile']}
                inputRecAmt={data['inputRecAmt']}
                inputtxnAdd={data.inputtxnAdd} />
            )
        });
        props.setreceiptsData(filteredReceipts)
    }

    function filterReceipts(val) {
        // Search system
        // UID
        let filteredReceipts = []
        if (val.length === 11) {
            // UID & Lead ID filteration
            for (var i = 0; i < receipts.length; i++)
                if ((receipts[i].uid === val) || (receipts[i].leadUID === val))
                    filteredReceipts.push(receipts[i])
        } else {
            // User Email Address
            for (var i = 0; i < receipts.length; i++)
                if (receipts[i].emailAddress === val)
                    filteredReceipts.push(receipts[i])
        }
        putReceiptData(filteredReceipts)

    }

    return (
        <div className='row'>
            <div className="col-xl-4">
                <div className="comment-form__input-box">
                    <span className="wpcf7-form-control-wrap"
                        data-name="your-name">
                        <input onChange={(e) => searchHandler(e.target.value)} id="searchBar" type="search" size="40"
                            className="wpcf7-form-control wpcf7-text"
                            aria-required="true" aria-invalid="false" placeholder={props.searchleads === true ? "Search with UID / Loan Officer Email / Users Email" : "Search with UID / Lead ID / Users Email"} /></span>
                </div>
            </div>
            <div className="col-xl-4">
                <div className="comment-form__input-box" style={{ marginTop: 15 + 'px' }}>
                    <span className="wpcf7-form-control-wrap">
                        <button className="btn btn-light" onClick={() => searchBar !== '' ? props.searchleads === true ? filterLeads(searchBar) : filterReceipts(searchBar) : alert("Please enter valid data !!!")}>
                            <i className="fas fa-search" ></i>
                        </button>
                    </span>
                </div>
            </div>
        </div>
    )
}