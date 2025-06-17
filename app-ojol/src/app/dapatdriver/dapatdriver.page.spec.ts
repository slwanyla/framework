import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DapatdriverPage } from './dapatdriver.page';

describe('DapatdriverPage', () => {
  let component: DapatdriverPage;
  let fixture: ComponentFixture<DapatdriverPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DapatdriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
