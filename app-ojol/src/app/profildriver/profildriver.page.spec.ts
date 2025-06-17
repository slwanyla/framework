import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfildriverPage } from './profildriver.page';

describe('ProfildriverPage', () => {
  let component: ProfildriverPage;
  let fixture: ComponentFixture<ProfildriverPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfildriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
