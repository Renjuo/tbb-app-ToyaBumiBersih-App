<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil role yang sudah dibuat oleh RolesAndPermissionsSeeder
        $superAdminRole = Role::where('name', 'super-admin')->first();
        $adminRole = Role::where('name', 'admin')->first();
        $teknisiRole = Role::where('name', 'technician')->first();
        $clientRole = Role::where('name', 'client')->first();

        if (!$superAdminRole || !$adminRole || !$teknisiRole || !$clientRole) {
            $this->command->error('Satu atau lebih role (super-admin, admin, teknisi, client) tidak ditemukan. Pastikan RolesAndPermissionsSeeder dijalankan terlebih dahulu.');
            return;
        }

        // Buat user super admin
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('superadmin123'),
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole($superAdminRole);

        // Buat user admin
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole($adminRole);

        // Buat user teknisi
        $teknisi = User::create([
            'name' => 'Teknisi',
            'email' => 'teknisi@example.com',
            'password' => Hash::make('teknisi123'),
            'email_verified_at' => now(),
        ]);
        $teknisi->assignRole($teknisiRole);

        // Buat user client
        $client = User::create([
            'name' => 'Client',
            'email' => 'client@example.com',
            'password' => Hash::make('client123'),
            'email_verified_at' => now(),
        ]);
        $client->assignRole($clientRole);
    }
} 