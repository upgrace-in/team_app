import $ from 'jquery'

export default function Register(props) {

    const registerForm = (e) => {
        e.preventDefault()
        let userEmail = $('#useremail').val()
        let userPhone = $('#userphone').val()
        let userName = $('#username').val()
        let password = $('#password').val()
        let confirmPassword = $('#confirmPassword').val()
        if ((userEmail !== '') && (userPhone !== '') && (userName !== '') && (password !== '') && (confirmPassword !== '')) {
            if (password === confirmPassword) {
                props.setMsg("Processing...")
                let body = {
                    "name": userName,
                    "phoneNumber": userPhone,
                    "emailAddress": userEmail,
                    "password": password
                }
                if (props.formSwitch === -1)
                    body['update_it'] = true
                else
                    body['update_it'] = false

                // Send to backend
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


            } else {
                props.setMsg("Password unmatched !!!")
            }

        } else {
            props.setMsg("Please enter valid data !!!")
        }
    }

    return (
        <form className="wpcf7-form init">
            <div className="comment-one__form ">
                <div className='row'>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-name"><input id="username" defaultValue={props.session.name} type="text" name="your-name" size="40"
                                className="wpcf7-form-control wpcf7-text"
                                aria-required="true" aria-invalid="false" placeholder="Your Name" /></span>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-phone"><input id="userphone" defaultValue={props.session.phoneNumber} type="number" name="your-phone" size="40"
                                className="wpcf7-form-control wpcf7-text" aria-invalid="false"
                                placeholder="Phone number" /></span>
                        </div>
                    </div>
                </div>
                <div className="col-xl-12">
                    <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                        data-name="your-email"><input id="useremail" className={props.formSwitch === -1 ? "hide" : "wpcf7-form-control wpcf7-text show"}
                            defaultValue={props.session.emailAddress} type="email" name="your-email"
                            size="40"
                            aria-required="true" aria-invalid="false"
                            placeholder="Email Address" /></span>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-name"><input id="password" defaultValue={props.session.password} type="password" size="40"
                                className="wpcf7-form-control wpcf7-text"
                                aria-required="true" aria-invalid="false" placeholder="Password" /></span>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-phone"><input id="confirmPassword" defaultValue={props.session.password} type="password" size="40"
                                className="wpcf7-form-control wpcf7-text" aria-invalid="false"
                                placeholder="Confirm Password" /></span>
                        </div>
                    </div>
                </div>
                <div className="wpcf7-response-output" style={{ display: 'block', color: 'red' }}>
                    {props.Msg}
                </div>
                <div className="row">
                    <button onClick={registerForm} type="submit" className="thm-btn comment-form__btn">{props.formSwitch === -1 ? "Update Now" : "Register Now"}</button>
                </div>
                <div className={props.formSwitch === -1 ? "hide" : "row text-center mx-auto mt-4"}>
                    <a className='cr' onClick={() => { props.setformSwitch(() => !props.formSwitch); props.setMsg('') }}>Login Here</a>
                </div>
            </div>

        </form>
    )
}