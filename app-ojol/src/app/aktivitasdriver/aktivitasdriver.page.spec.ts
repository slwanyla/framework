import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AktivitasdriverPage } from './aktivitasdriver.page';

describe('AktivitasdriverPage', () => {
  let component: AktivitasdriverPage;
  let fixture: ComponentFixture<AktivitasdriverPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AktivitasdriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
