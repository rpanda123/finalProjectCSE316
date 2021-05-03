import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { WButton, WCol, WInput, WRow } from 'wt-frontend';
import WCard from 'wt-frontend/build/components/wcard/WCard';
import { REGISTER } from '../../cache/mutations';
import { GET_REGION_BY_ID } from '../../cache/queries';
const RegionViewer = (props) => {
    const [name, setName] = useState('')
    const [parentRegionName, setParentRegionName] = useState('')
    const [regionCapital, setRegionCapital] = useState('')
    const [ancestorId, setAncestorId] = useState('')
    const [landmarks, setLanmarks] = useState([])
    const [regionLeader, setRegionLeader] = useState('')
    const {  data:currentRegions ,refetch: getCurrentRegions } = useQuery(GET_REGION_BY_ID, { variables: { _id: props.resentId }});
    const {  data, refetch: refetch } = useQuery(GET_REGION_BY_ID, { variables: { _id: ancestorId }});
    useEffect(async () => {
        await getCurrentRegions()
        if (currentRegions) {
            setAncestorId(currentRegions.getRegionById.ancestorRegion)
            await refetch();
            if ( props.regionsSelected?._id==null ) {
                if(data){
                setLanmarks(currentRegions.getRegionById.landmarks)
                setParentRegionName(data.getRegionById.name)
                setName(currentRegions.getRegionById.name)
                setRegionCapital(currentRegions.getRegionById.capital)
                setRegionLeader(currentRegions.getRegionById.leader)
                }
            }else{
                setLanmarks( props.regionsSelected.landmarks)
                setParentRegionName( props.regionsSelected.name)
                setName( props.regionsSelected.name)
                setRegionCapital( props.regionsSelected.capital)
                setRegionLeader( props.regionsSelected.leader)
            }
        }
    }, [currentRegions,ancestorId, landmarks, data])
    
    return (
        <div className="region-view">
            <WRow>
                <WCol size="6">
                    <div className="flag-view"></div>
                    <h3 style={{ width: '95%',
                                 height: '38px', 
                                 margin: '0px', 
                                 padding: '5px', 
                                 color: '#ffffff',
                                 fontFamily: "'Courier New', Courier, monospace"
                    }}>Regions name: {name}</h3>
                    <h3 style={{ width: '95%', 
                                 height: '38px', 
                                 margin: '0px', 
                                 padding: '5px', 
                                 color: '#ffffff',
                                 fontFamily: "'Courier New', Courier, monospace"
                    }}>Parent region: {parentRegionName}</h3>
                    <h3 style={{ width: '95%', 
                                 height: '38px', 
                                 margin: '0px', 
                                 padding: '5px', 
                                 color: '#ffffff',
                                 fontFamily: "'Courier New', Courier, monospace"
                    }}>Region Capital: {regionCapital}</h3>
                    <h3 style={{ width: '95%', 
                                 height: '38px', 
                                 margin: '0px', 
                                 padding: '5px', 
                                 color: '#ffffff',
                                 fontFamily: "'Courier New', Courier, monospace"
                    }}>Region Leader: {regionLeader}</h3>
                    <h3 style={{ width: '95%', 
                                 height: '38px', 
                                 margin: '0px', 
                                 padding: '5px', 
                                 color: '#ffffff',
                                 fontFamily: "'Courier New', Courier, monospace"
                    }}># Of Sub Regions: 50</h3>
                </WCol>
                <WCol size="6">
                    <h6 className="label-content-register">Region Landmarks:</h6> 
                    {landmarks.map((value, key) => {
                        console.log(value);
                     return (
                    <WRow key={key} className="wrap-table-content">
                        <WCol size='1' className='wrap-item-region'>
                            <Button style={{background:'rgb(255 255 255 / 14%)'}}> 
                            X
                            </Button>
                        </WCol>
                        <WCol size='10' className='wrap-item-region'>
                        <h3 style={{ width: '95%', 
                                 height: '38px', 
                                 margin: '0px', 
                                 padding: '5px', 
                                 color: '#ffffff',
                                 fontFamily: "'Courier New', Courier, monospace",
                                 textAlign: 'left'
                        }}>{value}</h3>
                        </WCol>
                    </WRow>)})}
                    <div className="modal-spacer">&nbsp;</div>
                    <WRow className="wrap-table-content">
                        <WCol size='1' className='wrap-input-field'>
                            <Button style={{background:'rgb(255 255 255 / 14%)'}}> <i className="fas fa-plus" style={{color:'#fff'}} ></i> </Button>
                        </WCol>
                        <WCol size='10' >
                            <WInput
                                className="modal-input" name="addLandmark" labelAnimation="up"
                                barAnimation="solid" labelText="*Enter Landmark Here*" wType="outlined" inputType="addLandmark"
                            />
                        </WCol>
                    </WRow>
                </WCol>
            </WRow>
        </div>
    )
}

export default RegionViewer;