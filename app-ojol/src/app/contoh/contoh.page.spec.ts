import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContohPage } from './contoh.page';

describe('ContohPage', () => {
  let component: ContohPage;
  let fixture: ComponentFixture<ContohPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContohPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
