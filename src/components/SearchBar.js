import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { ReactTransliterate, TriggerKeys } from "react-transliterate";

import '../css/Components.css';
import "react-transliterate/dist/index.css";

const SearchBar =({query, setQuery, placeholder=''}) =>{
	return (		
		<div className="searchContainer">
			<FaSearch className='searchIcon' />
			<ReactTransliterate
				autoFocus
				lang="te"
				value={query}
				onChangeText={text => setQuery(text)} 
				
				offsetY = '1px'
				maxOptions={5}
				triggerKeys={[TriggerKeys.KEY_ENTER, TriggerKeys.KEY_TAB, TriggerKeys.KEY_RETURN]}
				activeItemStyles={{backgroundColor:'rgb(0,123,255)', fontSize:'170%'}}
			/>
		</div>
	);
}

export default SearchBar;