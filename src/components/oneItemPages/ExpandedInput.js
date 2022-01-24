import React, {useEffect, useState} from 'react';
import { Form } from "react-bootstrap";

import '../../css/Components.css';

const ExpandedInput=({curCategory, itemCats, safe, setItemCats, setWarn, updateValue})=>{
	
	const [category, setCategory]=useState(curCategory);
	useEffect(()=>{
		setCategory(curCategory);
	}, [curCategory]);

	const [maxRows, setMaxRows]=useState(0);
	useEffect(()=>{
		let rows1 =itemCats[category][0].split(/\r\n|\r|\n/).length;
		let rows2 =itemCats[category][1].split(/\r\n|\r|\n/).length;
		setMaxRows(Math.max(rows1+3, rows2));
	}, [itemCats, category]);


	return (
		<div className='expMain'>
			<div className='expCol'>
				<Form.Control 
					readOnly={true}
					as="textarea"
					rows={maxRows}
					defaultValue={itemCats[category][0]}
					placeholder="No data, please proceed to the next attribute."
					style={{background:'transparent', border:'None' ,
								fontSize:'110%', minHeight:'fitcontent', maxHeight:'100%'
							}}
				/>
				{/* <Speech text={itemCats[category][0]} textAsButton={true}/> */}	
			</div>
			<div className='expCol'>
				<Form.Control 
					as="textarea"
					rows={maxRows}
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
					style={{fontSize:'120%', width:'100%', border:'None',
								minHeight:'fitcontent', maxHeight:'100%' }}
				/>
			</div>
		</div>
	);
};

export default ExpandedInput;