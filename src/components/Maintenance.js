import React from 'react';
import {FaTools} from 'react-icons/fa';
import { Modal } from 'react-bootstrap';


const Maintenance=(props)=>{

	return (
		<Modal
			{...props}
			size="md"
			centered
			aria-labelledby="contained-modal-title-vcenter"
			style={{backgroundColor:'rgba(0,0,0,0.8)'}}
		>
			<Modal.Header closeButton 
				style={{color: '#721c24', backgroundColor: '#f8d7da', borderColor: '#f5c6cb', justifyContent:'center'}}>
				<h4><FaTools /> Movies Under Maintenance <FaTools /></h4>
			</Modal.Header> 
			<Modal.Body style={{color: '#721c24', backgroundColor: '#f8d7da', borderColor: '#f5c6cb'}}>
				<h5>
					Your work in Movies domain might be lost as and when the movies database is updated. Sorry for the inconvenience.
				</h5>
			</Modal.Body>
		</Modal>
	);
};

export default Maintenance;