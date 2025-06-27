import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'splashscreen',
    pathMatch: 'full'
  },
  {
    path: 'splashscreen',
    loadChildren: () => import('./splashscreen/splashscreen.module').then( m => m.SplashscreenPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'verifycode',
    loadChildren: () => import('./verifycode/verifycode.module').then( m => m.VerifycodePageModule)
  },
  {
    path: 'beranda',
    loadChildren: () => import('./beranda/beranda.module').then( m => m.BerandaPageModule)
  },
  {
    path: 'aktivitas',
    loadChildren: () => import('./aktivitas/aktivitas.module').then( m => m.AktivitasPageModule)
  },
  {
    path: 'profilku',
    loadChildren: () => import('./profilku/profilku.module').then( m => m.ProfilkuPageModule)
  },
  {
    path: 'ubahprofil',
    loadChildren: () => import('./ubahprofil/ubahprofil.module').then( m => m.UbahprofilPageModule)
  },
  {
    path: 'pesanojol',
    loadChildren: () => import('./pesanojol/pesanojol.module').then( m => m.PesanojolPageModule)
  },
  {
    path: 'detailpemesanan',
    loadChildren: () => import('./detailpemesanan/detailpemesanan.module').then( m => m.DetailpemesananPageModule)
  },
  {
    path: 'dapatdriver',
    loadChildren: () => import('./dapatdriver/dapatdriver.module').then( m => m.DapatdriverPageModule)
  },
  {
    path: 'sampaitujuan',
    loadChildren: () => import('./sampaitujuan/sampaitujuan.module').then( m => m.SampaitujuanPageModule)
  },
  {
    path: 'notifikasi',
    loadChildren: () => import('./notifikasi/notifikasi.module').then( m => m.NotifikasiPageModule)
  },
  {
    path: 'menunggudriver',
    loadChildren: () => import('./menunggudriver/menunggudriver.module').then( m => m.MenunggudriverPageModule)
  },
  {
    path: 'aturpassword',
    loadChildren: () => import('./aturpassword/aturpassword.page').then( m => m.AturPasswordPage)
  },
  {
    path: 'pusatbantuan',
    loadChildren: () => import('./pusatbantuan/pusatbantuan.module').then( m => m.PusatbantuanPageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },
  {
    path: 'menudriver',
    loadChildren: () => import('./menudriver/menudriver.module').then( m => m.MenudriverPageModule)
  },
  {
    path: 'profildriver',
    loadChildren: () => import('./profildriver/profildriver.module').then( m => m.ProfildriverPageModule)
  },
  {
    path: 'ubahprofildriver',
    loadChildren: () => import('./ubahprofildriver/ubahprofildriver.module').then( m => m.UbahprofildriverPageModule)
  },
  {
    path: 'pengaturandriver',
    loadChildren: () => import('./pengaturandriver/pengaturandriver.module').then( m => m.PengaturandriverPageModule)
  },
  {
    path: 'aktivitasdriver',
    loadChildren: () => import('./aktivitasdriver/aktivitasdriver.module').then( m => m.AktivitasdriverPageModule)
  },
  {
    path: 'pendapatan',
    loadChildren: () => import('./pendapatan/pendapatan.module').then( m => m.PendapatanPageModule)
  },
  {
    path: 'jemputpenumpang',
    loadChildren: () => import('./jemputpenumpang/jemputpenumpang.module').then( m => m.JemputpenumpangPageModule)
  },
  {
    path: 'penumpangnaik',
    loadChildren: () => import('./penumpangnaik/penumpangnaik.module').then( m => m.PenumpangnaikPageModule)
  },
  {
    path: 'riwayatlayanan',
    loadChildren: () => import('./riwayatlayanan/riwayatlayanan.module').then( m => m.RiwayatlayananPageModule)
  },
  {
    path: 'hubungiadmin',
    loadChildren: () => import('./hubungiadmin/hubungiadmin.module').then( m => m.HubungiadminPageModule)
  },
  {
    path: 'tujuanakhir',
    loadChildren: () => import('./tujuanakhir/tujuanakhir.module').then( m => m.TujuanakhirPageModule)
  },
  {
    path: 'ringkasanorder',
    loadChildren: () => import('./ringkasanorder/ringkasanorder.module').then( m => m.RingkasanorderPageModule)
  },
  {
    path: 'contoh',
    loadChildren: () => import('./contoh/contoh.module').then( m => m.ContohPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
