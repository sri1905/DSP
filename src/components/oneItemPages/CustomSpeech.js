import React, {useState, useEffect} from 'react';

import Speech from 'react-speech';

const CustomSpeech =({text})=>{
	const style = {
		play: {
			button: {
				width: '28',
				height: '28',
				cursor: 'pointer',
				pointerEvents: 'none',
				outline: 'none',
				backgroundColor: 'yellow',
				border: 'solid 1px rgba(255,255,255,1)',
				borderRadius: 6
			}
		}
	};
	return (
		<Speech
			text={text} 
			// styles={style}

			// stop={true} 
			// pause={true} 
			// resume={true}
			textAsButton={true}   
			
			// lang="en-GB"
			// voice="Google UK English Male"
		/>
	)
};

export default CustomSpeech;