import $ from 'jquery'
import { useState } from 'react';
import Register from './Register';

export default function UserForm(props) {

    const [Msg, setMsg] = useState('');

    const [formSwitch, setformSwitch] = useState(false);

    const loginUser = (session) => {
        // create session
        localStorage.setItem("session", JSON.stringify(session['userdata']))
        if ((session.userdata.is_admin === true) || (session.userdata.is_loanOfficer === true))
            window.location.href = '/console'
        else
            window.location.href = '/dashboard'
    }

    const loginForm = (e) => {
        e.preventDefault()
        let userEmail = $('#loginEmail').val()
        let password = $('#loginPassword').val()

        if ((userEmail !== '') && (password !== '')) {
            // Send to backend and wait for approval and create session
            fetch(props.endpoint + '/loginuser', {
                method: 'POST',
                body: JSON.stringify({
                    "emailAddress": userEmail,
                    "password": password
                }),
                headers: { "Content-Type": "application/json" }
            }).then(function (response) {
                return response.json()
            }).then(function (val) {
                let msg = val.msg
                // if (msg.includes('Password'))
                // Forgot Password
                // msg = <a className="cr">Forgot Password?</a>
                setMsg(msg)
                if (val.session.userdata !== null) {
                    loginUser(val['session'])
                }
            });
        } else {
            setMsg("Please enter valid data !!!")
        }
    }

    return (
        <>
            <section
                className="elementor-section elementor-top-section elementor-element elementor-element-9c276d4 elementor-section-full_width elementor-section-height-default elementor-section-height-default"
                data-id="9c276d4" data-element_type="section">
                <div className="elementor-container elementor-column-gap-no">
                    <div
                        className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-a3457b0"
                        data-id="a3457b0" data-element_type="column">
                        <div className="elementor-widget-wrap elementor-element-populated">
                            <div
                                className="elementor-element elementor-element-9aa5474 elementor-widget elementor-widget-qutiiz-contact-form"
                                data-id="9aa5474" data-element_type="widget" data-widget_type="qutiiz-contact-form.default">
                                <div className="elementor-widget-container">



                                    <section className="contact-page contact-page-two" style={{ marginTop: 8 + '%' }}>
                                        <div className="col-md-2 mx-auto text-center">
                                            <img src='/static/logoBlack.png' />
                                        </div>
                                        <br />
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-xl-12">
                                                    <div className="contact-page__form">
                                                        <div role="form" className="wpcf7" id="wpcf7-f169-p592-o1" lang="en-US" dir="ltr">
                                                            {formSwitch === true ?
                                                                <>
                                                                    <div className="screen-reader-response mx-auto text-center">
                                                                        <h3><b>Sign up to Agent Advantage</b></h3>
                                                                    </div>
                                                                    <br />
                                                                    <Register session={""} endpoint={props.endpoint} Msg={Msg} setMsg={setMsg} formSwitch={formSwitch} setformSwitch={setformSwitch} loginUser={loginUser} />
                                                                </>
                                                                :
                                                                <form className="wpcf7-form init">
                                                                    <div className="screen-reader-response mx-auto text-center">
                                                                        <h3><b>Sign in to Agent Advantage</b></h3>
                                                                    </div>
                                                                    <br />
                                                                    <div className="comment-one__form ">
                                                                        <div className="col-xl-12">
                                                                            <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                data-name="your-email"><input id="loginEmail" type="email" name="your-email"
                                                                                    size="40"
                                                                                    className="wpcf7-form-control wpcf7-text"
                                                                                    aria-required="true" aria-invalid="false"
                                                                                    placeholder="Email Address" /></span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12">
                                                                            <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                data-name="your-name"><input id="loginPassword" type="password" size="40"
                                                                                    className="wpcf7-form-control wpcf7-text"
                                                                                    aria-required="true" aria-invalid="false" placeholder="Password" /></span>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row'>
                                                                            <div className='col-md-6 text-left'>
                                                                                <div className="wpcf7-response-output" style={{ display: 'block', color: 'red' }}>
                                                                                    {Msg}
                                                                                </div>
                                                                            </div>
                                                                            <div className='col-md-6 ml-auto text-right' style={{ textAlign: 'right' }}>
                                                                                <a href='/forgot/'>Forgot Password?</a>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <button onClick={loginForm} type="submit" className="thm-btn comment-form__btn">Login Now</button>
                                                                        </div>
                                                                        <div className="row text-center mx-auto mt-4">
                                                                            <a className='cr' onClick={() => { setformSwitch(() => !formSwitch); setMsg('') }}>Register Here</a>
                                                                        </div>
                                                                    </div>

                                                                </form>}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}