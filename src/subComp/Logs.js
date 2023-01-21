import $ from 'jquery'
import { useEffect, useState } from 'react'

export default function Logs(props) {

    const [logs, setlogs] = useState()

    useEffect(() => {
        const fetchLogs = async () => {
            fetch(props.endpoint + '/fetchLogs?emailAddress=' + props.session.emailAddress, {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            }).then(function (response) {
                return response.json()
            }).then(function (val) {
                console.log(val);
                if (val['msg']) {
                    setlogs(val['data'])
                } else {
                    setlogs([])
                }
            });
        }

        fetchLogs()
    }, [])

    return (
        <div className={props.formState === 'Logs' ? 'show' : 'hide'}>
            <h1>Logs</h1>
            <br />
        </div>
    )
}