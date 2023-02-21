export default function Note(props) {

    return (
        <div className="col-md-12">
            <h1>Note</h1>
            <br/>
            <div className="row">
                <p>{props.note}</p>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <button onClick={() => props.setopenContainer(false)} className="w-100 btn btn-primary">Close</button>
                </div>
            </div>
        </div>
    )
}