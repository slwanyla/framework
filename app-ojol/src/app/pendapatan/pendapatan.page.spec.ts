import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendapatanPage } from './pendapatan.page';

describe('PendapatanPage', () => {
  let component: PendapatanPage;
  let fixture: ComponentFixture<PendapatanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PendapatanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
