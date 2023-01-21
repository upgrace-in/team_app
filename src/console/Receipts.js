export default function Receipts(props) {

    return (
        <tr>
            <th scope="row">{props.uid}</th>
            <td>{props.emailAddress}</td>
            <td className='cr hvr' onClick={() => { props.setData(props); props.setopenContainer(true) }}>Click to view</td>
            <td>{props.inputRecAmt}</td>
            <td>{props.inputtxnAdd}</td>
        </tr>
    )
}