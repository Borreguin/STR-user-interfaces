import * as React from 'react';
import styled from '@emotion/styled';
import { Button } from 'react-bootstrap';

export interface TrayItemWidgetProps {
	model: any;
	color?: string;
	name: string;
}

export class TrayItemWidget extends React.Component<TrayItemWidgetProps> {
	render() {
		return (
			<Button
				variant="outline-light"
				draggable={true}
				onDragStart={event => {
					event.dataTransfer.setData('storm-diagram-node', JSON.stringify(this.props.model));
				}}
				className="tray-item">
				{this.props.name}
			</Button>
		);
	}
}
