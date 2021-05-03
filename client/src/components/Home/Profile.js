import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { WButton, WCol, WInput, WRow } from 'wt-frontend';
import { UPDATE_USER } from '../../cache/mutations';
import { GET_DB_USER } from '../../cache/queries';

const Profile = (props) => {
	const [input, setInput] = useState({ email: '', password: '', name: '', _id:'' });
	const [_id, setId] = useState(null);
	const [loading, toggleLoading] = useState(false);
	const [updateUser] = useMutation(UPDATE_USER);
	const { error, data, refetch: getCurrentUser } = useQuery(GET_DB_USER, { variables: { _id: localStorage.getItem('_id') } })
	
	useEffect(() => {
		if (data) {
			setInput({
				email: data.getCurrentUser.email,
				password: data.getCurrentUser.password,
				name: data.getCurrentUser.name,
				_id: data.getCurrentUser._id
			})
 		}
	},[data, localStorage.getItem('name')])

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleUpdateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}else{
				console.log(input);
			}
		}
		console.log(input);
		const { loading, error, data:updateProfile } = await updateUser({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (updateProfile) {
			toggleLoading(false);
			localStorage.setItem('name', updateProfile.updateProfile.name)
			props.updatedSuccess()
			console.log(localStorage.getItem('name'));
			alert("Updated")
		};
	};

	return (
		// Replace div with WModal
		<div className="signup-modal">
			<div className="modal-header" >
				<div style={{
					width: '100%', height: '60%', display: 'flex', background: '#f9a825'
				}}>
					<h3 style={{ width: '95%', height: '38px', margin: '0px', padding: '5px' }}>Enter Updated Account Information</h3>
					<Button style={{ width: '5%', height: '38px', margin: '0px', padding: '0px', fontWeight: '700' }}
						onClick={() => {
								props.setShowMapSelect()
						}
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
									className="modal-input" onBlur={updateInput} defaultValue={input.name} name="name" labelAnimation="up"
									barAnimation="solid" labelText="*Enter Name Here*" wType="outlined" inputType="text"
								/></WCol>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>
						<WRow  >
							<WCol size="2" className="wrap-label-register">
								<h3 className="label-content-register">Email:</h3> </WCol>
							<WCol size="8">	<WInput defaultValue={input.email}
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
									className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" defaultValue={input.password}
									barAnimation="solid" labelText="*Enter Password Here*" wType="outlined" inputType="password"
								/>
							</WCol>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>

						<WRow className="wrap-btn-action-register">
							<WCol size="4" >
								<WButton className="btn-register-account" span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="success" variant='success' onClick={handleUpdateAccount} >
									Update Account
								</WButton>
							</WCol>
							<WCol size="4" ></WCol>
							<WCol size="4" >
								<WButton className="btn-cancel" span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded"
									color="danger" variant='danger' onClick={() => { props.setShowMapSelect() }} >
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

export default Profile;
