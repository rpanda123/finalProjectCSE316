import React from 'react';
import Welcome from './components/Welcome/Welcome';
import { useQuery } from '@apollo/client';
import * as queries from './cache/queries';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import CreateAccount from './components/modals/CreateAccount';
import Home from './components/Home/Home';

const App = () => {
	let user = null;
	let auth = false;
 
	return (
		<BrowserRouter>
			<Switch>
				<Route
					exact path="/welcome"
					name="welcome"
					render={() =>
						<Welcome  
 						/>
					}
				/>
				<Route
					exact path="/regist"
					name="register"
					render={() =>
						<CreateAccount 
 						/>
					}
				/>
				<Route
						exact path="/home"
						name="Home"
						render={() =>
						<Home 
 						 />
						}
					/>
					{(localStorage.getItem('auth') == true) ?
					(
						<Redirect from="/" to={{ pathname: "/home" }}/>
					) : (<Redirect from="/" to={{ pathname: "/welcome" }} />)}
			
 			</Switch>
		</BrowserRouter>
	);
}

export default App;