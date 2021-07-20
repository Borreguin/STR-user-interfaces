import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { AverageNodeModel as AverageNodeModel } from './AverageNodeModel';
import { AverageNodeWidget } from './AverageNodeWidget'

/*
	Esta clase realiza la construción del nodo, proveyendola de sus componentes:
	Por lo general esta clase no tiene mayor especificaciones
	Widget: La "carcaza" estructura gráfica del nodo
	Model:	El modelo de datos que apoya la parte gráfica del nodo

	NOTA: Esta función puede permitir actualizar los nodos internos
*/
export class AverageNodeFactory extends AbstractReactFactory<AverageNodeModel, DiagramEngine> {
	constructor() {
		super('AverageNode');
	}
	// genera el widget
	generateReactWidget(event: { model: AverageNodeModel; }): JSX.Element {
		return <AverageNodeWidget engine={this.engine} node={event.model} />;
	}
	// genera el modelo
	generateModel(node: any) {
		return new AverageNodeModel({node:node});
	}

}