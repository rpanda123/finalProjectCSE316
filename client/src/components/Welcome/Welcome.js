import React, { useState } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import Login 							from '../modals/Login';
import CreateAccount 					from '../modals/CreateAccount';
import { WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import WelCome from '../modals/PlanInWelcome';


const Welcome = (props) => {

	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showPlanet, toggleShowPlanet] 	= useState(true);
	const [showDelete, toggleShowDelete] 	= useState(false);


	// const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	// if(loading) { console.log(loading, 'loading'); }
	// if(error) { console.log(error, 'error'); }
	// if(data) { todolists = data.getAllTodos; }



	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowPlanet(false);
		toggleShowLogin(!showLogin);

	};
 
	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowPlanet(false)
		toggleShowCreate(!showCreate);
	};



	const setShowPlanet = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(false)
		toggleShowPlanet(!showPlanet)
	}

	return (
		<WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							showCreate={showCreate}
							showLogin= {showLogin}
							// user={props?.user}
							// auth={props.auth}
							// reFetch={()=>props.reFetch()}
							// fetchUser={()=>props.fetchUser()} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							setShowPlanet= {setShowPlanet}
							isHome= {showPlanet}
							
						/>
					</ul>
				</WNavbar>
			
			</WLHeader>
		 <WLMain>
		 <div style={{width:'100%', height:'60px'}}></div>

			 {
				 showPlanet && (<WelCome  fetchUser={()=>props.fetchUser()} />)
			 }

			{
				showCreate && (<CreateAccount isClick={showCreate} setShowLogin={()=> setShowLogin()}
				setShowPlanet={()=>setShowPlanet()} setShowCreate={(value)=>setShowCreate(value)}
				 />)
			}

			{
				showLogin && (<Login reFetch={()=>props.reFetch()} fetchUser={()=>props.fetchUser()}  isClick={showLogin}   setShowPlanet={()=>setShowPlanet()} setShowLogin={setShowLogin} />)
			}
 </WLMain>
		</WLayout>
	);
};

export default Welcome;
