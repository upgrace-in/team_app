export default function Leads(props) {
    return (
        <tr>
            <th scope="row">{props.uid}</th>
            <td>{props.leadname}</td>
            <td>{props.leadmail}</td>
            <td>{props.phone}</td>
            <td>${props.leadamt}</td>
            <td>${((parseFloat(props.leadamt) * 0.30) / 100).toFixed(2)}</td>
            <td style={{ fontWeight: "700", color: props.leadstatus === 'Approved' ? 'green' : 'red' }}>{props.leadstatus}</td>
            <td style={{ fontWeight: "700", color: props.transaction === 'OPEN' ? 'green' : 'red' }}>{props.transaction}</td>
            {props.is_loanOfficer !== true ?
                <td>
                    <button className="m-1 btn btn-warning" onClick={() => props.deleteLead(props.uid, props.useremailAddress, props.leadmail)}>Delete</button>
                    {
                        props.transaction === 'OPEN' ? <button className="m-1 btn btn-danger" onClick={() => props.closeLead(props.uid, props.useremailAddress)}>Close</button> : ""
                    }
                </td> : ""
            }
        </tr>
    )
}