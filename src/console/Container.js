import { useState } from "react"

export default function Receipts(props) {

    const [recAmt, setrecAmt] = useState(0)
    const [recBTN, setrecBTN] = useState('Deduct')

    return (
        <>
            <table>
                <tr>
                    <td><b>Receipt ID:</b></td>
                    <td>{props.uid}</td>
                </tr>
                <tr>
                    <td><b>User's Email:</b></td>
                    <td>{props.emailAddress}</td>
                </tr>
                <tr>
                    <td><b>TXN Add:</b></td>
                    <td>{props.inputtxnAdd}</td>
                </tr>
            </table>
            <div className="col-md-6">
                <img src={props.endpoint + '/images/' + props.imageFile} />
            </div>
            <br />
            <div>
                <div className="row">
                    <b><label>Receipt Amount:</label></b>
                    <div className="col-md-8">
                        <input style={{ height: 50 + 'px' }} type="text" placeholder="Receipt Amt" value={recAmt}
                            onChange={(e) => setrecAmt(e.target.value)} />
                    </div>
                    <div className="col-md-4 cr" style={{ paddingTop: 5 + 'px' }}>
                        <button onClick={async () => { setrecBTN('...'); props.updateCredits(setrecAmt, setrecBTN, props.uid, recAmt, props.emailAddress) }} disabled={props.disableBtn} className="btn btn-primary">{recBTN}</button>
                        &nbsp;
                        <button onClick={() => props.setopenContainer(false)} className="btn btn-primary">Close</button>
                    </div>
                </div>
            </div>

        </>
    )
}