import { Component, AfterViewInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import fabric from 'fabric';
import { Subscription } from 'rxjs';

import { COMPONENT_LIBRARY, ComponentDef } from '../component-library';
import { SchematicComponent, StateService } from '../state.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css',
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasEl', { static: false }) canvasEl!: ElementRef<HTMLCanvasElement>;
  
  private canvas!: fabric.Canvas;
  private stateSubscription!: Subscription;

  constructor(private state: StateService) {}

  ngAfterViewInit(): void {
    // We must wait for the view to be initialized to get the canvas element.
    this.canvas = new fabric.Canvas(this.canvasEl.nativeElement, {
      selection: false, // We'll manage our own selection later
      backgroundColor: '#1e1e1e',
    });

    this.resizeCanvas();

    // Subscribe to state changes to know when to re-render
    this.stateSubscription = this.state.components$.subscribe((components) => {
      this.render(components);
    });
  }

  ngOnDestroy(): void {
    // Clean up the subscription and canvas to prevent memory leaks
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
    this.canvas.dispose();
  }
  
  private render(components: SchematicComponent[]): void {
    if (!this.canvas) return;
    this.canvas.clear();
    this.canvas.backgroundColor = '#1e1e1e'; // Clear resets background, so set it again

    components.forEach(component => {
      const rect = new fabric.Rect({
        width: 100,
        height: 50,
        fill: '#007acc',
        stroke: '#66b2ff',
        strokeWidth: 2,
        cornerRadius: 4,
        originX: 'center',
        originY: 'center',
      });

      const text = new fabric.Text(component.libraryId, {
        fontSize: 12,
        fontFamily: 'monospace',
        fill: 'white',
        originX: 'center',
        originY: 'center',
      });

      const group = new fabric.Group([rect, text], {
  left: component.position.x,
  top: component.position.y,
  data: { id: component.id },
} as any);

      this.canvas.add(group);
    });
  }

  @HostListener('window:resize')
  resizeCanvas(): void {
    const wrapper = this.canvasEl.nativeElement.parentElement;
    if (wrapper && this.canvas) {
      this.canvas.setDimensions({
        width: wrapper.clientWidth,
        height: wrapper.clientHeight,
      });
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const componentId = event.dataTransfer?.getData('text/plain');
    if (!componentId) return;

    const componentDef = COMPONENT_LIBRARY.find((c) => c.id === componentId);
    if (!componentDef) return;

    // The canvas is now the drop target
    const canvasRect = this.canvasEl.nativeElement.getBoundingClientRect();
    const position = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top,
    };

    this.state.addComponent(componentDef, position);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
}