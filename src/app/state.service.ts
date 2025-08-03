import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComponentDef } from './component-library';

export interface SchematicComponent {
  id: string; // Unique instance ID
  libraryId: string; // ID from the component library
  position: { x: number; y: number };
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private readonly _components = new BehaviorSubject<SchematicComponent[]>([]);

  // Expose the observable for components to subscribe to
  readonly components$ = this._components.asObservable();

  addComponent(componentDef: ComponentDef, position: { x: number; y: number }) {
    const newComponent: SchematicComponent = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Simple unique ID
      libraryId: componentDef.id,
      position,
    };

    const currentComponents = this._components.getValue();
    this._components.next([...currentComponents, newComponent]);
  }
}