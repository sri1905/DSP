import React, {useState, useEffect} from 'react';

import ResizePanel from 'react-resize-panel';
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Alert, Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

import { FaHome, FaSave, FaArrowLeft } from 'react-icons/fa';

import Loading from '../Loading';
import CategoryList from '../CategoryList';

import '../../css/Components.css';

const OneSchool =({ id, history }) =>{
	const [done, setDone]=useState(false);
	
	// Alert's Toggles
	// const [showInfo, setShowInfo] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const [title, setTitle] =useState('');
	const [schoolCats, setSchoolCats]=useState([]);
	const [article, setArticle]=useState('');

	const generateArticle =(schoolCats)=>{
		var article = '';
		schoolCats.map(pair => {
			article = article.concat(pair[1])
		});
		setArticle(article);
   }

	useEffect(() => {
		setDone(false);
		const getDetails =async () => {
			console.log('URL:', process.env.REACT_APP_FLASK_API+`get_itemData?domain=Schools&itemID=${id}`);
			const response = await fetch(process.env.REACT_APP_FLASK_API+`get_itemData?domain=Schools&itemID=${id}`);
			const data = await response.json();
			setTitle(data.title);
			setSchoolCats(data.categories);
			generateArticle(data.categories);
			setDone(true);
		};

		getDetails();
   }, [id]);

	const saveChanges =() =>{
		console.log('SAVE CHANGES');
		// setShowInfo(true);
		const postObj = {
			method: 'POST',
			cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ domain: 'Schools', itemID: Number(id), newCategories: schoolCats })
		};
		const saveDetails =async () => {
			console.log('API-URL',process.env.REACT_APP_API)
			const response = await fetch(process.env.REACT_APP_FLASK_API+'save_categories', postObj);
			const data = await response.json();
			setShowSuccess(data.show);
		};

		saveDetails();
	};

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
	  
		return result;
	};
	
	const onDragEnd =(result) =>{
		if (!result.destination) {
			return;
		}  
		if (result.destination.index === result.source.index) {
			return;
		}
		const newCats = reorder(
			schoolCats,
			result.source.index,
			result.destination.index
		);
	  
		setSchoolCats(newCats);
	};

	const goHome=()=>{
		history.push('/');
		setShowSuccess(false);
	};

	if(!done){
		return <Loading />
	}
	if(done && title===''){
		return <Loading message={`No School found with UDSE Code ${id}` }/>
   }

	return(
		
		<div className='oneItemMain'>

			<div className='header'>
				{title}
			</div>

			<div className="alertsArea">
				<Modal show={showSuccess} onHide={()=>setShowSuccess(false)}>
					<Modal.Header closeButton>
						<Modal.Title>Done !</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Alert  variant="success" className='alert'>
							<Alert.Heading>
								Your changes are saved !
								<p></p>
								<p>
									<b>Thank you</b> for your contribution !
								</p>
							</Alert.Heading>
						</Alert>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={goHome}>
							Home
						</Button>
						<Button variant="secondary" onClick={()=>setShowSuccess(false)}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
			</div>

			<div className='body'>

				<ResizePanel direction="e" style={{ flexGrow: '3' }}>
					<div className='sideContent'>
						<DragDropContext  onDragEnd={onDragEnd}>
							<Droppable droppableId='categories'>
								{provided => (
								<div ref={provided.innerRef} {...provided.droppableProps} style={{flex:'1'}}>

									<CategoryList schoolCats={schoolCats} setSchoolCats={setSchoolCats} 
														article={article} generateArticle={generateArticle}/>

									{provided.placeholder}
								</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>
				</ResizePanel>

				<div className='article'>
					{article.split('\n').map(line=><div key={line}>{line}</div>)}
				</div>

			</div>
			
			
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


export default OneSchool;