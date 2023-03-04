export default function Leads(props) {
    return (
        <tr>
            <th scope="row">{props.uid}</th>
            <th>{props.useremailAddress}</th>
            <td>{props.leadname}</td>
            <td>{props.leadmail}</td>
            <td>{props.phone}</td>
            <td>{props.leadamt}</td>
            <td>{parseInt((parseFloat(props.leadamt) * process.env.REACT_APP_CALCULATOR) / 100)}</td>
            <td className="cr" onClick={() => { props.showNote(props); props.setopenContainer(true) }}>{props.note !== undefined ? props.note.substring(0, 15) + "..." : "..."}</td>
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