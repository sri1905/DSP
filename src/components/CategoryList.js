import React, { useEffect } from 'react';
import { Draggable } from "react-beautiful-dnd";
import { Accordion, Card, useAccordionToggle } from "react-bootstrap";
import { ReactComponent as Exclamation } from '../data/exclamation.svg';

import TransInput from './TransInput';
import '../css/Components.css';

const CategoryList = ({schoolCats, setSchoolCats, generateArticle}) =>{

	useEffect(() => {
		generateArticle(schoolCats);
   }, [schoolCats]);

	const updateSchoolCats =(i, value) =>{
		let values = [...schoolCats];
		values[i][1] =value;
		console.log("mUpdate:", values[i][1])
		setSchoolCats(values);
	}

	const CustomToggle =({children, eventKey, className, length}) =>{
		const decoratedOnClick =useAccordionToggle(eventKey, ()=>
			console.log('decoratedOnClick @', eventKey),
		);
		return (
			<Accordion.Toggle  as='div' eventKey={eventKey}
				onClick={decoratedOnClick} className={className}>
				{children}
				{length<5 && <Exclamation className='exclamation'/>}
			</Accordion.Toggle>
		);
	};
	
	const Category =({pair, index}) =>{
		return (
			<Draggable draggableId={pair[0]} index={index}>
				{provided => (
					<Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='draggable'>
						<CustomToggle eventKey={pair[0]} className='otherHeading' length={pair[1].split(' ').length}>{pair[0]}</CustomToggle>
						<Accordion.Collapse eventKey={pair[0]}>
							<TransInput
								text = {pair[1]}
								index ={index}
								update ={updateSchoolCats}
							/>
						</Accordion.Collapse>
					</Card>
				)}
			</Draggable>
		);
	};

	const References =({pair, index}) =>{
		return (
			<Card>
				<CustomToggle eventKey={pair[0]} className='refHeading'>{pair[0]}</CustomToggle>
				<Accordion.Collapse eventKey={pair[0]}>
					<TransInput
						pair = {pair}
						index ={index}
						update ={updateSchoolCats}
					/>
				</Accordion.Collapse>
			</Card>
				
		);
	};

	return(
		<div className='droppableArea'>
			<Accordion >
				{schoolCats.map((pair, index) => (
					<div key={(index.toString()+pair[0]).toString()}>
						{pair[0]!=='References' &&
						<Category pair={pair} index={index} key={`${index}-${pair[0]}`}/>}
						
						{pair[0]==='References' &&
						<References pair={pair} index={index} key={`${index}-${pair[0]}`} /> }
					</div>
				))}
			</Accordion>
		</div>
	);
};

export default CategoryList;