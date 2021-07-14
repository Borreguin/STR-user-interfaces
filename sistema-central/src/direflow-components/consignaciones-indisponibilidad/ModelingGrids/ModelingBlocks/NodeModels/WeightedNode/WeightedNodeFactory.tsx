import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { WeightedNodeModel as WeightedNodeModel } from './WeightedNodeModel';
import { WeightedNodeWidget } from './WeightedNodeWidget'

/*
	Esta clase realiza la construción del nodo, proveyendola de sus componentes:
	Por lo general esta clase no tiene mayor especificaciones
	Widget: La "carcaza" estructura gráfica del nodo
	Model:	El modelo de datos que apoya la parte gráfica del nodo

	NOTA: Esta función puede permitir actualizar los nodos internos
*/
export class WeightedNodeFactory extends AbstractReactFactory<WeightedNodeModel, DiagramEngine> {
	constructor() {
		super('WeightedNode');
	}
	// genera el widget
	generateReactWidget(event: { model: WeightedNodeModel; }): JSX.Element {
		return <WeightedNodeWidget engine={this.engine} node={event.model} />;
	}
	// genera el modelo
	generateModel(node: any) {
		return new WeightedNodeModel({node:node});
	}

}