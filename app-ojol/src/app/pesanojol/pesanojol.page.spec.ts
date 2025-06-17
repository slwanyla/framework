import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PesanojolPage } from './pesanojol.page';

describe('PesanojolPage', () => {
  let component: PesanojolPage;
  let fixture: ComponentFixture<PesanojolPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PesanojolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
