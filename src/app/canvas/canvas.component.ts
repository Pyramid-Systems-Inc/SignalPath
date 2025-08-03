import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KonvaModule } from 'ng2-konva';
import { Observable } from 'rxjs';
import Konva from 'konva';

import { COMPONENT_LIBRARY, ComponentDef } from '../component-library';
import { SchematicComponent, StateService } from '../state.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, KonvaModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css',
})
export class CanvasComponent implements OnInit {
  components$: Observable<SchematicComponent[]>;
  stageConfig: Observable<Konva.StageConfig>;

  constructor(private state: StateService) {
    this.components$ = this.state.components$;
    this.stageConfig = new Observable((observer) => {
      observer.next({
        width: window.innerWidth - 250 - 300, // full width - sidebars
        height: window.innerHeight,
      });
    });
  }

  ngOnInit(): void {
    // Optional: Log components for debugging
    this.components$.subscribe(components => {
      console.log('Components on canvas:', components);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.stageConfig = new Observable((observer) => {
      observer.next({
        width: window.innerWidth - 250 - 300,
        height: window.innerHeight,
      });
    });
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const componentId = event.dataTransfer?.getData('text/plain');
    if (!componentId) return;

    const componentDef = COMPONENT_LIBRARY.find(c => c.id === componentId);
    if (!componentDef) return;

    // We need to get the drop position relative to the stage
    const stageContainer = event.target as HTMLElement;
    const stageRect = stageContainer.getBoundingClientRect();
    const position = {
      x: event.clientX - stageRect.left,
      y: event.clientY - stageRect.top,
    };

    this.state.addComponent(componentDef, position);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault(); // This is necessary to allow a drop
  }

  // Helper function for Konva properties
  getComponentConfig(component: SchematicComponent) {
    return {
      x: component.position.x,
      y: component.position.y,
      draggable: true,
    };
  }
}