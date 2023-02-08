import { useState } from 'react'
import $ from 'jquery'

export default function Forgot(props) {

    const [Msg, setMsg] = useState('')

    const [email, setemail] = useState('')
    const [otpfield, setotpfield] = useState('')

    const [repeatpassword, setrepeatpassword] = useState('')
    const [password, setpassword] = useState('')

    const [btn, setBtn] = useState('Verify')

    const [formSwitch, setformSwitch] = useState('verify')

    function sendOTP(email) {
        setBtn('...')
        fetch(props.endpoint + '/sendOTP?emailAddress=' + email, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(function (val) {
            if (val.msg) {
                $('#loginEmail').val('')
                setMsg("A six digit code has been sent to your email address !!!")
                setformSwitch("code")
            } else
                setMsg("Something went wrong, Please try again later !!!")
            setBtn('Verify')
        });
    }

    function checkOTP(otp, email) {
        setBtn('...')
        fetch(props.endpoint + '/checkOTP?emailAddress=' + email + '&otp=' + otp, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(function (val) {
            if (val.msg) {
                $('#loginEmail').val('')
                setMsg("Code Verified !!!")
                setformSwitch("passwordChange")
                setBtn('Update')
            } else {
                setMsg("Something went wrong, Please try again later !!!")
                setBtn('Verify')
            }
        });
    }

    function updatePassword(password, repeatpassword, email) {
        if (password !== repeatpassword) {
            setMsg("Password doens't match !!!")
            return null
        }
        setBtn('...')
        fetch(props.endpoint + '/updatePassword', {
            method: 'POST',
            body: JSON.stringify({
                newpassword: password,
                emailAddress: email
            }),
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response.json()
        }).then(function (val) {
            if (val.msg) {
                setMsg("Password Updated !!!")
                setTimeout(() => {
                    window.location.href = '/user/'
                }, 1000)
            } else {
                setMsg("Something went wrong, Please try again later !!!")
                setBtn('Update')
            }
        });
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
                                                            <form className="wpcf7-form init">
                                                                <div className="screen-reader-response mx-auto text-center">
                                                                    <h3><b>Forgot Password</b></h3>
                                                                </div>
                                                                <br />

                                                                <div className="comment-one__form ">
                                                                    {formSwitch === 'verify' ?
                                                                        <>
                                                                            <div className="col-xl-12">
                                                                                <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                    data-name="your-email"><input onChange={(e) => setemail(e.target.value)} id="loginEmail" type="email" name="your-email"
                                                                                        size="40"
                                                                                        className="wpcf7-form-control wpcf7-text"
                                                                                        aria-required="true" aria-invalid="false"
                                                                                        placeholder="Email Address" /></span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="wpcf7-response-output" style={{ display: 'block', color: 'red' }}>
                                                                                {Msg}
                                                                            </div>
                                                                            <div className="row">
                                                                                <button onClick={() => sendOTP(email)} type="button" className="thm-btn comment-form__btn">{btn}</button>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        formSwitch === 'code' ?
                                                                            <>
                                                                                <div className="col-xl-12">
                                                                                    <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                        data-name="your-email"><input onChange={(e) => setotpfield(e.target.value)} id="loginEmail" type="email" name="your-email"
                                                                                            size="40"
                                                                                            className="wpcf7-form-control wpcf7-text"
                                                                                            aria-required="true" aria-invalid="false"
                                                                                            placeholder="Enter Code" /></span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="wpcf7-response-output" style={{ display: 'block', color: 'red' }}>
                                                                                    {Msg}
                                                                                </div>
                                                                                <div className="row">
                                                                                    <button onClick={() => checkOTP(otpfield, email)} type="button" className="thm-btn comment-form__btn">{btn}</button>
                                                                                </div>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <div className="col-xl-12">
                                                                                    <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                        data-name="your-email"><input onChange={(e) => setpassword(e.target.value)} id="loginEmail" type="passsword" name="your-password"
                                                                                            size="40"
                                                                                            className="wpcf7-form-control wpcf7-text"
                                                                                            aria-required="true" aria-invalid="false"
                                                                                            placeholder="Enter new password" /></span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-xl-12">
                                                                                    <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                                                                        data-name="your-email"><input onChange={(e) => setrepeatpassword(e.target.value)} id="loginEmail" type="passsword" name="your-password"
                                                                                            size="40"
                                                                                            className="wpcf7-form-control wpcf7-text"
                                                                                            aria-required="true" aria-invalid="false"
                                                                                            placeholder="Enter password again" /></span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="wpcf7-response-output" style={{ display: 'block', color: 'red' }}>
                                                                                    {Msg}
                                                                                </div>
                                                                                <div className="row">
                                                                                    <button onClick={() => updatePassword(password, repeatpassword, email)} type="button" className="thm-btn comment-form__btn">{btn}</button>
                                                                                </div>
                                                                            </>
                                                                    }
                                                                </div>

                                                            </form>
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