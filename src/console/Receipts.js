export default function Receipts(props) {

    return (
        <tr>
            <th scope="row">{props.uid}</th>
            <td>{props.emailAddress}</td>
            <td className='cr hvr' onClick={() => { props.setData(props); props.setopenContainer(true) }}>View</td>
            <td>{props.inputRecAmt}</td>
            <td>{props.inputtxnAdd}</td>
            <td>{props.used == true ? <span style={{ color: 'red' }}>USED</span> : <span style={{ color: 'green' }}>NOT USED</span>}</td>

            {props.used == true ?
                <td className='cr hvr'>
                    <button className="btn btn-warning m-1 text-white" onClick={() => { props.deleteIt(props); }} >Delete</button>
                    <button className="btn btn-warning m-1 text-white" onClick={() => { props.revertIt(props); }} >Revert</button>
                </td>
                :
                <td className='cr hvr'>
                    <button className="btn btn-warning m-1 text-white" onClick={() => { props.deleteIt(props); }} >Delete</button>
                </td>
            }


        </tr>
    )
}