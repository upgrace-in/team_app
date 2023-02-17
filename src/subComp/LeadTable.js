export default function LeadTable(props) {
    return (
        <tr>
            <th scope="row">{props.uid}</th>
            <td>{props.leadname}</td>
            <td>{props.mail}</td>
            <td>{props.phone}</td>
            <td>{props.leadamt}</td>
            <td>{props.credits}</td>
            <td style={{ fontWeight: "700", color: props.leadstatus === 'Approved' ? 'green' : 'red' }}>{props.leadstatus}</td>
            <td style={{ fontWeight: "700", color: props.transaction === 'OPEN' ? 'green' : 'red' }}>{props.transaction}</td>
        </tr>
    )
}