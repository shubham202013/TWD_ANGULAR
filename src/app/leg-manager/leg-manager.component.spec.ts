import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegManagerComponent } from './leg-manager.component';

describe('LegManagerComponent', () => {
  let component: LegManagerComponent;
  let fixture: ComponentFixture<LegManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
