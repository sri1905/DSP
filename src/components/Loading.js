import React from 'react';
import { useHistory } from 'react-router';
import Button from "react-bootstrap/Button";

const Loading=({message='Loading...'}) =>{
	const history =useHistory();
	return (
		<div className="mainSpace" style={{ textAlign: "center", marginTop: "15em" }}>
		  <h1>
			<span className="spChar">{message.charAt(0)}</span>{message.slice(1)} 
			{message!=='Loading...' &&
				<>
				<br />
				<Button variant="outline-primary" onClick={()=>history.goBack()}>Go Back</Button>
				</>
			}
		  </h1>
		</div>
	  );
}

export default Loading;