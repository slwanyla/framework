import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilkuPage } from './profilku.page';

describe('ProfilkuPage', () => {
  let component: ProfilkuPage;
  let fixture: ComponentFixture<ProfilkuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilkuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
