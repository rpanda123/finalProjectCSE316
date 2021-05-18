import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { WButton, WCol, WRow } from 'wt-frontend';
import { ADD_REGION, DELETE_REGION, EDIT_REGION, REGISTER } from '../../cache/mutations';
import { GET_ALL_REGIONS, GET_ALL_REGIONS_OF_ANCESTOR } from '../../cache/queries';
import { regions } from '../../MockData/Datas'
import RegionViewer from './RegionViewer';
const Regions = (props) => {
    const [regions, setRegions] = useState([]);
    const [currentMapName, setCurrentMap] = useState('');
    const [addLine, setAddLine] = useState(false);
    const [regionsSelected, setRegionsSelected] = useState('');
    const [isDetail, setDetail] = useState(false);
    const [valBackBread, setValBackBread] = useState(null);
    const [breadCrum, setBreadCrum] = useState([]);
    const [resentViewer, setResentViewer] = useState(false);
    const [pre_regions, setPreRegions] = useState([]);
    const [next_regions, setNextRegions] = useState([]);
    const [addRegions, setAddRegions] = useState({
        name: '',
        capital: '',
        leader: '',
        flag: '',

    });
    const [landmark, setLandmark] = useState([]);

    const resetAddRegionData = () => {
        setAddRegions({
            name: '',
            capital: '',
            leader: '',
            flag: '',
        })
        setLandmark([]);
    }
    const { data, refetch: refreshRegions } = useQuery(GET_ALL_REGIONS, { variables: { mapId: localStorage.getItem('map_id') } })

    useEffect(async () => {
        await refreshRegions()
        if (data) {
            if (data.getAllRegions.length > 0) {
                setRegions(data.getAllRegions)
            } else {
            }
        }
    }, [data, localStorage.getItem('map_id')])

    useEffect(() => {

    }, [addLine])
    const updateInput = (e) => {
        let landmark = [];
        const { name, value } = e.target;
        if (name == "landmark") {
            landmark = value.split(',')
            setLandmark(landmark)
        } else {
            const updated = { ...addRegions, [name]: value };
            setAddRegions(updated);
        }
    };
    useEffect(() => { console.log(landmark) }, [landmark])
    const openAddRegionsLine = async () => {
        setAddLine(true);
        await refreshRegions();
    }

    const handleCancelAdd = async () => {
        setAddLine(false);
        resetAddRegionData()
        await refreshRegions();
    }
    const [savedRegion] = useMutation(ADD_REGION);

    const handleSaveRegions = async () => {

        if (addRegions?.name.length > 3) {
            const dataSending = {
                ...addRegions,
                landmarks: landmark,
                ancestorRegion: localStorage.getItem("map_id")
            }
            setPreRegions(regions)

            const { data: regionsSaved } = await savedRegion({
                variables: { ...dataSending }
            });
            if (regionsSaved) {
                handleCancelAdd()
                resetAddRegionData()
                await refreshRegions();
                alert('Saved')

            } else {
                alert('falured')
            }
        } else {
            alert('Name must has more than 3 characters');
        }
    }
    const [deleteRegions] = useMutation(DELETE_REGION);
    const handleDeleRegions = async (value) => {

        setPreRegions(regions)
        const { data: deletedRegions } = await deleteRegions({
            variables: { _id: value._id }
        });
        if (deletedRegions) {
            await refreshRegions();
            alert('Deleted')
        } else {
            alert('Failured')
        }
    }
    const { data: subregionByAncestor, refetch: getSubregionByAncestor } = useQuery(GET_ALL_REGIONS_OF_ANCESTOR)
    const handleNextRegions = async (value) => {
        localStorage.setItem('map_id', value._id);
        if (localStorage.getItem('breadCrumID') == null || localStorage.getItem('breadCrumID') == "") {
            localStorage.setItem('breadCrumID', value._id);
        } else {
            localStorage.setItem('breadCrumID', localStorage.getItem('breadCrumID') + "," + value._id);
        }
        if (localStorage.getItem('map_name') == null || localStorage.getItem('map_name') == "") {
            localStorage.setItem('map_name', value.name);
        } else {
            localStorage.setItem('map_name', localStorage.getItem('map_name') + "," + value.name);
        }
        await getSubregionByAncestor({ variables: { ancestorRegion: localStorage.getItem('map_id') } })
        if (subregionByAncestor) {
            setRegions(subregionByAncestor.getAllSubRegions);
        }
    }
    const handleUndo = async () => {
        if (pre_regions == null) {
            return
        }
        setNextRegions(regions)
        if (regions.length > pre_regions.length) {
            for (let index = 0; index < regions.length; index++) {
                const region = regions[index];
                let kt = false
                for (let index2 = 0; index2 < pre_regions.length; index2++) {
                    const pre_region = pre_regions[index2];
                    if (region._id == pre_region._id) {
                        kt = true;
                        break;
                    }
                }
                if (!kt) {
                    await handleDeleRegions(regions[index])
                    break
                }
            }
        } else if (regions.length < pre_regions.length) {
            for (let index = 0; index < pre_regions.length; index++) {
                const pre_region = pre_regions[index];
                let kt = false
                for (let index2 = 0; index2 < regions.length; index2++) {
                    const region = regions[index2];
                    if (region._id == pre_region._id) {
                        kt = true;
                        break;
                    }
                }
                if (!kt) {

                    setAddRegions({
                        name: pre_regions[index].name,
                        capital: pre_regions[index].capital,
                        leader: pre_regions[index].leader,
                        flag: pre_regions[index].flag,
                    })

                    setLandmark(pre_regions[index].landmarks)
                    if(addRegions.name!=""){
                    await handleSaveRegions()
                 } else {
                        
                    }
                    break
                }
            }
        }
    }

    useEffect(() => {
        let breadCrums = [];
        let breadId = localStorage.getItem('breadCrumID');
        let breadName = localStorage.getItem('map_name');
        breadId = breadId.split(",");
        breadName = breadName.split(",");
        for (let i = 0; i < breadId.length; i++) {
            let breadCrum = {
                id: breadId[i],
                name: breadName[i],
            }
            breadCrums.push(breadCrum);
        }
        setBreadCrum(breadCrums);
    }, [localStorage.getItem('breadCrumID')])
    const { data: backBreadCrumData, refetch: backBreadCrum } = useQuery(GET_ALL_REGIONS, { variables: { mapId: valBackBread } })

    useEffect(() => {
        if (backBreadCrumData) {
            if (backBreadCrumData.getAllRegions.length > 0) {
                setRegions(backBreadCrumData.getAllRegions)
            }
        }
    }, [backBreadCrumData, regions])
    const handleBreadCrum = async (val, key) => {
        let breadCrums = [];
        if (key != 0) {
            setValBackBread(val.id)
            localStorage.setItem('breadCrumID', '')
            localStorage.setItem('map_name', '')
            let idLocal = '';
            let nameLocal = '';
            for (let index = 0; index < key + 1; index++) {
                const element = breadCrum[index];
                const id = element.id;
                const name = element.name
                idLocal = idLocal + id;
                nameLocal = nameLocal + name;
                if (index < key) {
                    idLocal = idLocal + ",";
                    nameLocal = nameLocal + ",";
                }
                breadCrums.push(element);
            }
            localStorage.setItem('breadCrumID', idLocal)
            localStorage.setItem('map_name', nameLocal)
            setBreadCrum(breadCrums);

            localStorage.setItem('map_id', val.id)
            await backBreadCrum();
            showListRegion();
        } else {
            localStorage.setItem('map', val.id)
            props.setShowMapSelect()
        }
    }
    useEffect(() => {
    }, [breadCrum])
    const showRegionsInforLandmark = (value) => {
        let breadCrums = breadCrum;
        let mapID = localStorage.getItem('breadCrumID').split(",");
        let mapName = localStorage.getItem('map_name').split(",");
        if (localStorage.getItem('breadCrumID') == null || localStorage.getItem('breadCrumID') == "") {
            localStorage.setItem('breadCrumID', value._id);
        } else {
            localStorage.setItem('breadCrumID', localStorage.getItem('breadCrumID') + "," + value._id);
        }
        if (localStorage.getItem('map_name') == null || localStorage.getItem('map_name') == "") {
            localStorage.setItem('map_name', value.name);
        } else {
            localStorage.setItem('map_name', localStorage.getItem('map_name') + "," + value.name);
        }
        const addToBread = {
            id: mapID[mapID.length - 1],
            name: mapName[mapName.length - 1]
        }
        breadCrums.push(addToBread);
        setBreadCrum(breadCrums)
        setRegionsSelected(value)
        setDetail(true)
        setResentViewer(!resentViewer);
    }
    const showRegionsInfor = (value) => {
        setRegionsSelected(null)
        setDetail(true)
        setResentViewer(!resentViewer);
    }
    const showListRegion = () => {
        setDetail(false)
        setResentViewer(false);
    }
    const [editRegion] = useMutation(EDIT_REGION);
    const handleEditRegions = async (value) => {
        alert(value.name + "" + value.capital);
    }
    return (
        <div className="signup-modal">
            <WRow style={{ width: '100%', height: '50px' }}>
                {breadCrum.map((val, key) => {
                    if (key === breadCrum.length - 2) {
                        return (
                            <WCol size="3">
                                <Button className="bread-crum-buttom" onClick={() => {
                                    handleBreadCrum(val, key)
                                }}>
                                    {val.name}
                                </Button>
                            </WCol>
                        )
                    }
                    if (breadCrum.length > 1 && key < breadCrum.length - 1) {
                        return (
                            <WCol size="3">
                                <Button className="bread-crum-buttom" onClick={() => {
                                    handleBreadCrum(val, key)
                                }}>
                                    {val.name}  &#8827;
                            </Button>
                            </WCol>
                        )
                    }
                })}
            </WRow>
            {(isDetail) ? ("") : (<div className="modal-header" style={{
                fontFamily: "'Courier New', Courier, monospace"
            }}>

                <div style={{
                    width: '100%', height: '60%', display: 'flex', background: '#f9a825'

                }} onClick={() => {
                    showRegionsInfor()
                }}>
                    <h3 style={{
                        width: '95%', height: '38px', margin: '0px', padding: '5px',
                        fontFamily: "'Courier New', Courier, monospace"
                    }}>
                        {(breadCrum.length > 0) ? ("  Regions name : " + breadCrum[breadCrum.length - 1].name
                        ) : ("  Regions name:")}
                    </h3>
                </div>

            </div>)}
            <div className="modal-spacer">&nbsp;</div>

            { (resentViewer) ? (
                <RegionViewer resentId={breadCrum[breadCrum.length - 1].id} regionsSelected={regionsSelected}

                />
            ) : (
                <>  <WRow>
                    <Button onClick={() => { openAddRegionsLine() }}>
                        <i className="fas fa-plus" ></i></Button>
                    <Button onClick={() => { handleUndo() }}>
                        <i className="fas fa-undo" ></i></Button>
                    <Button onClick={() => { handleUndo() }}
                    ><i className="fas fa-redo" ></i></Button>
                </WRow>

                    <WRow className="wrap-table-content-title">
                        <WCol size='1' className='wrap-item-title' ></WCol>
                        <WCol size='2' className='wrap-item-title' >Name  {'\u2193'}</WCol>
                        <WCol size='2' className='wrap-item-title' >Capital  {'\u2193'}</WCol>
                        <WCol size='2' className='wrap-item-title' >Leader  {'\u2193'}</WCol>
                        <WCol size='2' className='wrap-item-title' >Flag  {'\u2193'}</WCol>
                        <WCol size='3' className='wrap-item-title' >Landmarks  {'\u2193'}</WCol>
                    </WRow>

                    {
                        regions.map((value, key) => {
                            var landmarks = '';
                            var count = 1;
                            return (
                                <WRow key={key} className='wrap-table-content'>
                                    <WCol size='1' className='wrap-item-region'>
                                        <Button style={{ background: 'rgb(255 255 255 / 14%)' }} onClick={() => { handleDeleRegions(value) }}> X </Button>

                                    </WCol>
                                    <WCol size='2' className='wrap-item-region' onClick={() => { handleNextRegions(value) }}>
                                        {value.name}
                                    </WCol>
                                    <WCol size='2' className='wrap-item-region'>
                                        {value.capital}
                                    </WCol>
                                    <WCol size='2' className='wrap-item-region'>
                                        {value.leader}
                                    </WCol>
                                    <WCol size='2' className='wrap-item-region'>
                                        {value.flag}
                                    </WCol>
                                    { value?.landmarks.length > 0 ? (value.landmarks.map((val, keyy) => {
                                        if (count === value?.landmarks?.length) {
                                            landmarks += val;
                                        } else {
                                            landmarks += val + " ,"
                                        }
                                        count++;
                                    })) : (landmarks = '')}
                                    <WCol size='3' className='wrap-item-region' onClick={() => {
                                        showRegionsInforLandmark(value)
                                    }}>
                                        {landmarks}
                                    </WCol>
                                </WRow>
                            )
                        })
                    }
                </>
            )}
            { addLine ? (
                <>
                    <WRow className="wrap-table-content" >
                        <WCol size='1' className='wrap-item-region' >
                            <Button style={{ background: 'rgb(255 255 255 / 14%)' }} onClick={() => {
                                handleCancelAdd()
                            }}> X </Button>
                        </WCol>
                        <WCol size='2' className='wrap-item-region' >
                            <input className="input-add-region" onChange={updateInput} name="name" className="input-add-region" placeholder="Enter name here" value={addRegions.name} />
                        </WCol>
                        <WCol size='2' className='wrap-item-region' >
                            <input className="input-add-region" onChange={updateInput} name="capital" className="input-add-region" placeholder="Enter capital here" value={addRegions.capital} />
                        </WCol>
                        <WCol size='2' className='wrap-item-region' >
                            <input className="input-add-region" onChange={updateInput} name="leader" className="input-add-region" placeholder="Enter leader here" value={addRegions.leader} />
                        </WCol>
                        <WCol size='2' className='wrap-item-region' >
                            <input className="input-add-region" onChange={updateInput} name="flag" className="input-add-region" placeholder="Enter flag here" value={addRegions.flag} />
                        </WCol>
                        <WCol size='2' className='wrap-item-region' >
                            <input className="input-add-region" onChange={updateInput} name="landmark" className="input-add-region" placeholder="Enter landmark here" value={addRegions.landmark} />
                        </WCol>
                        <WCol size='1' className='wrap-item-region' >
                            <Button onClick={() => {
                                handleSaveRegions()
                            }}><i className="fas fa-save"></i></Button>
                        </WCol>
                    </WRow>

                </>) : ('')}

        </div>
    )
}

export default Regions;