import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricaldataComponent } from './historicaldata.component';

describe('HistoricaldataComponent', () => {
  let component: HistoricaldataComponent;
  let fixture: ComponentFixture<HistoricaldataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricaldataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricaldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
