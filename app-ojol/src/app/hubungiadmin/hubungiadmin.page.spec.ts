import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubungiadminPage } from './hubungiadmin.page';

describe('HubungiadminPage', () => {
  let component: HubungiadminPage;
  let fixture: ComponentFixture<HubungiadminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HubungiadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
