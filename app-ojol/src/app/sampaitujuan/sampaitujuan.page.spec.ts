import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SampaitujuanPage } from './sampaitujuan.page';

describe('SampaitujuanPage', () => {
  let component: SampaitujuanPage;
  let fixture: ComponentFixture<SampaitujuanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SampaitujuanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
