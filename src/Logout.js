import { useEffect } from "react"

export default function Logout() {

    useEffect(() => {
        localStorage.removeItem('session')
        window.location.replace('/')
    }, [''])

    return (
        <>
        </>

    )
}