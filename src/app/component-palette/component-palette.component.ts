import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMPONENT_LIBRARY, ComponentDef } from '../component-library';

@Component({
  selector: 'app-component-palette',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-palette.component.html',
  styleUrl: './component-palette.component.css'
})
export class ComponentPaletteComponent {
  library: ComponentDef[] = COMPONENT_LIBRARY;

  getGroupedLibrary() {
    return this.library.reduce((acc, component) => {
      (acc[component.category] = acc[component.category] || []).push(component);
      return acc;
    }, {} as Record<string, ComponentDef[]>);
  }

  get categories() {
    return Object.keys(this.getGroupedLibrary());
  }

  getComponentsForCategory(category: string): ComponentDef[] {
    return this.getGroupedLibrary()[category];
  }
  
  onDragStart(event: DragEvent, component: ComponentDef) {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', component.id);
      
      // Optional: For custom drag image, but browsers are inconsistent
      // const dragImage = new Image();
      // dragImage.src = component.iconUrl;
      // event.dataTransfer.setDragImage(dragImage, 16, 16);
    }
  }
}