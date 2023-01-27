import { useEffect, useState } from "react"
import $ from 'jquery'
import axios from 'axios';

export default function Upload(props) {

    const [Msg, setMsg] = useState('')
    const [disableBtn, setdisableBtn] = useState(false)

    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("Browse File");

    const submitReceiptData = async (e) => {
        e.preventDefault()

        const receiptData = new FormData();

        // Changed
        setdisableBtn(true)
        setMsg('Processing...')

        let inputRecAmt = $('#inputRecAmt').val()
        let inputtxnAdd = $('#inputtxnAdd').val()
        let imgTag = $('#imgTag').val()
        try {
            if ((inputRecAmt !== '') && (inputtxnAdd !== '') && (imgTag !== '')) {
                console.log(inputRecAmt, props.credits);
                if (inputRecAmt < props.credits) {

                    receiptData.append("img", file);
                    receiptData.append("inputRecAmt", inputRecAmt)
                    receiptData.append("inputtxnAdd", inputtxnAdd)
                    receiptData.append("emailAddress", props.emailAddress)
                    receiptData.append("password", props.password)
                    receiptData.append("uid", Math.random().toString(36).slice(2))

                    await axios
                        .post(props.endpoint + '/uploadReceipt', receiptData, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then((val) => {
                            if (val['data']['msg']) {
                                setMsg("Receipt Uploaded !!!")
                                // Changed
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1000)
                            } else {
                                setMsg("Something went wrong...")
                            }
                        })
                        .catch((error) => console.log(error.message));
                }else{
                    setMsg("More Credits Are Needed")
                    setdisableBtn(false)
                }
            } else {
                throw new Error;
            }
        } catch (e) {
            console.log(e)
            setMsg("Please enter valid data !!!")
            setdisableBtn(false)
        }

    }

    const handleChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name)
    }

    useEffect(() => {
        let receiptfile;

        // Uplaod files
        //selecting all required elements
        const dropArea = document.querySelector(".drag-area"),
            dragText = dropArea.querySelector("header"),
            button = dropArea.querySelector("button"),
            input = dropArea.querySelector("input");

        button.onclick = () => {
            input.click(); //if user click on the button then the input also clicked
        }

        input.addEventListener("change", function () {
            //getting user select file and [0] this means if user select multiple files then we'll select only the first one
            receiptfile = this.files[0];
            dropArea.classList.add("active");
            showFile();
        });

        dropArea.addEventListener("dragover", (event) => {
            event.preventDefault();
            dropArea.classList.add("active");
            dragText.textContent = "Release to Upload File";
        });

        //If user leave dragged File from DropArea
        dropArea.addEventListener("dragleave", () => {
            dropArea.classList.remove("active");
            dragText.textContent = "Drag & Drop to Upload File";
        });

        //If user drop File on DropArea
        dropArea.addEventListener("drop", (event) => {
            event.preventDefault();
            receiptfile = event.dataTransfer.files[0];
            showFile();
        });

        function showFile() {
            let fileType = receiptfile.type; //getting selected file type
            let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
            if (validExtensions.includes(fileType)) { //if user selected file is an image file
                let fileReader = new FileReader(); //creating new FileReader object
                fileReader.onload = () => {
                    $('.drapHeader').html('Your File :')
                    $('.drapOR').hide()
                    button.innerHTML = receiptfile.name
                    setFile(receiptfile);
                    setFileName(receiptfile.name);
                }
                fileReader.readAsDataURL(receiptfile);
            } else {
                alert("This is not an Image File!");
                dropArea.classList.remove("active");
                dragText.textContent = "Drag & Drop to Upload File";
            }
        }

    }, [''])

    return (
        <div className={props.formState === 'Upload' ? 'show' : 'hide'}>
            <h1>Upload Receipts</h1>
            <br />
            <div className="row" style={{ padding: 10 + 'px' }}>
                <div className="drag-area col-md-6">
                    <div className="icon"><i className="fas fa-cloud-upload-alt"></i></div>
                    <header className="drapHeader">Drag & Drop to Upload File</header>
                    <span className="drapOR">OR</span>
                    <button>{fileName}</button>
                    <input onChange={handleChange} id="imgTag" type="file" hidden />
                </div>
                <div className="col-md-6">
                    <form className="wpcf7-form init">
                        <div className="comment-one__form ">
                            <div className="col-xl-12">
                                {/* Leads where being fetch but stopepd <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap">
                                    <select className="form-select" id="leadUID">
                                        <option value="0" defaultValue>Select Lead</option>
                                        {
                                            props.leadNames !== undefined ?
                                                props.leadNames.map(data => {
                                                    return <option key={data.uid} value={data.uid}>{data.fname + ' ' + data.lname + ' (' + data.uid + ')'}</option>
                                                })
                                                : () => { return null }
                                        }
                                    </select>
                                </span>
                                </div> */}

                            </div>
                            <div className="col-xl-12">
                                <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                    data-name="your-name"><input id="inputtxnAdd" type="text" size="40"
                                        className="wpcf7-form-control wpcf7-text"
                                        aria-required="true" aria-invalid="false" placeholder="Description" /></span>
                                </div>
                            </div>
                            <div className="col-xl-12">
                                <div className="comment-form__input-box"><span className="wpcf7-form-control-wrap"
                                    data-name="your-name"><input id="inputRecAmt" type="number" size="40"
                                        className="wpcf7-form-control wpcf7-text"
                                        aria-required="true" aria-invalid="false" placeholder="Receipt Amount" /></span>
                                </div>
                            </div>
                            <div className="wpcf7-response-output" style={{ display: 'block', color: 'red' }}>
                                {Msg}
                            </div>
                            <div className="row mx-auto text-left" style={{ marginBottom: 20 + 'px' }}>
                                <div className="col-md-12">
                                    <button onClick={submitReceiptData} type="submit" disabled={disableBtn === true ? true : false} className="tb thm-btn">Upload Receipt</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}