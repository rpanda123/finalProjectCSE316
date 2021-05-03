import React, { useEffect, useState } from 'react';
import { LOGOUT } from '../../cache/mutations';
import { useMutation, useApolloClient, useQuery } from '@apollo/client';
import { WButton, WNavItem } from 'wt-frontend';
import { useHistory } from 'react-router';
import { GET_DB_USER } from '../../cache/queries';

const LoggedIn = (props) => {
    let history = useHistory();
    const client = useApolloClient();
    const [Logout] = useMutation(LOGOUT);
    const handleLogout = async (e) => {
        const {data } =  await Logout();
        if (data.logout) {
            let reset = await client.resetStore();
            console.log(reset);
            localStorage.clear()
            history.push('/welcome')
        }
    };
    
  useEffect(()=>{},[localStorage.getItem('name'), props.name])
    return (
        <div>
            <WButton className="navbar-options-selected" onClick={()=>props.showUserInfo()}
             wType="texted" hoverAnimation="text-primary">
                { props.user || localStorage.getItem('name')||''}
            </WButton>
            <WButton className="navbar-options" onClick={handleLogout}
             wType="texted" hoverAnimation="text-primary">
                Logout
            </WButton>
        </div >
    );
};

const LoggedOut = (props) => {
    const [clickLogin, setLogin]  = useState(false);
    const [clickSignIn, setSignIn]  = useState(false);
    const [signInClassName, setSClass]  = useState("navbar-options");
    const [loginClassName, setLClass]  = useState("navbar-options");
    useEffect(()=>{
      if(props.isHome===true){
        setLClass("navbar-options");
        setSClass("navbar-options")
      }
  })
    return (
        <>
            <WNavItem hoverAnimation="lighten">
                <WButton className={signInClassName} onClick={() => {
                if (props.showCreate === false) { 
                    setSClass("navbar-options-selected")
                    setLClass("navbar-options")
                    props.setShowCreate() 
                }
                    
            }} wType="texted" hoverAnimation="text-primary">
                    Create Account
                </WButton>
            </WNavItem>
            <WNavItem hoverAnimation="lighten">
                <WButton className={loginClassName} onClick={() => {
                if (props.showLogin === false) { 
                    props.setShowLogin()
                    setLClass("navbar-options-selected")
                    setSClass("navbar-options")
                 }
                    setLogin(true) ;
                    setSignIn(false)

            }} wType="texted" hoverAnimation="text-primary">
                    Login
                </WButton>
            </WNavItem>
        </>
    );
};

const NavbarOptions = (props) => {
    console.log(props.user);
     return (
        <>
            {
                (!props.auth)? <LoggedOut showCreate={props.showCreate}  isHome={props.isHome}
                showLogin= {props.showLogin} setShowLogin={props.setShowLogin} setShowCreate={props.setShowCreate} />
                    : <LoggedIn reFetch={()=>props.reFetch()} fetchUser={()=>props.fetchUser} setActiveList={props.setActiveList}
                     logout={props.logout} user={props.user} 
                    showUserInfo={()=>props.showUserInfo()}  
                    />
            }
        </>

    );
};

export default NavbarOptions;