import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import styled from 'styled-components';

import SideBar from './SideBar';
import SearchBar from './SearchBar';
import Table from 'react-bootstrap/Table'

import Loading from './Loading';
import '../css/Components.css';

const HomeSpace=styled.div`
	margin-top: 2em;
	display: flex;
	flex-flow: column;
	align-items: center;
	
	min-width: max(300px, 80vw);
	max-width: 80vw;
	${props=>props.navExpanded && `
		margin-left: 300px;
		-webkit-transition: all .2s;
		transition: all .2s;
		-webkit-transition-delay: 0s;
		transition-delay: 0s;
	`}
	${props=>!props.navExpanded && `
		margin-left: 0px;
		-webkit-transition: all .2s;
		transition: all .2s;
		-webkit-transition-delay: 0s;
		transition-delay: 0s;
	`}
`;

const Home =()=>{
	const [list, setList] =useState([]);
	const [data, setData] =useState({});
	const [done, setDone] =useState(true);
	const [domain, setDomain] =useState('Book Collections');
	
	const [query, setQuery] = useState('');
	const [progressQuery, setProgressQuery] =useState('');

	const [filtered, setFiltered] =useState([]);
	const [navExpanded, setNavExpanded] =useState(false);

	// utility functions
	const ItemsList =() =>(
		<>
		<div className='homeHeader'>
			<div className='homeTitle'>{domain}</div>
			<div><SearchBar query={query} setQuery={setQuery} /></div>
			<div className='homeCountSent'><span className='homeCount'>{filtered.length}</span> {domain}</div>
		</div>
		<div className="allCards">
			{filtered.map(cur => (
				<Link to={`/${data.url}/id=${cur.number}`} className='Item' key={cur.number}>
					<Card border='light' className='card'>
						<Card.Header className='cardHead' style={{'fontSize':'120%'}}>
							{cur.number}
						</Card.Header>
						<Card.Title className='cardTitle' style={{'fontSize':'130%'}}>
							{cur.title}
						</Card.Title>
					</Card>
				</Link>
			))}
		</div>
		</>
	);

	const ProgressTable =() =>(
		<>
		<div className='homeHeader'>
			<div className='homeTitle'>{domain}</div>
			<div><SearchBar placeholder="annotator's name / collection number" query={progressQuery} setQuery={setProgressQuery} /></div>
			{/* <div className='homeCountSent'><span className='homeCount'>{filtered.length}</span> {domain}</div> */}
		</div>
		<div className="verticalTableScroll">
			<Table bordered size="md" responsive="xl">
				<thead className="customHead">
					<tr>
						<th style={{width:'10%'}}>S.no.</th>
						<th style={{width:'30%'}}>Annotator</th>
						<th style={{width:'30%'}}>Collection (collection size is {data.collectionSize})</th>
						<th style={{width:'30%'}}>Progress</th>
					</tr>
				</thead>
				<tbody className="customBody">
						{filtered.length>0
						?
							filtered.map((cur, index)=>(
								<tr className="customRow" key={cur.number}>
									{/* <Link to={`/${data.url}/id=${cur.number}`} className='Item' key={cur.number}> */}
									<td>{index+1}</td>
									<td>{cur.userName ? cur.userName : 'unknown'}</td>
									<td>{cur.title}</td>
									<td>{cur.progress}</td>
									{/* </Link> */}
								</tr>
							))
						:
							<tr className="customRow" >
								<td colSpan="4">No records found.</td>
							</tr>
						}
				</tbody>
			</Table>
		</div>
		</>
	);

	// UseEffects
	useEffect(() => {
		const getList =async () => {
			setDone(false);
			console.log('fetching: ', domain);
			const response = await fetch(process.env.REACT_APP_FLASK_API+`list?domain=${domain}`);
			const data = await response.json();

			setData(data);
			setFiltered(data.list);
			setList(data.list);
			
			console.log('data:',data);
			setDone(true);
		};
		if (domain!=='sorry')
			getList();
   	}, [domain]);

	useEffect(() =>{
		console.log('query:', query);
		setFiltered(list.filter(sch=>{
			if (query.length===0 || query.trim()==='') {
				return sch;
			} else if (sch.title.toLowerCase().includes(query.trim().toLowerCase())) {
				return sch;
			} else if (sch.number.toString().includes(query.trim().toLowerCase())) {
				return sch;
			}
			return null;
		}));
   	}, [query,list]);

	useEffect(() =>{
		console.log('progressQuery:', progressQuery); 
		setFiltered(list.filter(row=>{
			if (progressQuery.length===0 || progressQuery.trim()===''){
				return row;
			} else if (row.userName.toLowerCase().includes(progressQuery.trim().toLowerCase())){
				return row;
			} else if (row.title.toLowerCase().includes(progressQuery.trim().toLowerCase())){
				return row;
			} else if (row.number.toString().includes(progressQuery.trim())){
				return row;
			} else if (!row.userName && 'unknown'.includes(progressQuery.trim().toLowerCase())){
				return row;
			}
			return null;
		}));

	}, [progressQuery,list]);

	// MAIN
   	if(!done){
	   return <Loading />
	}
	return (
		<>
		<SideBar domain={domain} setDomain={setDomain} setNavExpanded={setNavExpanded}/>

		<HomeSpace navExpanded={navExpanded}>
			{
				domain.includes('Progress') ? <ProgressTable /> : <ItemsList />
			}
		</HomeSpace>
		</>
	);
}

export {HomeSpace, Home};