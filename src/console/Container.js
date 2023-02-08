import { useState } from "react"

export default function Receipts(props) {

    const [recAmt, setrecAmt] = useState(0)
    const [recBTN, setrecBTN] = useState('Deduct')

    return (
        <div className="col-md-12">
            <div className="row">
                <div className="col-md-6 p-2">
                    <a href={props.endpoint + '/images/' + props.imageFile} target="_blank">
                        <img className="containerIMG" src={props.endpoint + '/images/' + props.imageFile} alt="" />
                    </a>
                </div>
                <div className="col-md-6 p-2">
                    <table>
                        <tr>
                            <td><b>UID:</b></td>
                            <td>{props.uid}</td>
                        </tr>
                        <tr>
                            <td><b>Email:</b></td>
                            <td style={{ wordBreak: 'break-all' }}>{props.emailAddress}</td>
                        </tr>
                        <tr>
                            <td><b>Desc:</b></td>
                            <td>{props.inputtxnAdd}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <b><label>Receipt Amount:</label></b>
            <div className="col-md-12">
                <input style={{ height: 50 + 'px', borderRadius: 10 + 'px', padding: 5 + 'px' }} type="text" placeholder="Receipt Amt" value={recAmt}
                    onChange={(e) => setrecAmt(e.target.value)} />
            </div>
            <div className="row">
                <div className="col-md-6">
                    <button onClick={async () => { setrecBTN('...'); props.updateCredits(setrecAmt, setrecBTN, props.uid, recAmt, props.emailAddress) }} disabled={props.disableBtn} className="w-100 btn btn-primary">{recBTN}</button>
                </div>
                <div className="col-md-6">
                    <button onClick={() => props.setopenContainer(false)} className="w-100 btn btn-primary">Close</button>
                </div>
            </div>
        </div>
    )
}