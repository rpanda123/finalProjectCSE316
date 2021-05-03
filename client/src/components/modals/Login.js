import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useLazyQuery, useMutation, useQuery }    	from '@apollo/client';
import {  WCol, WRow, WButton, WInput } from 'wt-frontend';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { GET_DB_USER } from '../../cache/queries';

const Login = (props) => {
	let history = useHistory();
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
 	const [Login] = useMutation(LOGIN);

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}
	const handleLogin = async (e) => {
 		if(input.email.length>6 && input.password.length>=6){
		const {error, data } = await Login({ variables: { email:input.email, password: input.password} });
 		if (data.login._id!=null) {
			toggleLoading(true);
			localStorage.setItem('auth', true);
			localStorage.setItem('_id', data.login._id);
			localStorage.setItem('token', data.login.accessToken);
			history.push('/home')
		}else{
			console.log('errre', error);
			alert(data.login.error)
		}
	}else{
		alert("Email or password invalid!")
	}
	};
	return (
        // Replace div with WModal

		<div className="login-modal">
			<div className="modal-header" >
				<div style={{
					width: '100%', height: '60%', display: 'flex', background: '#f9a825'
				}}>
					<h3 style={{ width: '95%', height: '38px', margin: '0px', padding: '5px' }}>Login To Your Account</h3>
					<Button style={{ width: '5%', height: '38px', margin: '0px', padding: '0px', fontWeight: '700' }}
					 onClick={() => {props.setShowLogin()
					 props.setShowPlanet()
					}
					 }>X</Button>
				</div>
			</div>

			{
				loading ? <div />
					:<div className="wrap-content-register">
					
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
							<WButton className="btn-register-account" span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="success" variant='success'
							 onClick={handleLogin} >
								Login
							</WButton>
						</WCol>
						<WCol size="4" ></WCol>
						<WCol size="4" >
							<WButton className="btn-cancel" span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger" variant='danger'   onClick={() => {props.setShowLogin();
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

export default Login;