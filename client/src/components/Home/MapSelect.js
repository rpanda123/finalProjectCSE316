import { useMutation, useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { WButton, WCol, WInput, WRow } from 'wt-frontend';
import { maps, regions } from '../../MockData/Datas'
import { useHistory } from 'react-router';
import { GET_MAP } from '../../cache/queries';
import MapForm from './MapForm';
import { ADD_MAP, DELETE_MAP } from '../../cache/mutations';

const MapSelect = (props) => {
    let history = useHistory();
    const [maps, setMaps] = useState([]);
    const [mapName, setMapName] = useState('')
    const [contentHeader, setContent] = useState('Your Maps')
    const [mapForm, setToggleMapForm] = useState(false);
    const { loading, error, data, refetch: refreshMap } = useQuery(GET_MAP, {
        variables: { _id: localStorage.getItem("_id") }
    });
    const setShowMapForm = () => {
        setContent('Enter your map data')
        setToggleMapForm(!mapForm)

    }
    const showMapSelected = () => {
        setContent('Your Maps')
        setToggleMapForm(!mapForm)

    }
   
    useEffect(async () => {
        if (data != null) {
            setMaps(data.getAllMaps);
        } else {
            setMaps([]);
        }
    }, [data])
    useEffect(() => { }, [maps])


    const updateMapName = (e) => {
        const { value, name } = e.target;
        setMapName(value);
    }
    const [created] = useMutation(ADD_MAP);
    const handleCreateMap = async () => {
        if (mapName.length > 3) {
            const { error, data } = await created({ variables: { name: mapName, owner: localStorage.getItem('_id') } })
            if (data.addMap) {
                refreshMap()
                alert('Add successfully')
                showMapSelected()
            } else {
                alert('Add failure')
            }
        } else {
            alert('Map Name is  not valid')
        }
    }
    const [deleteMap] = useMutation(DELETE_MAP);
    const handleDelete = async (value) => {
        console.log(value);
        const { data } = await deleteMap({ variables: { _id: value._id } });
        if (data.deleteMap) {
            refreshMap()
            alert("Deleted")
        }

    }
    return (
        <div className="signup-modal">
            <div className="modal-header" >
                <div style={{
                    width: '100%', height: '60%', display: 'flex', background: '#f9a825'
                }}>
                    <h3 style={{ width: '95%', height: '38px', margin: '0px', padding: '5px', fontFamily: "'Courier New', Courier, monospace" }}>{contentHeader} </h3>
                    {mapForm ? (<Button style={{ width: '5%', height: '38px', margin: '0px', padding: '0px', fontWeight: '700' }}
                        onClick={() => {
                            showMapSelected()
                        }
                        }>X</Button>) : ('')}
                </div>
            </div>
            <div className="modal-spacer">&nbsp;</div>
            <div className="modal-spacer">&nbsp;</div>
            {  mapForm ? (
                <>
                    <WRow  >
                        <WCol size="1" className="wrap-label-register">
                        </WCol>
                        <WCol size="2" className="wrap-label-register">
                            <h3 className="label-content-register">Map Name:</h3> </WCol>
                        <WCol size="8">	<WInput
                            className="modal-input" name="email" labelAnimation="up" onBlur={updateMapName}
                            barAnimation="solid" labelText="*Enter Map Name Here*" wType="outlined" inputType="text"
                        /></WCol>
                    </WRow>
                    <div className="modal-spacer">&nbsp;</div>
                    <div className="modal-spacer">&nbsp;</div>
                    <WRow>
                        <WCol size="4"  ></WCol>
                        <WCol size="3"  > <Button className="btn-create-a-map" onClick={() => handleCreateMap()} >Create Map</Button> </WCol>
                    </WRow>
                    <div className="modal-spacer">&nbsp;</div>
                    <div className="modal-spacer">&nbsp;</div>
                </>
            ) : (
                <WRow>
                    <WCol className="wrap-data-mapper" size="6">
                        {
                            maps?.map((value, key) => {
                                return (
                                    <WRow key={key} href="#" className="wrwap-item" >
                                        <WCol size='1' className='items'></WCol>
                                        <WCol size='7' className='items' onClick={() => {
                                            props.setShowRegions(value)
                                        }}>
                                            <p>{value.name}</p>
                                        </WCol>
                                        <WCol size='4'>
                                            <Button onClick={() => {
                                                handleDelete(value)
                                            }} style={{ background: 'none', border: 'none' }}> <i className="far fa-trash-alt"></i> </Button>
                                        </WCol>
                                    </WRow>
                                )
                            })
                        }
                    </WCol>
                    <WCol size="6" className="wrap-images-planet">
                        <div className="image-planet"></div>
                        <Button className="btn-create-a-map" onClick={setShowMapForm}
                        >Create New Map</Button>
                    </WCol>
                </WRow>)
            }
        </div>
    )
}

export default MapSelect;