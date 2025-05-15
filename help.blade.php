@extends('layouts.app')

@section('title', 'Pusat Bantuan')
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

@section('styles')
<style>
    body {
        background-color: #f2f0ea;
        margin: 0;
        padding: 0;
    }

    .mobile-container {
        width: 100%;
        max-width: 420px;
        margin: 0 auto;
        border-radius: 20px;
        overflow: hidden;
        font-family: 'Arial', sans-serif;
        background-color: white;
        min-height: 100vh;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        position: relative;
        padding-bottom: 70px; /* ruang untuk bottom nav */
    }

    .header {
        background-color: #192b5d;
        color: white;
        padding: 1.5rem;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        text-align: center;
    }

    .profile-pic {
        width: 80px;
        height: 80px;
        background-color: white;
        border-radius: 50%;
        margin: 0 auto 0.5rem auto;
    }

    .profile-info {
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .section-title {
        padding: 1rem 1rem 0.5rem 1rem;
        font-weight: bold;
    }

    .menu-list {
        padding: 0 1rem;
    }

    .menu-item {
        display: flex;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #ddd;
        cursor: pointer;
    }

    .menu-item i {
        font-size: 1.3rem;
        margin-right: 1rem;
        color: #000;
        width: 25px;
    }

    .menu-item span {
        flex: 1;
        font-weight: bold;
        color: #000;
    }

    .menu-item .arrow {
        color: #000;
    }

    .bottom-nav {
        display: flex;
        justify-content: space-around;
        background-color: #192b5d;
        padding: 0.8rem 0;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        max-width: 420px;
        margin: 0 auto;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .bottom-nav a {
        text-decoration: none;
        color: inherit;
        flex: 1;
    }

    .bottom-nav div {
        text-align: center;
    }

    .bottom-nav i {
        color: white;
        font-size: 1.2rem;
    }

    .bottom-nav span {
        font-size: 0.75rem;
        color: white;
        display: block;
    }
</style>
@endsection

@section('content')
<div class="mobile-container">
    <div class="header">
        <div class="profile-pic">
            @if(Auth::user()->profile_picture)
                <img src="{{ asset('storage/' . Auth::user()->profile_picture) }}" alt="Foto Profil" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
             @else
                <img src="{{ asset('default/profile.png') }}" alt="Default" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
            @endif
        </div>

        <div class="profile-info">
            <strong>{{ Auth::user()->username ?? 'Username' }}</strong><br>
            {{ Auth::user()->email ?? 'email@example.com' }}<br>
            {{ Auth::user()->phone ?? '+62xxxxxxxxx' }}
        </div>
        <a href="{{ route('profile.edit') }}" style="position: absolute; top: 10px; right: 10px;">
        <i class="bi bi-pencil-fill" style="color: white; font-size: 1.2rem;"></i>
    </a>
    </div>

    <div class="section-title">Akun</div>
    <div class="menu-list">
        <div class="menu-item">
            <i class="bi bi-clock-history"></i>
            <span>Aktivitasku</span>
            <i class="bi bi-chevron-right arrow"></i>
        </div>
        <div class="menu-item">
            <i class="bi bi-bookmark-fill"></i>
            <span>Alamat Favorite</span>
            <i class="bi bi-chevron-right arrow"></i>
        </div>
        <div class="menu-item">
            <i class="bi bi-headset"></i>
            <span>Pusat Bantuan</span>
            <i class="bi bi-chevron-right arrow"></i>
        </div>
        <div class="menu-item">
            <i class="bi bi-bell-fill"></i>
            <span>Notifikasi</span>
            <i class="bi bi-chevron-right arrow"></i>
        </div>
        <div class="menu-item">
            <i class="bi bi-box-arrow-right"></i>
            <span>Logout</span>
            <i class="bi bi-chevron-right arrow"></i>
        </div>
    </div>
</div>

<div class="bottom-nav">
    <a href="{{ route('home') }}">
        <div>
            <i class="bi bi-house-door-fill"></i>
            <span>Beranda</span>
        </div>
    </a>
    <a href="{{ route('aktivitas') }}">
        <div>
            <i class="bi bi-journal-text"></i>
            <span>Aktivitas</span>
        </div>
    </a>
    <a href="{{ route('help') }}">
        <div>
            <i class="bi bi-gear-fill"></i>
            <span>Help</span>
        </div>
    </a>
</div>
@endsection
