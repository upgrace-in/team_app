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
            <section id="registernow"
                className="elementor-section elementor-top-section elementor-element elementor-element-e1f49b6 elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle"
                data-id="e1f49b6" data-element_type="section"
                data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                <div className="elementor-background-overlay"></div>
                <div className="elementor-container elementor-column-gap-default">
                    <div
                        className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-4c1ef90"
                        data-id="4c1ef90" data-element_type="column">
                        <div className="elementor-widget-wrap elementor-element-populated">
                            <div className="elementor-element elementor-element-56eee3f elementor-widget elementor-widget-heading"
                                data-id="56eee3f" data-element_type="widget" data-widget_type="heading.default">
                                <div className="elementor-widget-container">
                                    <h2 className="elementor-heading-title elementor-size-default">Get Started With Your Own
                                        <br />Marketing Credits <br />Create your account today
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section
                className="elementor-section elementor-top-section elementor-element elementor-element-45be0c4 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                data-id="45be0c4" data-element_type="section" id="contact"
                data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" >
                <div className="elementor-container elementor-column-gap-default">
                    <div
                        className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-651cec2"
                        data-id="651cec2" data-element_type="column">
                        <div className="elementor-widget-wrap elementor-element-populated">
                            <section
                                className="elementor-section elementor-inner-section elementor-element elementor-element-396c603 elementor-section-boxed elementor-section-height-default elementor-section-height-default"
                                data-id="396c603" data-element_type="section" id="step">
                                <div className="elementor-container elementor-column-gap-default">
                                    <div
                                        className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-a76845f"
                                        data-id="a76845f" data-element_type="column"
                                        data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                                        <div className="elementor-widget-wrap elementor-element-populated">
                                            <div className="elementor-element elementor-element-9f1e2e0 elementor-widget elementor-widget-button"
                                                data-id="9f1e2e0" data-element_type="widget" data-widget_type="button.default">
                                                <div className="elementor-widget-container">
                                                    <div className="elementor-button-wrapper">
                                                        <a className="elementor-button elementor-size-sm" role="button">
                                                            <span className="elementor-button-content-wrapper">
                                                                <span className="elementor-button-text">Step 1</span>
                                                            </span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="elementor-element elementor-element-22262b2 elementor-widget elementor-widget-text-editor"
                                                data-id="22262b2" data-element_type="widget" data-widget_type="text-editor.default">
                                                <div className="elementor-widget-container">
                                                    <p className="p1"><b>Fill Out This Quick Form</b></p>
                                                    <p className="p3">Don’t have buyers? No problem. Go ahead and fill out
                                                        the quick form below and we’ll be happy to get you set up. Stop
                                                        waiting. We’re ready to put you on the fast-track to success!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
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

                                    <section className="contact-page contact-page-two">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-xl-12">
                                                    <div className="contact-page__form">
                                                        <div role="form" className="wpcf7" id="wpcf7-f169-p592-o1" lang="en-US" dir="ltr">
                                                            <div className="screen-reader-response">
                                                                <p role="status" aria-live="polite" aria-atomic="true">
                                                                </p>
                                                                <ul></ul>
                                                            </div>
                                                            {formSwitch === true ?
                                                                <Register session={""} endpoint={props.endpoint} Msg={Msg} setMsg={setMsg} formSwitch={formSwitch} setformSwitch={setformSwitch} loginUser={loginUser} /> :
                                                                <form className="wpcf7-form init">
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
                                                                        <div className="wpcf7-response-output" style={{ display: 'block' }}>
                                                                            {Msg}
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