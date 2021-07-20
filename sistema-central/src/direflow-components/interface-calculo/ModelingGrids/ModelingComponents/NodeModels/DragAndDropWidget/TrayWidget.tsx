import * as React from 'react';
import styled from '@emotion/styled';


export class TrayWidget extends React.Component {
	render() {
		return <div className="TrayWidget" >{this.props.children}</div>;
	}
}
