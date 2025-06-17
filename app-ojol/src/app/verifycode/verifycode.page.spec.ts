import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifycodePage } from './verifycode.page';

describe('VerifycodePage', () => {
  let component: VerifycodePage;
  let fixture: ComponentFixture<VerifycodePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifycodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
