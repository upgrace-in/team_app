import { useEffect } from "react"
import UserForm from "./subComp/UserForm";
import $ from 'jquery'

export default function User(props) {

    if (props.session != null) {
        window.location.href = '/dashboard'
    }
    $('.hide_it').hide()

    return (
        <UserForm endpoint={props.endpoint} />
    )
}