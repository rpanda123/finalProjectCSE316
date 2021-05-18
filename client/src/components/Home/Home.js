import React, { useEffect, useState } from 'react';
import { WNavbar, WNavItem } from 'wt-frontend';
import { WLayout, WLHeader, WLMain } from 'wt-frontend';
import NavbarOptions from '../navbar/NavbarOptions';
import Logo from '../navbar/Logo';
import Profile from './Profile';
import MapSelect from './MapSelect';
import Regions from './Regions';
import { useQuery } from '@apollo/client';
import { GET_DB_USER, GET_MAP } from '../../cache/queries';
import RegionViewer from './RegionViewer';
const Home = (props) => {
    const [showInfo, setToggeInfo] = useState(false)
    const [name, setName] = useState('')
    const [maps, setMaps] = useState([]);
    const [mapSelected, setMapSelected] = useState(null);
    const [showMapSelect, setToggeMapSelect] = useState(true)
    const [showRegions, settoggeRegions] = useState(false)
    const [userClicked, setClick] = useState(true);
    const [regionViewer, setRegionViewer] = useState(false);

    // const showRegionViewer = () => {
    //     setToggeInfo(false);
    //     settoggeRegions(false)
    //     setToggeMapSelect(false)
    //     setRegionViewer(!regionViewer);
    // }
    const showUserInfo = () => {
        getGetCurrentUser();
        if (data) {
            localStorage.setItem('name', data.getCurrentUser.name)
            setName(data.getCurrentUser.name)
        }
        setToggeMapSelect(false);
        settoggeRegions(false)
        setToggeInfo(!showInfo);
    }
    const setShowMapSelect = () => {
        // updateName()
        setToggeInfo(false);
        settoggeRegions(false)
        setToggeMapSelect(!showMapSelect);
    }
    const setOnClickHome = () => {
        setToggeInfo(false);
        settoggeRegions(false)
        setToggeMapSelect(true);
    }
    const setShowRegions = (value) => {
        setMapSelected(value);
        localStorage.setItem('map_id', value._id);
        localStorage.setItem('breadCrumID', value._id);
        localStorage.setItem('map_name', value.name)
        setTimeout(10)
        setToggeInfo(false);
        setToggeMapSelect(false)
        settoggeRegions(!showRegions);
    }
   const updatedSuccess= async() =>{
    await getGetCurrentUser();
    if (data) {
        localStorage.setItem('name', data.getCurrentUser.name)
        setName(data.getCurrentUser.name)
    }
   }
    const setUserClicked = () => {
        setClick(!userClicked);
    }

   const { loading, error, data, refetch:getGetCurrentUser } = useQuery(GET_DB_USER, { variables: { _id: localStorage.getItem('_id') } })
    
    useEffect(async() => {
       await getGetCurrentUser()
       if (data) {
        setName(data.getCurrentUser.name)
        localStorage.setItem('name', data.getCurrentUser.name)
    }
     }, [data, name])
         return (
        <WLayout wLayout="header">
            <WLHeader>
                <WNavbar color="colored">
                    <ul>
                        <WNavItem onClick={()=> setOnClickHome() } >
                            <Logo className='logo'/>
                        </WNavItem>
                    </ul>
                    <ul>
                        <NavbarOptions
                            fetchUser={() => props.fetchUser}
                            showUserInfo={() => showUserInfo()}
                            setShowMapSelect={() => setShowMapSelect()}
                            user={name}      
                            auth={localStorage.getItem('auth')}
                        />
                    </ul>
                </WNavbar>
            </WLHeader>
            <WLMain>
                <div style={{ width: '100%', height: '60px' }}></div>
                {(showInfo && localStorage.getItem('auth')) &&
                    <Profile userClicked={userClicked} setUserClicked={() => setUserClicked()} 
                        setShowMapSelect={() => setShowMapSelect()} updatedSuccess={updatedSuccess}/>}
                {(showMapSelect && localStorage.getItem('auth')) && <MapSelect setShowRegions={(value) => setShowRegions(value)}
                    showUserInfo={() => { showUserInfo() }} user={props?.user} maps={maps}/>}
                {(showRegions && localStorage.getItem('auth')) && <Regions mapSelected={mapSelected} setShowMapSelect={setShowMapSelect} />}

                { (regionViewer && localStorage.getItem('auth'))&& <RegionViewer />}
            </WLMain>
        </WLayout>

    )
}

export default Home;