import $ from 'jquery'
import { useState } from 'react';


export default function AddUsers(props) {

    const [Msg, setMsg] = useState('');
    const [disableBTN, setdisableBTN] = useState(false)

    const [loanOfficer, setloanOfficer] = useState(false)

    const registerForm = (e) => {
        e.preventDefault()
        setdisableBTN(true)
        let userEmail = $('#useremail').val()
        let userPhone = $('#userphone').val()
        let userName = $('#fname').val() + ' ' + $('#lname').val()
        let password = $('#password').val()
        let confirmPassword = $('#confirmPassword').val()

        let userID = $('#userID').val()

        if ((userEmail !== '') && (userPhone !== '') && (userName !== '') && (password !== '') && (confirmPassword !== '')) {
            if (password === confirmPassword) {
                setMsg("Processing...")
                let body = {
                    "name": userName,
                    "phoneNumber": userPhone,
                    "emailAddress": userEmail,
                    "password": password,
                    "update_it": false,
                    "is_user": $('#is_user').is(":checked"),
                    "is_admin": $('#is_admin').is(":checked"),
                    "is_loanOfficer": $('#is_loanOfficer').is(":checked"),
                }

                if (loanOfficer && userID !== '')
                    body["userID"] = $('#userID').val()
                else
                    setMsg("UserID can't be empty !!!")

                // Send to backend
                fetch(props.endpoint + '/createuser', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { "Content-Type": "application/json" }
                }).then(function (response) {
                    return response.json()
                }).then(function (val) {
                    if (val['session'] !== null) {
                        // user register logged him in
                        setMsg("User Added !!!")
                        $('#addUserForm').trigger("reset");
                        setTimeout(() => {
                            setMsg("")
                            setdisableBTN(false)
                        }, 1000)
                    } else {
                        setMsg("Something went wrong !!!")
                        setdisableBTN(false)
                    }
                });
            } else {
                setMsg("Password unmatched !!!")
                setdisableBTN(false)
            }

        } else {
            setMsg("Please enter valid data !!!")
            setdisableBTN(false)
        }
    }

    return (
        <form id="addUserForm" className="wpcf7-form init" style={{ marginTop: 2 + '%' }}>
            <div className="comment-one__form ">
                <div className='row'>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-name"><input id="fname" type="text" name="your-name" size="40"
                                className="wpcf7-form-control wpcf7-text"
                                aria-required="true" aria-invalid="false" placeholder="First Name" /></span>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-name"><input id="lname" type="text" name="your-name" size="40"
                                className="wpcf7-form-control wpcf7-text"
                                aria-required="true" aria-invalid="false" placeholder="Last Name" /></span>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-email"><input id="useremail" className="wpcf7-form-control wpcf7-text"
                                type="email" name="your-email"
                                size="40"
                                aria-required="true" aria-invalid="false"
                                placeholder="Email Address" /></span>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-phone"><input id="userphone" type="number" name="your-phone" size="40"
                                className="wpcf7-form-control wpcf7-text" aria-invalid="false"
                                placeholder="Phone number" /></span>
                        </div>
                    </div>
                </div>
                <div className="row text-center mx-auto">
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-name"><input id="password" type="password" size="40"
                                className="wpcf7-form-control wpcf7-text"
                                aria-required="true" aria-invalid="false" placeholder="Password" /></span>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                            data-name="your-phone"><input id="confirmPassword" type="password" size="40"
                                className="wpcf7-form-control wpcf7-text" aria-invalid="false"
                                placeholder="Confirm Password" /></span>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-12">
                        <div className="comment-form__input-box">
                            <span className="wpcf7-form-control-wrap">
                                <div className="custom-control custom-radio custom-control-inline">
                                    <input onClick={() => setloanOfficer(false)} type="radio" id="is_user" name="customRadioInline5" className="input2 custom-control-input" />
                                    <label className="custom-control-label" htmlFor="customRadioInline6">User</label>
                                </div>
                            </span>
                        </div>
                    </div>
                    <div className="col-xl-12">
                        <div className="comment-form__input-box">
                            <span className="wpcf7-form-control-wrap">
                                <div className="custom-control custom-radio custom-control-inline">
                                    <input onClick={() => setloanOfficer(false)} type="radio" id="is_admin" name="customRadioInline5" className="input2 custom-control-input" />
                                    <label className="custom-control-label" htmlFor="customRadioInline5">Admin</label>
                                </div>
                            </span>
                        </div>
                    </div>
                    <div className="col-xl-12">
                        <div className="comment-form__input-box">
                            <span className="wpcf7-form-control-wrap">
                                <div className="custom-control custom-radio custom-control-inline">
                                    <input onClick={() => setloanOfficer(true)} type="radio" id="is_loanOfficer" name="customRadioInline5" className="input2 custom-control-input" />
                                    <label className="custom-control-label" htmlFor="customRadioInline6">Loan Officer</label>
                                </div>
                            </span>
                        </div>
                    </div>
                    {
                        loanOfficer ?
                            <div className="col-xl-6">
                                <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                    data-name="your-phone"><input id="userID" type="number" name="your-phone" size="40"
                                        className="wpcf7-form-control wpcf7-text" aria-invalid="false"
                                        placeholder="User ID" /></span>
                                </div>
                            </div>
                            : ""
                    }
                </div>
                <div className="wpcf7-response-output" style={{ display: 'block', color: 'red' }}>
                    {Msg}
                </div>
                <div className="row" style={{ marginTop: 10 + 'px' }}>
                    <button onClick={registerForm} disabled={disableBTN} type="submit" className="thm-btn comment-form__btn">Add User</button>
                </div>
            </div>

        </form>
    )
}