import React from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import {Home} from './components/Home';
import Loading from './components/Loading';
import Collection from './components/Collection';
// import Maintenance from './components/Maintenance';
import AnyDomain from './components/oneItemPages/AnyDomain';

import './App.css';

const App=()=> {
	// const [modalShow, setModalShow] = React.useState(true);
	document.title='DSP';
	return (
		<div className="main">
			{/* <Maintenance show={modalShow} onHide={() => setModalShow(false)} /> */}
			<Router><Switch>
				<Home exact path="/" component={Home} />
				<Route exact path="/:domain/id=:id" component={AnyDomain} />
				<Route exact path="/collection/:domain/id=:id" component={Collection} />
				<Loading path="*" message="Page not found :("/>
			</Switch></Router>
		
			{/* 
			<OneSchool	school={allSchools[schoolKey]} 
								schkey={schoolKey} 
								defaultKey ={defaultKey}
								setDefaultKey={setDefaultKey}
								allSchools ={allSchools}
								setAllSchools={setAllSchools}
			/> 
			*/}
				
		</div>
	);
}

export default App;
