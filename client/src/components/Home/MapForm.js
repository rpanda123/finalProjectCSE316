import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function MapForm(props) {
    const [show, setShow] = useState(false);
    const [map, setMap] = useState({
        name: ""
    })
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            
            <Button className="btn-create-a-map" 
                    onClick={handleShow
                    // props.setShowMapForm()
                    }
                    >Create New Map</Button>
            <Modal  className="map-form-create"  show={show} onHide={handleClose}>
                <div className="modal-header" >
                <div style={{
                    width: '100%', height: '60%', display: 'flex', background: '#f9a825'
                }}>
                <h3 style={{ width: '95%', height: '38px', margin: '0px', padding: '5px', fontFamily: "'Courier New', Courier, monospace" }}>Your Maps </h3>
                </div>
            </div>
            <div className="modal-spacer">&nbsp;</div>
            <div className="modal-spacer">&nbsp;</div>               
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
            </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
            </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MapForm