import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { BlockRootModel } from './BlockRootModel';
import { BlockRootWidget } from './BlockRootWidget'

/*
	Esta clase realiza la construción del nodo, proveyendola de sus componentes:
	Por lo general esta clase no tiene mayor especificaciones
	Widget: La "carcaza" estructura gráfica del nodo
	Model:	El modelo de datos que apoya la parte gráfica del nodo

	NOTA: Esta función puede permitir actualizar los nodos internos
*/
export class BlockRootFactory extends AbstractReactFactory<BlockRootModel, DiagramEngine> {
	constructor() {
		super('BlockRoot');
	}
	// genera el widget
	generateReactWidget(event: { model: BlockRootModel; }): JSX.Element {
		return <BlockRootWidget engine={this.engine} node={event.model} />;
	}
	// genera el modelo
	generateModel(root: any) {
		return new BlockRootModel({root:root});
	}

}