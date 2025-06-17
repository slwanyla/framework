import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AturPasswordPage } from './aturpassword.page'

describe('AturPasswordPage', () => {
  let component: AturPasswordPage;
  let fixture: ComponentFixture<AturPasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AturPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
