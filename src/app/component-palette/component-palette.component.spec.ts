import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentPaletteComponent } from './component-palette.component';

describe('ComponentPaletteComponent', () => {
  let component: ComponentPaletteComponent;
  let fixture: ComponentFixture<ComponentPaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentPaletteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComponentPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
