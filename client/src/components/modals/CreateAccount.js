import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { WButton, WCol, WInput, WRow } from 'wt-frontend';
import { REGISTER } from '../../cache/mutations';


const CreateAccount = (props) => {
	const [input, setInput] = useState({ email: '', password: '', name: ''});
	const [loading, toggleLoading] = useState(false);
	const [Register] = useMutation(REGISTER);

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleCreateAccount = async (e) => {
		for (let field in input) {
			console.log(field);
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
		}
		const { loading, error, data } = await Register({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if (data.register.email === 'already exists') {
				alert('User with that email already registered');
			}
			else {
			props.setShowCreate();
			props.setShowLogin();
		};
	}
};

	return (
		// Replace div with WModal
		<div className="signup-modal">
			<div className="modal-header" >
				<div style={{
					width: '100%', height: '60%', display: 'flex', background: '#f9a825'
				}}>
					<h3 style={{ width: '95%', height: '38px', margin: '0px', padding: '5px' }}>Create A New  Account</h3>
					<Button style={{ width: '5%', height: '38px', margin: '0px', padding: '0px', fontWeight: '700' }}
					 onClick={() => {props.setShowCreate();
										 props.setShowPlanet()}
					 }>X</Button>
				</div>
			</div>

			{
				loading ? <div />
					: <div className="wrap-content-register">
						<div className="modal-spacer">&nbsp;</div>
						<WRow>
							<WCol size="2">
								<h3 className="label-content-register">Name:</h3>
							</WCol>
							<WCol size="8" className="wrap-label-register">
								<WInput
									className="modal-input" onBlur={updateInput} name="name" labelAnimation="up"
									barAnimation="solid" labelText="*Enter Name Here*" wType="outlined" inputType="text"
								/></WCol>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>
						<WRow  >
							<WCol size="2" className="wrap-label-register">
								<h3 className="label-content-register">Email:</h3> </WCol>
							<WCol size="8">	<WInput
								className="modal-input" onBlur={updateInput} name="email" labelAnimation="up"
								barAnimation="solid" labelText="*Enter Email Here*" wType="outlined" inputType="text"
							/></WCol>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>

						<WRow  >
							<WCol size="2" className="wrap-label-register">
								<h3 className="label-content-register">Password:</h3> </WCol>
							<WCol size="8" >
								<WInput
									className="modal-input" onBlur={updateInput} name="password" labelAnimation="up"
									barAnimation="solid" labelText="*Enter Password Here*" wType="outlined" inputType="password"
								/>
							</WCol>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>

						<WRow className="wrap-btn-action-register">
							<WCol size="4" >
								<WButton className="btn-register-account" span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="success" variant='success' onClick={handleCreateAccount} >
									Create Account
								</WButton>
							</WCol>
							<WCol size="4" ></WCol>
							<WCol size="4" >
								<WButton className="btn-cancel" span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger" variant='danger'   onClick={() => {props.setShowCreate();
										 props.setShowPlanet()}} >
									Cancel
							</WButton>
							</WCol>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>
					</div>
			}
			<div className="modal-spacer">&nbsp;</div>
		</div>
	);
}

export default CreateAccount;
