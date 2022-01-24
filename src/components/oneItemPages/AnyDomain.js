import React from 'react';
import { useHistory } from 'react-router';

import Loading from '../Loading';
import OneItem from './OneItem';
// import OneBook from './OneBook';
import OneSchool from './OneSchool';

const AnyDomain=({match})=>{
	const history=useHistory();
	const id =match.params.id;
	const domain =match.params.domain;
	console.log(domain, id);

	if (domain==='school')
		return <OneSchool id={id} history={history}/>
	
	else if (['book', 'movie'].includes(domain))
		return <OneItem domain={domain} id={id} history={history}/>
	
	else
		return <Loading message={`No domain named ${domain}`}/>
	
};

export default AnyDomain;