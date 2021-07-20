import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { CompRootModel } from './CompRootModel';
import { CompRootWidget } from './CompRootWidget'

/*
	Esta clase realiza la construción del nodo, proveyendola de sus componentes:
	Por lo general esta clase no tiene mayor especificaciones
	Widget: La "carcaza" estructura gráfica del nodo
	Model:	El modelo de datos que apoya la parte gráfica del nodo

	NOTA: Esta función puede permitir actualizar los nodos internos
*/
export class CompRootFactory extends AbstractReactFactory<CompRootModel, DiagramEngine> {
	constructor() {
		super('CompRoot');
	}
	// genera el widget
	generateReactWidget(event: { model: CompRootModel; }): JSX.Element {
		return <CompRootWidget engine={this.engine} node={event.model} />;
	}
	// genera el modelo
	generateModel(root: any) {
		return new CompRootModel({root:root});
	}

}