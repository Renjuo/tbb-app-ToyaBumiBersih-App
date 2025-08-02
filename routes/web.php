<?php

// File: routes/web.php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia; // Pastikan Inertia di-import jika digunakan secara langsung
use Illuminate\Support\Facades\Auth; // Import Auth facade

// Import Controllers Anda
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\ClientController; // Added ClientController
use App\Http\Controllers\MaintenanceScheduleController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\AuthController;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Controllers\FilterQRController;
use App\Http\Controllers\StoreQRController;
use App\Http\Controllers\MaintenanceController;




// use App\Http\Controllers\DashboardController; // Uncomment jika Anda punya DashboardController

Route::get('/', function () {
    // Jika pengguna sudah login, mungkin arahkan ke dashboard
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    // Jika belum, tampilkan halaman welcome
    return Inertia::render('welcome'); // Asumsi Anda menggunakan Inertia
})->name('home');

// Halaman Tentang Kami (Public)
Route::get('/about', function () {
    return Inertia::render('about'); // nama file: resources/js/pages/about.tsx
})->name('about');

// Grup rute yang memerlukan pengguna untuk login dan terverifikasi (jika menggunakan verifikasi email)
Route::middleware(['auth', 'verified'])->group(function () {




    Route::get('/dashboard', function () {
        // Debug information
        $user = auth()->user();
        \Log::info('User roles:', $user->getRoleNames()->toArray());
        \Log::info('User permissions:', $user->getAllPermissions()->pluck('name')->toArray());

        return Inertia::render('dashboard');
    })->name('dashboard');

    // Rute untuk super-admin
    Route::middleware(['role:super-admin'])->group(function () {
        Route::resource('companies', CompanyController::class);
        Route::resource('stores', StoreController::class);
        Route::resource('clients', ClientController::class); // Added clients resource
        Route::resource('feedback', FeedbackController::class);
    });

    // Rute untuk super-admin dan Admin
    Route::middleware(['role:super-admin|admin'])->group(function () {
        Route::resource('companies', CompanyController::class);
        Route::resource('stores', StoreController::class);
        Route::resource('clients', ClientController::class); // Added clients resource
        Route::resource('users', UserController::class);

        // QR Code Routes
        Route::get('/stores/qrcodes', [StoreQRController::class, 'index'])->name('stores.qrcodes.index');
        Route::get('/stores/{store}/qrcodes', function ($store) {
            return Inertia::render('admin/stores/[id]/qr-codes', ['storeId' => $store]);
        })->name('stores.qrcodes.store');

        // Filter QR Routes
        Route::get('/FilterQR', [FilterQRController::class, 'index'])->name('FilterQR.index');
        Route::get('/FilterQR/create', [FilterQRController::class, 'create'])->name('FilterQR.create');
        Route::post('/FilterQR', [FilterQRController::class, 'store'])->name('FilterQR.store');
        Route::get('/FilterQR/{filterQR}', [FilterQRController::class, 'show'])->name('FilterQR.show');
        Route::put('/FilterQR/{filterQR}', [FilterQRController::class, 'update'])->name('FilterQR.update');
        Route::delete('/FilterQR/{filterQR}', [FilterQRController::class, 'destroy'])->name('FilterQR.destroy');
        Route::get('/FilterQR/{filterQR}/download', [FilterQRController::class, 'download'])->name('FilterQR.download');
        Route::get('/FilterQR/{filterQR}/edit', [FilterQRController::class, 'edit'])->name('FilterQR.edit');
        Route::post('/FilterQR/{filterQR}/revision', [FilterQRController::class, 'requestRevision'])->name('FilterQR.revision');

        // Maintenance Report Routes
        Route::get('/maintenancereport', [App\Http\Controllers\MaintenanceController::class, 'index'])->name('maintenance.reports.index');
        Route::get('/maintenancereport/create', function () {
            return Inertia::render('maintenancereport/Create', [
                'stores' => \App\Models\Store::orderBy('name')->get(['id', 'name'])
            ]);
        })->name('maintenance.reports.create');
        Route::post('/maintenancereport', [MaintenanceController::class, 'store'])->name('maintenance.reports.store');
        Route::get('/maintenancereport/{report}', function ($report) {
            return Inertia::render('maintenancereport/Show', [
                'report' => $report,
                'canApprove' => auth()->user()->hasRole(['super-admin', 'admin'])
            ]);
        })->name('maintenance.reports.show');
        Route::put('/maintenancereport/{report}', [MaintenanceController::class, 'update'])->name('maintenance.reports.update');
        Route::delete('/maintenancereport/{report}', [MaintenanceController::class, 'destroy'])->name('maintenance.reports.destroy');
        Route::post('/maintenancereport/{report}/approve', [MaintenanceController::class, 'approve'])->name('maintenance.reports.approve');
        Route::post('/maintenancereport/{report}/revision', [MaintenanceController::class, 'requestRevision'])->name('maintenance.reports.revision');

        // Client specific routes for maintenance requests
        Route::post('/clients/{client}/maintenance-request', [ClientController::class, 'requestMaintenance'])->name('client.maintenance.request');
    });

    // Rute untuk maintenance schedule (super-admin, admin, dan technician)
    Route::middleware(['role:super-admin|admin|technician'])->group(function () {
        Route::resource('schedules', MaintenanceScheduleController::class);
        Route::post('/FilterQR/scan', [FilterQRController::class, 'scan'])->name('FilterQR.scan');
        Route::post('/stores/{store}/maintenancereports', [MaintenanceController::class, 'store'])->name('maintenance.reports.store.by.store');
    });

    // Rute untuk super-admin, admin, dan technician
    Route::middleware(['role:super-admin|admin|technician'])->group(function () {
        Route::resource('inventory', InventoryItemController::class);
    });

    // Rute untuk semua role yang sudah login (including client access)
    Route::middleware(['auth'])->group(function () {
        Route::resource('feedback', FeedbackController::class);
        
        // Client dapat melihat data mereka sendiri
        Route::get('/my-profile', [ClientController::class, 'showProfile'])->name('clients.profile');
        
        // Routes untuk navigasi dari client page
        Route::get('/companies/{company}', [CompanyController::class, 'show'])->name('companies.show');
        Route::get('/feedbacks', [FeedbackController::class, 'index'])->name('feedbacks.index');
        Route::get('/client', [ClientController::class, 'showClientPage'])->name('client.page');
    });


    // Maintenance routes

});

// Memuat file rute autentikasi (login, register, dll.)
// Pastikan path ini benar dan file auth.php berisi definisi rute untuk AuthenticatedSessionController, dll.
require __DIR__ . '/auth.php';

// Memuat file rute settings jika ada
if (file_exists(__DIR__ . '/settings.php')) {
    require __DIR__ . '/settings.php';
}