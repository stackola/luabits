import React from 'react';
import style from './LoggedOut.less';

import { connect } from 'react-redux';
import { ActionCreators } from 'redux/actions';
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router";

@connect(mapStateToProps, mapDispatchToProps)
class LoggedOut extends React.Component{
	render(){
		return (<div styleName="LoggedOut">LoggedOut</div>);
	}
}


//Make state available as props
function mapStateToProps(state) {
	return {

	};
}

//Make actions available as functions in props
function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

//Connect to navigation, redux and export
export default withRouter( LoggedOut );
