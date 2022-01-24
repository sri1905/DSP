import React, {useState, useEffect} from 'react';
import Pluralize from 'pluralize';
// import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { useHistory } from 'react-router';


import { FaCheck, FaArrowLeft } from 'react-icons/fa';
import { Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";

import SearchBar from './SearchBar';
import Loading from './Loading';

import '../css/Components.css';

import { HomeSpace } from './Home';

const Collection=({match})=>{
	const [list, setList] =useState([]);
	const [data, setData] =useState({});

	const [name, setName] =useState('');
	const [collection, setCollection] =useState({});
	
	const history=useHistory();
	const id =match.params.id;
	const domain =match.params.domain;
	
	const [query, setQuery] = useState('');
	const [filtered, setFiltered] =useState([]);
	const [navExpanded, setNavExpanded] =useState(false);
	
	// useEffects !
	const [done, setDone] =useState(true);
	useEffect(() => {
		const getList =async () => {
			const response = await fetch(process.env.REACT_APP_FLASK_API+`listCollection?domain=${domain}&no=${id}`);
			const data = await response.json();
			setDone(false);

			setData(data);
			setList(data.list);
			setFiltered(data.list);
			setCollection(data.collection);
			setName(data.collection.user);
			
			setDone(true);
		};
		getList();
   	}, [domain]);

	useEffect(() =>{
		setFiltered(list.filter(sch=>{
			if (query.length===0 || query.trim()==='') {
				return sch;
			} else if (sch.title.toLowerCase().includes(query.trim().toLowerCase())) {
				return sch;
			} else if (sch.code.toString().includes(query.trim().toLowerCase())) {
				return sch;
			}
		}));
   	}, [query]);
	
	const updateCollection=e=>{
		e.preventDefault();
		const postObj = {
			method: 'POST',
			cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ domain: domain, num: Number(id), user: name })
		};
		const update =async () => {
			// console.log('API-URL',process.env.REACT_APP_FLASK_API)
			const response = await fetch(process.env.REACT_APP_FLASK_API+'updateCategory', postObj);
			const data = await response.json();
			console.log('response:',data.collection);
			setCollection(data.collection);
			setName(data.collection.user);
		};

		update();
	};

	const updateItem=(e, itemID)=>{
		e.preventDefault();
		const postObj = {
			method: 'POST',
			cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ domain: domain, num: Number(id), itemID: itemID})
		};
		const update =async () => {
			// console.log('API-URL',process.env.REACT_APP_FLASK_API);
			const response = await fetch(process.env.REACT_APP_FLASK_API+'toggleItemState', postObj);
			const data = await response.json();
			setList(data.list);
			setFiltered(data.list);
		};

		update();
	}

   	if(!done || list.length==0){
	   return <Loading />
	}
	return (
		<HomeSpace navExpanded={navExpanded}>

			<div className="homeHeader">
				<div className="collectionTitle">
					<span className="spChar">C</span>ollection {id}
				</div>
				
				<div className="annotator">
					<Form.Control style={{width:'200px'}} type="text" placeholder="Annotator's Name"
						value={name} onChange={e=>setName(e.target.value)} />
					<OverlayTrigger placement='top'
						overlay={
							<Tooltip>
								<strong>Update</strong> name 
							</Tooltip>
						}
					>
						<Button onClick={e=>updateCollection(e)}><FaCheck/></Button>
					</OverlayTrigger>
				</div>
			</div>

			<div className='homeHeader'>
				<div className='homeTitle'>
					{Pluralize(domain).charAt(0).toUpperCase()+Pluralize(domain).slice(1)}
				</div>
				<div><SearchBar query={query} setQuery={setQuery} /></div>
				<div className='homeCountSent'>
					<span className='homeCount'>{filtered.length}</span> 
					{Pluralize(domain, filtered.length)}
				</div>
			</div>

			<div className="allCards oneCollection">
				{filtered.map(cur => (
						<div className='Item' key={cur.code}>
						<Card border='light' className='card'>
							<Card.Header className='cardHead' style={{'fontSize':'120%', backgroundColor:cur.done?'rgb(150, 255, 150)':'rgb(247,247,247)' }}>
								{cur.code}
								<OverlayTrigger placement='top'
									overlay={
										<Tooltip>
											Mark <strong>done</strong> 
										</Tooltip>
									}
								>
									
									<Form.Check 
										id="i"
										type="checkbox"
										name="itemdone"
										checked={cur.done}
										onChange={(e)=>updateItem(e, cur.code)}
									/>
									
								</OverlayTrigger>

							</Card.Header>
							<Link to={`/${data.domain}/id=${cur.code}`}>
								<Card.Title className='cardTitle' style={{margin:'0', fontSize:'130%'}}>
									{cur.title}
								</Card.Title>
							</Link>
						</Card>
						</div>
				))}
			</div>

			<div className='footButtons'>
				<OverlayTrigger placement='top'
					overlay={
						<Tooltip>
							<strong>Previous</strong> page 
						</Tooltip>
					}
				>
					<Button size='lg' variant='primary' onClick={(e)=>history.goBack()} className="mr-1"><FaArrowLeft size={28}/></Button>
				</OverlayTrigger>
			</div>

		</HomeSpace>
	);
}

export default Collection;