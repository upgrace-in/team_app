import { useEffect, useState } from "react"
import Register from './Register'

export default function Account(props) {

    const [Msg, setMsg] = useState('')
    const [formSwitch, setformSwitch] = useState(0)

    function loginUser(session) {
        localStorage.setItem("session", JSON.stringify(session['userdata']))
        window.location.href = '/dashboard'
    }

    useEffect(() => {
    }, [])

    return (
        <div className={props.formState === 'Account' ? 'show' : 'hide'}>
            <div className={formSwitch === 0 ? 'show' : 'hide'}>
                <h1>My Account</h1>
                <br />
                <div className="row">
                    <div className="col-md-4">
                        <div onClick={() => setformSwitch(-1)} className="accCON">
                            <div className="row">
                                <div className="conw col-md-3">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="conw col-md-9">
                                    <h3>Contact Info</h3>
                                    <p>Edit your name or change your password</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="accCON blocked">
                            <div className="row">
                                <div className="conw col-md-3">
                                    <i className="fas fa-house-user"></i>
                                </div>
                                <div className="conw col-md-9">
                                    <h3>Billing Address</h3>
                                    <p>Setup your billing address</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={formSwitch === -1 ? "show col-md-8" : "hide"}>
                <h1>Update Information</h1>
                <br />
                <div style={{ padding: 5 + 'px' }}>
                    <Register session={props.session} endpoint={props.endpoint} Msg={Msg} setMsg={setMsg} formSwitch={formSwitch} setformSwitch={setformSwitch} loginUser={loginUser} />
                </div>
                <div className="row text-center mx-auto mt-2">
                    <a className='cr' onClick={() => setformSwitch(0)}>Go Back</a>
                </div>
            </div>
        </div>
    )
}