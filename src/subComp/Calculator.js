import { useEffect, useState } from "react"
import $ from 'jquery'

export default function Calculator(props) {


    useEffect(() => {
        props.calculator($('.loanAmount3'), $('.credits2'))
    }, [])

    return (
        <div className={props.formState === 'Calculator' ? 'show' : 'hide'}>
            <h1>Calculator</h1>
            <br/>
            <form className="wpcf7-form init">
                <div className="comment-one__form">
                    <div className='row'>
                        <div className="col-xl-12">
                            <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                data-name="your-phone"><input id="inputloanAmt" type="number" size="40"
                                    className="loanAmount3 wpcf7-form-control wpcf7-text" aria-invalid="false"
                                    placeholder="Loan Amount" /></span>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="comment-form__input-box creditText">
                                Credits: <b id="inputCredits" className="credits2">0</b>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}