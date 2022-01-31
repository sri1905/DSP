import React from 'react';
import styled from 'styled-components';
import {FaDotCircle} from "react-icons/fa";
import {BiCameraMovie} from "react-icons/bi";
import {GiBookshelf, GiProgression} from "react-icons/gi";

import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

import "../css/Components.css";

const SideBlueNav=styled(SideNav)`
	background-color: rgb(0, 123, 255);
`;
const SideBar=({domain, setDomain, setNavExpanded})=>{

	return(
		<SideBlueNav
			onSelect={selected => {
				setDomain(selected);
				setNavExpanded(false);
				console.log('selected:', selected);
			}}
			onToggle={expanded =>{
				setNavExpanded(expanded);
			}}
		>
			<SideNav.Toggle />
			<SideNav.Nav defaultSelected={domain}>
				{/* <NavItem eventKey="Schools">
					<NavIcon>
						<FaSchool size={28}/>
					</NavIcon>
					<NavText>
						<div className="sideNavText">Schools</div>
					</NavText>
				</NavItem> */}
				
				<NavItem eventKey="Book Collections">
					<NavIcon>
						<GiBookshelf size={28}/>
					</NavIcon>
					<NavText className="sideNavText">
						<div className="sideNavText">Book Collections</div>
					</NavText>
				</NavItem>

				<NavItem eventKey="Movie Collections">
					<NavIcon>
						<BiCameraMovie size={28}/>
					</NavIcon>
					<NavText className="sideNavText">
						<div className="sideNavText">Movie Collections</div>
					</NavText>
				</NavItem>



				<NavItem eventKey="Progress">
					<NavIcon>
						<GiProgression size={28}/>
					</NavIcon>
					<NavText className="sideNavText">
						<div className="sideNavText">Progress</div>
					</NavText>

					<NavItem eventKey="Books Progress">
						<NavText title="Books Progress">
							<div className="dropDownText"><FaDotCircle size={10} className="dropDownDot"/>Books Progress</div>
						</NavText>
					</NavItem>
					<NavItem eventKey="Movies Progress">
						<NavText title="Movies Progress">
							<div className="dropDownText"><FaDotCircle size={10} className="dropDownDot"/>Movies Progress</div>
						</NavText>
					</NavItem>
				</NavItem>
			
			</SideNav.Nav>
		</SideBlueNav>
	);
};

export default SideBar;
