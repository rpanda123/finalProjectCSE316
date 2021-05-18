import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import { WButton, WCol, WInput, WRow } from 'wt-frontend';
import { EDIT_REGION } from '../../cache/mutations';
import { GET_ALL_REGIONS, GET_REGION_BY_ID } from '../../cache/queries';
const RegionViewer = (props) => {
    const [regionDetail, setRegion] = useState({
        name: '',
        parentRegionName: '',
        regionCapital: '',
        ancestorId: '',
        landmarks: [],
        regionLeader: '',

    })
    const [name, setName] = useState('')
    const [parentRegionName, setParentRegionName] = useState([])
    const [regionCapital, setRegionCapital] = useState('')
    const [ancestorId, setAncestorId] = useState('')
    const [nextRegionId, setNextRegionId] = useState('')
    const [currentRegionId, setCurrentRegionId] = useState(props?.resentId ? props?.resentId : '')
    const [landmarkDel, setLandmarkDel] = useState('')
    const [isEdit, setEdit] = useState(false);
    let idList = localStorage.getItem('breadCrumID').split(',');
    const { data: nextSiblingRegion, refetch: getNextSiblingRegion} = useQuery(GET_REGION_BY_ID, { variables: { _id: nextRegionId } });
    const { data: currentRegions, refetch: getCurrentRegions } = useQuery(GET_REGION_BY_ID, { variables: { _id: currentRegionId } });
    const { data: dataRefetch, refetch: refetch } = useQuery(GET_REGION_BY_ID, { variables: { _id: ancestorId } });
    const { data: allSiblingRegions, refetch: getSiblingRegions} = useQuery(GET_ALL_REGIONS, { variables: { mapId: ancestorId } });
    const { data: allParentRegions, refetch: getAllParent } = useQuery(GET_ALL_REGIONS, { variables: { mapId: idList[idList.length - 3] } })
    const { refetch: getAllSubRegions} = useQuery(GET_ALL_REGIONS, { variables: { mapId: currentRegionId } });
    const [ totalSubregions, setTotalSubRegions] = useState(0)
    useEffect(() => {
        setCurrentRegionId(props.resentId)
    }, [props.resentId])
    const currentRegion = async () => {
        const { data: getcurrentRegion } = await getCurrentRegions()
        const { data: getAllSubRegion } = await getAllSubRegions()
        if (getAllSubRegion) {
            setTotalSubRegions(getAllSubRegion.getAllRegions.length);
        }
        if (getcurrentRegion) {
            setAncestorId(getcurrentRegion.getRegionById.ancestorRegion)
            if (ancestorId == null || ancestorId == "") {
                setRegion({
                    _id: getcurrentRegion.getRegionById._id,
                    name: getcurrentRegion.getRegionById.name,
                    parentRegionName: dataRefetch?(dataRefetch?.getRegionById?.name):(null),
                    flag: getcurrentRegion.getRegionById.flag,
                    landmarks: getcurrentRegion.getRegionById.landmarks,
                    regionLeader: getcurrentRegion.getRegionById.leader,
                    regionCapital: getcurrentRegion.getRegionById.capital,
                    ancestorId: getcurrentRegion.getRegionById.ancestorRegion,

                })
                return
            }
            await refetch();
            if (props.regionsSelected?._id == null) {
                if (dataRefetch) {
                    setRegion({
                        _id: getcurrentRegion.getRegionById._id,
                        name: getcurrentRegion.getRegionById.name,
                        parentRegionName: dataRefetch.getRegionById.name,
                        flag: getcurrentRegion.getRegionById.flag,
                        landmarks: getcurrentRegion.getRegionById.landmarks,
                        regionLeader: getcurrentRegion.getRegionById.leader,
                        regionCapital: getcurrentRegion.getRegionById.capital,
                        ancestorId: getcurrentRegion.getRegionById.ancestorRegion,

                    })
                }
            } else {
                setRegion({
                    _id: getcurrentRegion.getRegionById._id,
                    name: getcurrentRegion.getRegionById.name,
                    parentRegionName: dataRefetch?(dataRefetch?.getRegionById?.name):(null),
                    flag: getcurrentRegion.getRegionById.flag,
                    landmarks: getcurrentRegion.getRegionById.landmarks,
                    regionLeader: getcurrentRegion.getRegionById.leader,
                    regionCapital: getcurrentRegion.getRegionById.capital,
                    ancestorId: getcurrentRegion.getRegionById.ancestorRegion,

                })
            }
        }
    }
    useEffect(async () => {
        await currentRegion();
    }, [dataRefetch, currentRegions, totalSubregions])
    useEffect(() => {
        console.log(regionDetail);
    }, [regionDetail])

    useEffect(() => {
        console.log(regionDetail);
    }, [regionDetail])

    const updateInput = (e) => {
        const { name, value } = e.target;

        setRegion({
            ...regionDetail,
            [name]: value,
        })
    };

    const [updateRegions] = useMutation(EDIT_REGION);
    const handleSave = async () => {
        let parentSelected = parentRegionName.find(o => o.name == regionDetail.parentRegionName);
        console.log(regionDetail.landmarks.length);
        var lands = [...regionDetail.landmarks];
        if (regionDetail.landmarkAdded) {
            const added = regionDetail.landmarkAdded;
            console.log(lands);
            lands.push(added);
            console.log(lands);
        }

        if (regionDetail.name.length > 3) {
            const { loading, data: updatedData } = await updateRegions({
                variables: {
                    _id: regionDetail._id,
                    name: regionDetail.name,
                    capital: regionDetail.regionCapital,
                    leader: regionDetail.regionLeader,
                    flag: regionDetail.flag,
                    landmarks: lands,
                    ancestorRegion: (regionDetail.parentRegionName != null) ? (parentSelected?._id) : (regionDetail.ancestorId)
                }
            });
            if (updatedData) {
                await currentRegion();
                alert('updated success!')
                setEdit(false);

            }
        }
    }
    const handleEdit = () => {
        setEdit(true);
    }
    const view = (label, value) => {
        return (
            <>
                < h4 style={{
                    width: '85%',
                    height: '38px',
                    margin: '0px',
                    padding: '5px',
                    color: '#ffffff',
                    fontFamily: "'Courier New', Courier, monospace"
                }}>{label}: {value}
                </ h4>
            </>
        )
    }

    useEffect(async () => {
        await getAllParent();
        if (allParentRegions) {
            setParentRegionName(allParentRegions.getAllRegions)
        }
    }, [parentRegionName])
    const edit = (label, value, name) => {
        if (name === "parentRegionName") {
            let selectorContent = (parentRegionName.length > 0) ? parentRegionName.map((val, key) => {
                return (
                    <option key={val._id}>{val.name}</option>
                )
            }) : ('');
            return (
                <>
                    <Form.Label style={{
                        width: '40%',
                        height: '38px',
                        margin: '0px',
                        padding: '5px',
                        color: '#ffffff',
                        fontSize: '0.998em',
                        fontWeight: 'bold',
                        fontFamily: "'Courier New', Courier, monospace"
                    }}>{label}</Form.Label>
                    <Form.Control style={{
                        width: '50%',
                        height: '30px',
                        margin: '0px',
                        padding: '5px',
                        color: '#ffffff',
                        fontSize: '1.17em',
                        background: '#322d2d',
                        fontFamily: "'Courier New', Courier, monospace"
                    }}
                        name={name} defaultValue={value}
                        as="select" onChange={(e) => updateInput(e)}>
                        {selectorContent}

                    </Form.Control>

                </>
            )
        } else {
            return (
                <>
                    <label style={{
                        width: '40%',
                        height: '38px',
                        margin: '0px',
                        padding: '5px',
                        color: '#ffffff',
                        fontSize: '0.998em',
                        fontWeight: 'bold',
                        fontFamily: "'Courier New', Courier, monospace"
                    }}>{label}:</label>
                    <input style={{
                        width: '50%',
                        height: '30px',
                        margin: '0px',
                        padding: '5px',
                        color: '#ffffff',
                        fontSize: '1.17em',
                        background: '#322d2d',
                        fontFamily: "'Courier New', Courier, monospace"
                    }} value={value} name={name} onChange={(e) => {
                        updateInput(e)
                    }} />
                </>
            )
        }
    }
    const btnEdit = () => {
        return (<Button style={{
            background: '#2c3437', padding: '5px', marginLeft: '10px',
            height: '30px', width: '7%',
        }} name="regionLeader" onChange={(e) => updateInput(e)}
            onClick={(e) => { handleEdit(e) }}>
            <i className="fas fa-pencil-alt" style={{ color: '#ffffff' }}></i></Button>

        );
    }
    const handleCancelEdit = () => {
        setEdit(false);
    }
    const btnSave = () => {
        return (
            <>
                <Button style={{
                    background: '#2c3437', padding: '5px', marginLeft: '10px',
                    height: '30px', width: '7%',
                }} name="regionLeader" onChange={(e) => updateInput(e)}
                    onClick={(e) => { handleSave(e) }}>
                    <i className="fas fa-save" style={{ color: '#ffffff' }}></i></Button>
                <Button style={{
                    background: '#2c3437', padding: '5px', marginLeft: '10px',
                    height: '30px', width: '7%',
                }} name="regionLeader" onChange={(e) => updateInput(e)}
                    onClick={(e) => { handleCancelEdit(e) }}>
                    <i className="fas fa-window-close" style={{ color: '#ffffff' }}></i></Button>
            </>
        )
    }

    const handleDelLandmark = async (value) => {
        let parentSelected = parentRegionName.find(o => o.name == regionDetail.parentRegionName);
        var lands = [...regionDetail.landmarks];
        var land = [];
        for (let index = 0; index < lands.length; index++) {
            const element = lands[index];
            if (element != value) {
                land.push(element);
            }
        }
        const { loading, data: updatedData } = await updateRegions({
            variables: {
                _id: regionDetail._id,
                name: regionDetail.name,
                capital: regionDetail.regionCapital,
                leader: regionDetail.regionLeader,
                flag: regionDetail.flag,
                landmarks: land,
                ancestorRegion: (regionDetail.parentRegionName != null) ? (parentSelected?._id) : (regionDetail.ancestorId)
            }
        });
        if (updatedData) {
            await currentRegion();
            alert('Deleted successfully')
            setEdit(false);

        }

    }

    const handleNextRegions = async () => {
        const { data: getSiblingRegion } = await getSiblingRegions()
        if (getSiblingRegion) {
            for (let index = 0; index < getSiblingRegion.getAllRegions.length; index++) {
                const element = getSiblingRegion.getAllRegions[index];
                if (element._id == currentRegionId) {
                    if (index + 1 < getSiblingRegion.getAllRegions.length) {
                        setNextRegionId(getSiblingRegion.getAllRegions[index+1]._id)
                        const { data: getNextRegion } = await getNextSiblingRegion()
                        if (getNextRegion) {
                            setCurrentRegionId(getNextRegion.getRegionById._id)
                            await currentRegion();
                        }
                    }
                }
            }
        }
    }
    const handlePrevRegions = async () => {
        const { data: getSiblingRegion } = await getSiblingRegions()
        if (getSiblingRegion) {
            for (let index = 0; index < getSiblingRegion.getAllRegions.length; index++) {
                const element = getSiblingRegion.getAllRegions[index];
                if (element._id == currentRegionId) {
                    if (index - 1 >= 0) {
                        setNextRegionId(getSiblingRegion.getAllRegions[index-1]._id)
                        const { data: getNextRegion } = await getNextSiblingRegion()
                        if (getNextRegion) {
                            setCurrentRegionId(getNextRegion.getRegionById._id)
                            await currentRegion();
                        }
                    }
                }
            }
        }
    }
    return (
        <div className="region-view">
            <WRow>
            <div className="modal-spacer">&nbsp;</div>
            <Button style={{ background: 'rgb(255 255 255 / 14%)' }}
            onClick = {() => {
                handlePrevRegions()
            }}> <i className="fas fa-angle-left" style={{ color: '#fff' }} ></i> </Button>
            <Button style={{ background: 'rgb(255 255 255 / 14%)' }}
            onClick = {() => {
                handleNextRegions()
            }}> <i className="fas fa-angle-right" style={{ color: '#fff' }} ></i> </Button>
            </WRow>
            <WRow>
                <WCol size="6">
                    <div className="modal-spacer">&nbsp;</div>
                    <div className="flag-view">
                        <img src={`${regionDetail.flag}.png`} style={{ width: '80%', height: '80%' }} />
                    </div>
                    <div className="modal-spacer">&nbsp;</div>
                    {!isEdit ? btnEdit() : btnSave()}
                    <WCol>
                        <div style={{ display: 'flex' }}>
                            {(!isEdit) ? view('Regions name', regionDetail.name) : edit('Regions name', regionDetail.name, "name")}
                        </div>
                    </WCol>
                    <WCol>
                        {(regionDetail.parentRegionName!=null) ?
                            <div style={{ display: 'flex' }}>
                                {(!isEdit) ? view('Parent Region', regionDetail.parentRegionName) : edit('Parent Region', regionDetail.parentRegionName, "parentRegionName")}
                            </div> : ('')}
                    </WCol>
                    <WCol>
                        <div style={{ display: 'flex' }}>
                            {(!isEdit) ? view('Region Capital', regionDetail.regionCapital) : edit('Region Capital', regionDetail.regionCapital, "regionCapital")}
                        </div>
                    </WCol>
                    <WCol>
                        <div style={{ display: 'flex' }}>
                            {(!isEdit) ? view('Region Leader', regionDetail.regionLeader) : edit('Region Leader', regionDetail.regionLeader, "regionLeader")}
                        </div>
                    </WCol>
                    < h4 style={{
                        width: '95%',
                        height: '38px',
                        margin: '0px',
                        padding: '5px',
                        color: '#ffffff',
                        fontFamily: "'Courier New', Courier, monospace"
                    }}># Of Sub Regions: {totalSubregions}</ h4>
                </WCol>
                <WCol size="6">
                    <h6 className="label-content-register">Region Landmarks:</h6>
                    {regionDetail.landmarks && regionDetail.landmarks?.map((value, key) => {
                        return (
                            <WRow key={key} className="wrap-table-content">
                                <WCol size='1' className='wrap-item-region'>
                                    <Button style={{ background: 'rgb(255 255 255 / 14%)' }}
                                        onClick={() => {
                                            handleDelLandmark(value)
                                        }}
                                    >
                                        X
                            </Button>
                                </WCol>
                                <WCol size='10' className='wrap-item-region'>
                                    <h4 style={{
                                        width: '95%',
                                        height: '30px',
                                        margin: '0px',
                                        padding: '5px',
                                        color: '#ffffff',
                                        fontFamily: "'Courier New', Courier, monospace",
                                        textAlign: 'left'
                                    }}>{value}</h4>
                                </WCol>
                            </WRow>)
                    })}
                    <div className="modal-spacer">&nbsp;</div>

                    {isEdit ? (
                        <WRow className="wrap-table-content">
                            <WCol size='1' className='wrap-input-field'>
                            </WCol>
                            <WCol size='10' >
                                <input style={{
                                    width: '50%',
                                    height: '30px',
                                    margin: '0px',
                                    padding: '5px',
                                    color: '#ffffff',
                                    fontSize: '1.17em',
                                    background: '#322d2d',
                                    fontFamily: "'Courier New', Courier, monospace"
                                }} name="landmarkAdded" onChange={(e) => {
                                    updateInput(e)
                                }} />
                            </WCol>
                        </WRow>
                    ) : ('')}
                </WCol>

            </WRow>
        </div>
    )
}

export default RegionViewer;