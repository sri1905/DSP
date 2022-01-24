import React, {useState, useEffect} from 'react';
// import useStateWithCallback from 'use-state-with-callback';

import { FaHome, FaSave, FaArrowLeft } from 'react-icons/fa';
// import { ReactTransliterate, TriggerKeys } from "react-transliterate";

import { Nav, Tab, Form } from 'react-bootstrap';
import { Button, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";

import Loading from '../Loading';
import ExpandedInput from './ExpandedInput';
// import CustomSpeech from './CustomSpeech';
// import Speech from 'react-speech';

import { updateValue, SafeSwitch, ExpandBtn } from './OneItemHelper';

import '../../css/Components.css';
import "react-transliterate/dist/index.css";

const OneItem =({ domain, id, history }) =>{
	const [done, setDone]=useState(false);
	const [expand, setExpand]=useState(false);
	
	const [showSuccess, setShowSuccess] = useState(false);

	const [title, setTitle] =useState('');
	const [itemCats, setItemCats]=useState({});
	// To keep track of category for expanded view
	const [curCategory, setCurCategory]=useState('');
	// Alert to warn about syntax changing
	const [warn, setWarn]=useState(false);
	// State to denote safe edit mode 
	const [safe, setSafe]=useState(true);
	
	useEffect(() => {
		setDone(false);
		const getDetails =async () => {
			console.log('URL:', process.env.REACT_APP_FLASK_API+`get_itemData?domain=${domain}&itemID=${id}`);
			const response = await fetch(process.env.REACT_APP_FLASK_API+`get_itemData?domain=${domain}&itemID=${id}`);
			const data = await response.json();
			setTitle(data.title);
			setItemCats(data.categories);
			setCurCategory(Object.keys(itemCats)[0]);

			// console.log('data:',data)
			setDone(true);
		};

		getDetails();
   }, [id]);
   
	useEffect(()=> {
		console.log('safe changed:', safe);
	}, [safe]);

	const saveChanges =() =>{
		// setShowInfo(true);
		const postObj = {
			method: 'POST',
			cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ domain: domain, itemID: Number(id), newCategories: itemCats, title:title })
		};
		const saveDetails =async () => {
			console.log('API-URL',process.env.REACT_APP_FLASK_API)
			const response = await fetch(process.env.REACT_APP_FLASK_API+'save_categories', postObj);
			const data = await response.json();
			setShowSuccess(data.show);
		};

		saveDetails();
	};

	const expandCategory=(category=>{
		setCurCategory(category);
		setExpand(true);
	});

	const goHome=()=>{
		history.push('/');
		setShowSuccess(false);
	};
	if(!done || Object.keys(itemCats)===0){
		return <Loading />
	}
	if(done && title===''){
		return <Loading message={`No ${domain} found with ID ${id}` }/>
	}
	return(
		
		<div className='oneItemMain'>
			
			{/* Alert to warn syntax change */}
			<Modal show={warn} onHide={()=>setWarn(false)} centered>
				<div  className='alertOutline'>
				<Modal.Header closeButton className='alert-danger'>
					<Modal.Title>Syntax change encountered</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					If you are sure about the change, toggle the safe mode off. 
				</Modal.Body>
				</div>
			</Modal>

			<div className='header'>
				{title}
			</div>
			
			{/* Modal to show success of saving details in the database */}
			<Modal show={showSuccess} onHide={()=>setShowSuccess(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Done !</Modal.Title>
				</Modal.Header>
				<Modal.Body className="alert-success" style={{fontSize:'18px'}}>		
					Your changes are saved !
					<p>
						<b>Thank you</b> for your contribution !
					</p>	
				</Modal.Body>
				<Modal.Footer>
					<OverlayTrigger placement='top'
						overlay={
							<Tooltip>
								<strong>Previous</strong> page 
							</Tooltip>
						}
					>
						<Button size='sm' variant='primary' onClick={(e)=>history.goBack()} className="mr-1"><FaArrowLeft size={28}/></Button>
					</OverlayTrigger>
				</Modal.Footer>
			</Modal>

			{/* Modal to show expanded view */}
			<Modal show={expand} 
						onHide={()=>setExpand(false)} 
						dialogClassName="modal-90w"
			>
				<Modal.Header closeButton>
					<div style={{width:'100%'}} className='d-flex justify-content-between'>
						<h4>{curCategory}</h4>
						<SafeSwitch safe={safe} setSafe={setSafe} />
					</div>
				</Modal.Header>
				<Modal.Body>
					<ExpandedInput curCategory={curCategory} itemCats={itemCats} 
											safe={safe} setItemCats={setItemCats} 
											setWarn={setWarn} updateValue={updateValue} />
				</Modal.Body>
				<Modal.Footer>
					<OverlayTrigger placement='top'
						overlay={
							<Tooltip>
								<strong>Save</strong> changes
							</Tooltip>
						}
					>
						<Button onClick={saveChanges} variant='primary'><FaSave size={28}/></Button>
					</OverlayTrigger>
				</Modal.Footer>
			</Modal>
		
			<Tab.Container defaultActiveKey={Object.keys(itemCats)[0]}>
				<div className='body'>
					<div className="leftSidePills">
						<Nav variant="pills" className="flex-column">
						{Object.keys(itemCats).map(category=>(
								<Nav.Item key={category}>
									<Nav.Link eventKey={category}>{category}</Nav.Link>
								</Nav.Item>
						))}
						</Nav>
					</div>
					
					<div className="rightSideBoxes">
					<Tab.Content style={{height:'100%'}}>
						{Object.keys(itemCats).map(category=>(
							<Tab.Pane key={category} eventKey={category} style={{height:'95%'}}>
								 
								<div className="translationBox">
									<Form.Group>
										<Form.Label>
											English
										</Form.Label>
										<Form.Control 
											readOnly={true}
											as="textarea"
											rows={8}
											defaultValue={itemCats[category][0]}
											placeholder="No data, please proceed to the next attribute."
											style={{background:'transparent', border:'None' ,fontSize:'100%'}}
										/>
										{/* <Speech text={itemCats[category][0]} textAsButton={true}/> */}
									</Form.Group>
								</div>
								<div className="translationBox">
									<Form.Group>
										<Form.Label className="d-flex justify-content-between align-items-center">
											Telugu
											<div className="d-flex align-items-center">
												<SafeSwitch safe={safe} setSafe={setSafe} />
												<ExpandBtn category={category} 
													expandCategory={expandCategory} />
											</div>
											
										</Form.Label>
										<Form.Control 
											as="textarea"
											rows={8}
											value ={itemCats[category][1]}
											placeholder ="Translate the above text to telugu."
											onChange={e=>updateValue(category, 
																						[
																							itemCats[category][0], 
																							e.target.value
																						],
																						itemCats, safe, 
																						setItemCats, setWarn
																					)
															}
											style={{width:'100%', fontSize:'110%'}}
										/>
										{/* <ReactTransliterate
											lang ="te"
											value ={itemCats[category][1]}
											placeholder ="Translate the above text to telugu."
											onChange={e=>updateValue(category, 
																						[
																							itemCats[category][0], 
																							e.target.value
																						],
																						itemCats, safe, 
																						setItemCats, setWarn
																					)
															}
											offsetX ={13}
											renderComponent={(props) => <Form.Control as="textarea" rows={8} {...props}
																							style={{width:'100%', fontSize:'110%'}}  
																						/>
																	}
											activeItemStyles={{backgroundColor:'rgb(0,123,255)', fontSize:'150%'}}
											triggerKeys={[TriggerKeys.KEY_ENTER, TriggerKeys.KEY_TAB, TriggerKeys.KEY_RETURN]}
										/> */}
									</Form.Group>
								</div>
							</Tab.Pane>
						))}
					</Tab.Content>
					</div>
					
				</div>
			</Tab.Container>
			
			
			<div className='footButtons'>
				<div>
				<OverlayTrigger placement='top'
					overlay={
						<Tooltip>
							<strong>Previous</strong> page 
						</Tooltip>
					}
				>
					<Button size='lg' variant='primary' onClick={(e)=>history.goBack()} className="mr-1"><FaArrowLeft size={28}/></Button>
				</OverlayTrigger>
				<OverlayTrigger placement='top'
					overlay={
						<Tooltip>
							Back to <strong>Home</strong>
						</Tooltip>
					}
				>
					<Button size='lg' variant='primary' href='/'><FaHome size={28}/></Button>
				</OverlayTrigger>
				</div>
				<OverlayTrigger placement='top'
					overlay={
						<Tooltip>
							<strong>Save</strong> changes
						</Tooltip>
					}
				>
					<Button size='lg' onClick={saveChanges} variant='primary'><FaSave size={28}/></Button>
				</OverlayTrigger>
			</div>

		</div>
	);
}


export default OneItem;


// Autofocus feature in form.control

			// autoFocus
			// onFocus={e => {
			// 	var val = e.target.value;
			// 	e.target.value = '';
			// 	e.target.value = val;
			// }}