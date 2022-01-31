import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { GiExpand } from "react-icons/gi";
import { ImWarning } from "react-icons/im";
import { AiOutlineSafety } from "react-icons/ai";

import '../../css/Components.css';

const ExpandBtn=(({category, expandCategory})=>(
	<div style={{margin:'0 5px'}}>
	<OverlayTrigger 
		placement='top'
		overlay={
			<Tooltip>
				Click to <strong>expand</strong> 
			</Tooltip>
		}
	>
		<GiExpand size={25} style={{cursor:'pointer'}}
			onClick={()=>expandCategory(category)}/>
	</OverlayTrigger>
	</div>
));

const SafeSwitch=(({safe, setSafe})=>{
	return(
		<div className="safeIcon" onClick={()=>setSafe(!safe)}>
			{safe &&
			<OverlayTrigger
				placement="top"
				overlay={
					<Tooltip>Click to <strong>exit</strong> safe mode</Tooltip>
				}
			>
				<AiOutlineSafety color="green" size={28}/>
			</OverlayTrigger>
			}
			{!safe &&
			<OverlayTrigger
				placement="top"
				overlay={
					<Tooltip>Click to <strong>enter</strong> safe mode</Tooltip>
				}
			>
				<ImWarning color="red" size={28}/>
			</OverlayTrigger>
			}
		</div>
	);
});

const updateValue=((key, newValue, itemCats, safe, setItemCats, setWarn)=>{
	console.log('key:', key);
	let allowChange=true;
	
	if (safe){
		// If NOT safemode: check old and new strings to make sure syntax is intact
		let oldSyntax =itemCats[key][1].replace(/[^{}:',"]/g, '');
		let newSyntax =newValue[1].replace(/[^{}:',"]/g, '');
	
		console.log(oldSyntax);
		console.log(newSyntax);

		let oldIsValid=true, newIsValid=true, x='';
		if (oldSyntax===newSyntax){
			try {
				try{
					x=JSON.parse(itemCats[key][1]);
					console.log('old parsed');
				}
				catch (e){
					console.log('oldERROR');
					oldIsValid=false;
				}
				try{
					x=JSON.parse(newValue[1])
					console.log('new parsed',x);
				}
				catch (e){
					console.log('newERROR');
					newIsValid=false;
				}

				if (oldIsValid!==newIsValid){
					console.log('parsing doesnt match')
					allowChange=false;
				}
			}
			catch (e){
				console.log('something is wrong')
				allowChange=false;
			}
		}
		else{
			console.log('syntax dont match')
			allowChange=false;
		}
	}

	console.log('safe:',safe,' | allowChange:', allowChange);
	// Update itemCats
	if (allowChange){
		let newCats = JSON.parse(JSON.stringify(itemCats));
		newCats[key]=newValue;
		setItemCats(newCats);
	}
	else
		setWarn(true);
});

export {updateValue, SafeSwitch, ExpandBtn};