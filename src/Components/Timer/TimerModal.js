import React from 'react'
import Modal from 'react-bootstrap/Modal';
import {Button} from "@mui/material";


function TimerModal({show, handleShow, handleClose}){


    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                {/*<Modal.Header closeButton>*/}
                {/*    <Modal.Title>Modal title</Modal.Title>*/}
                {/*</Modal.Header>*/}
                <Modal.Body style={{height: '60vh'}}
                >
                    <h1>AAAA</h1>
                    <h1>AAAA</h1>
                    <h1>AAAA</h1>
                    <h1>AAAA</h1>
                    <h1>AAAA</h1>

                </Modal.Body>
                <Modal.Footer>
                    <Button  onClick={handleClose}>
                        Close
                    </Button>
                    <Button>Understood</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}


export default TimerModal;