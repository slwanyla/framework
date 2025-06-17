import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenudriverPage } from './menudriver.page';

describe('MenudriverPage', () => {
  let component: MenudriverPage;
  let fixture: ComponentFixture<MenudriverPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenudriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
