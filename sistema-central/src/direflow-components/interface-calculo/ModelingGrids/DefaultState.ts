import { MouseEvent, KeyboardEvent } from 'react';
import {
	SelectingState,
	State,
	Action,
	InputType,
	ActionEvent,
	DragCanvasState,
	DeleteItemsAction
} from '@projectstorm/react-canvas-core';
import { PortModel, DiagramEngine, DragDiagramItemsState } from '@projectstorm/react-diagrams-core';
import { CreateLinkState } from './CreateLinkState';
import * as _ from "lodash";
/*
	Default State:
	Esta clase permite definir la manera en como:
	- Se conectan los elementos
	- Se eliminan los elementos
*/



export class DefaultState extends State<DiagramEngine> {
	dragCanvas: DragCanvasState;
	createLink: CreateLinkState;
	dragItems: DragDiagramItemsState;
	connecting_link: boolean;

	constructor() {
		super({ name: 'starting-state' });
		this.childStates = [new SelectingState()];
		this.dragCanvas = new DragCanvasState();
		this.createLink = new CreateLinkState();
		this.dragItems = new DragDiagramItemsState();
	

		// determine what was clicked on
		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: ActionEvent<MouseEvent>) => {
					const eventBus = this.engine.getActionEventBus();
					const element = eventBus.getModelForEvent(event);

					// the canvas was clicked on, transition to the dragging canvas state
					if (!element) {
						this.transitionWithEvent(this.dragCanvas, event);
						// permite realizar drag del canvas
					}
					// initiate dragging a new link
					else if (element instanceof PortModel) {
						// empieza a dibujar el link
						return;
					}
					// move the items (and potentially link points)
					else {
						this.transitionWithEvent(this.dragItems, event);
					}
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.MOUSE_UP,
				fire: (event: ActionEvent<MouseEvent>) => {
					const element = this.engine.getActionEventBus().getModelForEvent(event);
					if (element instanceof PortModel) this.transitionWithEvent(this.createLink, event);
				}
			})
		);

		/*
		this.registerAction(
			new Action({
				type: InputType.KEY_DOWN,
				fire: (event: ActionEvent<KeyboardEvent>) => {
					const { keyCode, ctrlKey, shiftKey, altKey, metaKey } = event.event;
					console.log(keyCode, ctrlKey, shiftKey, altKey, metaKey)
					// si tecla Escape: parar la conexión
					if (keyCode === 27 && this.connecting_link) { 
						console.log("parar el dibujo")
					}
				}
			})
		);
		*/
		
		// Configurando la tecla que permite eliminar 
		this.registerAction(new CustomDeleteItemsAction());
	}
}


interface CustomDeleteItemsActionOptions {
	keyCodes?: number[];
}

/**
 * Deletes all selected items, but asks for confirmation first
 */
class CustomDeleteItemsAction extends Action {
	constructor(options: CustomDeleteItemsActionOptions = {}) {
		options = {
			keyCodes: [46],
			// backspace 8
			// delete 46
			...options
		};
		super({
			type: InputType.KEY_DOWN,
            fire: (event: ActionEvent<React.KeyboardEvent>) => {
                
                if (options.keyCodes.indexOf(event.event.keyCode) !== -1) {
                    const selectedEntities = this.engine.getModel().getSelectedEntities();
					console.log("Antes IF selectedEntities", selectedEntities)
					
					if (selectedEntities.length > 0) {
						// Enridades protegidas, que no permiten eliminación:
						let protected_entities = ["BloqueLeaf"];
						const confirm = window.confirm('Seguro que desea eliminar este elemento?');
						// No se debe permitir eliminar nodos
						

                        if (confirm) {
                            _.forEach(selectedEntities, model => {
                                // only delete items which are not protected
								// elementos que no están en protected_entities pueden ser borrados:
								let isIn = protected_entities.indexOf(model.getType()) >= 0;
								console.log(isIn, model.getType());
								if (!model.isLocked() || !isIn) {
                                    model.remove();
                                }
                            });
                            this.engine.repaintCanvas();
                        }
                    } 

                } else if (event.event.keyCode === 8) { 
                    this.engine.repaintCanvas();
                }
			}
		});
	}
}
