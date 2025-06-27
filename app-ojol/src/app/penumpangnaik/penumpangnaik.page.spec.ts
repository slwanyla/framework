import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PenumpangnaikPage } from './penumpangnaik.page';

describe('PenumpangnaikPage', () => {
  let component: PenumpangnaikPage;
  let fixture: ComponentFixture<PenumpangnaikPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PenumpangnaikPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
