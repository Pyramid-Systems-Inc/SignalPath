import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ComponentPaletteComponent } from './component-palette/component-palette.component';
import { CanvasComponent } from './canvas/canvas.component';
import { PropertiesPanelComponent } from './properties-panel/properties-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ComponentPaletteComponent,
    CanvasComponent,
    PropertiesPanelComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}