import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PusatbantuanPage } from './pusatbantuan.page';

describe('PusatbantuanPage', () => {
  let component: PusatbantuanPage;
  let fixture: ComponentFixture<PusatbantuanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PusatbantuanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
