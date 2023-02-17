import { useState } from 'react'

export default function Register(props) {

    function registerUser(body) {
        fetch(props.endpoint + '/createuser', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(function (val) {
            if (props.formSwitch !== -1) {
                // Registering
                props.setMsg(val.msg)
                // Now we need to just check if the session is empty or not
                if (val['session'] !== null) {
                    // user register logged him in
                    props.loginUser(val['session'])
                }
                // else the user exists let him login
            } else {
                props.setMsg(val.msg)
                if (val.session !== null)
                    props.loginUser(val['session'])
            }
        });
    }

    function handleSubmit(e) {
        e.preventDefault()
        let session = props.session || {}

        const formData = new FormData(e.target)
        formData.forEach((value, property) => session[property] = value);

        if (props.formSwitch === -1)
            session['update_it'] = true
        else
            session['update_it'] = false

        session['name'] = session['fname'] + " " + session['lname']

        if(session['emailAddress'] === undefined)
            session['emailAddress'] = props.session.emailAddress

        delete session['fname']
        delete session['lname']

        registerUser(session)
    }

    return (
        <form className="wpcf7-form init" onSubmit={(e) => handleSubmit(e)}>
            <div className="comment-one__form ">
                <div className='row'>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-name"><input required id="fname" defaultValue={props.session.name !== undefined ? props.session.name.split(' ')[0] : ''} type="text" name="fname" size="40"
                                className="wpcf7-form-control wpcf7-text"
                                aria-required="true" aria-invalid="false" placeholder="First Name" /></span>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-name"><input required id="lname" defaultValue={props.session.name !== undefined ? props.session.name.split(' ')[1] : ''} type="text" name="lname" size="40"
                                className="wpcf7-form-control wpcf7-text"
                                aria-required="true" aria-invalid="false" placeholder="Last Name" /></span>
                        </div>
                    </div>

                </div>
                <div className='row'>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-email"><input required id="useremail" className="wpcf7-form-control wpcf7-text"
                                defaultValue={props.session.emailAddress} type="email" name="emailAddress" disabled={props.formSwitch === -1 ? true : false}
                                size="40"
                                aria-required="true" aria-invalid="false"
                                placeholder="Email Address" /></span>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-phone"><input required id="userphone" defaultValue={props.session.phoneNumber} type="number" name="phoneNumber" size="40"
                                className="wpcf7-form-control wpcf7-text" aria-invalid="false"
                                placeholder="Phone number" /></span>
                        </div>
                    </div>
                </div>
                <div className="row text-center mx-auto">
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-name"><input required id="password" minLength="8" defaultValue={props.session.password} type="password" name="password" size="40"
                                className="wpcf7-form-control wpcf7-text"
                                aria-required="true" aria-invalid="false" placeholder="Password (min. 8)" /></span>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-phone"><input required id="confirmPassword" defaultValue={props.session.password} type="password" size="40"
                                className="wpcf7-form-control wpcf7-text" aria-invalid="false"
                                placeholder="Confirm Password" /></span>
                        </div>
                    </div>
                </div>
                <div className="wpcf7-response-output" style={{ display: 'block', color: 'red' }}>
                    {props.Msg}
                </div>
                <div className="row" style={{ marginTop: 10 + 'px' }}>
                    <button type="submit" className="thm-btn comment-form__btn">{props.formSwitch === -1 ? "Update Now" : "Register Now"}</button>
                </div>
                <div className={props.formSwitch === -1 ? "hide" : "row text-center mx-auto mt-4"}>
                    <a className='cr' onClick={() => { props.setformSwitch(() => !props.formSwitch); props.setMsg('') }}>Login Here</a>
                </div>
            </div>

        </form>
    )
}