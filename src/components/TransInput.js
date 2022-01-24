import React, { useState } from 'react';
import { Form, Button } from "react-bootstrap";
import { FaCheckSquare } from 'react-icons/fa';
import { ReactTransliterate, TriggerKeys } from "react-transliterate";

import '../css/Components.css';
import "react-transliterate/dist/index.css";

const TransInput =(props) =>{
	const [text, setText] =useState(props.text);

	return (		
		<div style={{fontSize:"110%"}}>
			<ReactTransliterate
				lang="te"
				value={text}
				placeholder ="Please add relevant details !"
				onChange={(e) => setText(e.target.value)} 
				offsetX ={13}
				renderComponent={(props) => <Form.Control as="textarea" rows={5} {...props}
																style={{width:'100%', fontSize:'120%', marginBottom:'5px'}}  
															/>
										}
				activeItemStyles={{backgroundColor:'rgb(0,123,255)', fontSize:'170%'}}
				triggerKeys={[TriggerKeys.KEY_ENTER, TriggerKeys.KEY_TAB, TriggerKeys.KEY_RETURN]}
			/>
			
			<div className="keepRight">
				{/* <FaCheckSquare color="rgb(0,123,255)" size="2em" onClick={()=>{props.update(props.index, text)}}/> */}
				<Button onClick={()=>{props.update(props.index, text)}}><FaCheckSquare size='2em'/></Button>
			</div>
		</div>
	);
}

export default TransInput;