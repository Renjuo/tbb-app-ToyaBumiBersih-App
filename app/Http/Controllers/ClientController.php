<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Company;
use App\Models\Store;
use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ClientController extends Controller
{
    /**
     * Display a listing of the clients.
     */
    public function index(Request $request)
    {
        $query = Client::with(['company', 'store']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhereHas('company', function ($companyQuery) use ($search) {
                      $companyQuery->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('store', function ($storeQuery) use ($search) {
                      $storeQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by company
        if ($request->has('company_id') && $request->company_id) {
            $query->where('company_id', $request->company_id);
        }

        // Filter by store
        if ($request->has('store_id') && $request->store_id) {
            $query->where('store_id', $request->store_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $clients = $query->orderBy('name')
                        ->paginate(15);

        $companies = Company::orderBy('name')->get(['id', 'name']);
        $stores = Store::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Client/Index', [
            'clients' => $clients,
            'companies' => $companies,
            'stores' => $stores,
            'filters' => $request->only(['search', 'company_id', 'store_id', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new client.
     */
    public function create()
    {
        $companies = Company::orderBy('name')->get(['id', 'name']);
        $stores = Store::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Client/Create', [
            'companies' => $companies,
            'stores' => $stores
        ]);
    }

    /**
     * Store a newly created client in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'company_id' => 'required|exists:companies,id',
            'store_id' => 'required|exists:stores,id',
            'status' => 'nullable|in:active,inactive,suspended'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                           ->withErrors($validator)
                           ->withInput();
        }

        $client = Client::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'company_id' => $request->company_id,
            'store_id' => $request->store_id,
            'status' => $request->status ?? 'active'
        ]);

        return redirect()->route('clients.index')
                        ->with('success', 'Client created successfully.');
    }

    /**
     * Display the specified client.
     */
    public function show(Client $client)
    {
        $client->load(['company', 'store']);

        // Get maintenance requests for this client
        $maintenanceRequests = MaintenanceRequest::where('client_id', $client->id)
                                                ->orderBy('created_at', 'desc')
                                                ->limit(5)
                                                ->get();

        return Inertia::render('Client/Show', [
            'client' => $client,
            'maintenanceRequests' => $maintenanceRequests
        ]);
    }

    /**
     * Show the form for editing the specified client.
     */
    public function edit(Client $client)
    {
        $companies = Company::orderBy('name')->get(['id', 'name']);
        $stores = Store::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Client/Edit', [
            'client' => $client,
            'companies' => $companies,
            'stores' => $stores
        ]);
    }

    /**
     * Update the specified client in storage.
     */
    public function update(Request $request, Client $client)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'nullable',
                'email',
                Rule::unique('clients')->ignore($client->id)
            ],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'company_id' => 'required|exists:companies,id',
            'store_id' => 'required|exists:stores,id',
            'status' => 'nullable|in:active,inactive,suspended'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                           ->withErrors($validator)
                           ->withInput();
        }

        $client->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'company_id' => $request->company_id,
            'store_id' => $request->store_id,
            'status' => $request->status ?? 'active'
        ]);

        return redirect()->route('clients.show', $client)
                        ->with('success', 'Client updated successfully.');
    }

    /**
     * Remove the specified client from storage.
     */
    public function destroy(Client $client)
    {
        try {
            // Check if client has any related maintenance requests
            $maintenanceRequestsCount = MaintenanceRequest::where('client_id', $client->id)->count();
            
            if ($maintenanceRequestsCount > 0) {
                return redirect()->back()
                               ->with('error', 'Cannot delete client. Client has associated maintenance requests.');
            }

            $client->delete();

            return redirect()->route('clients.index')
                            ->with('success', 'Client deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                           ->with('error', 'Error deleting client: ' . $e->getMessage());
        }
    }

    /**
     * Handle maintenance request from client.
     */
    public function requestMaintenance(Request $request, Client $client)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'nullable|string|max:1000',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'type' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $maintenanceRequest = MaintenanceRequest::create([
                'client_id' => $client->id,
                'company_id' => $client->company_id,
                'store_id' => $client->store_id,
                'description' => $request->description ?? 'General maintenance request',
                'priority' => $request->priority ?? 'medium',
                'type' => $request->type ?? 'general',
                'status' => 'pending',
                'requested_by' => Auth::id(),
                'requested_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Laporan Anda telah diterima',
                'request_id' => $maintenanceRequest->id
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error submitting maintenance request: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show client profile (for authenticated client to see their own data).
     */
    public function showProfile()
    {
        $user = Auth::user();
        
        // Assuming there's a relationship between User and Client
        // You might need to adjust this based on your actual model relationships
        $client = Client::where('email', $user->email)->first();
        
        if (!$client) {
            return redirect()->route('dashboard')
                           ->with('error', 'Client profile not found.');
        }

        $client->load(['company', 'store']);

        // Get maintenance requests for this client
        $maintenanceRequests = MaintenanceRequest::where('client_id', $client->id)
                                                ->orderBy('created_at', 'desc')
                                                ->limit(10)
                                                ->get();

        return Inertia::render('Client/Profile', [
            'client' => $client,
            'maintenanceRequests' => $maintenanceRequests
        ]);
    }

    /**
     * Get clients by company (API endpoint for dynamic dropdowns).
     */
    public function getByCompany(Request $request)
    {
        $companyId = $request->get('company_id');
        
        if (!$companyId) {
            return response()->json([]);
        }

        $clients = Client::where('company_id', $companyId)
                        ->where('status', 'active')
                        ->orderBy('name')
                        ->get(['id', 'name', 'email']);

        return response()->json($clients);
    }

    /**
     * Get clients by store (API endpoint for dynamic dropdowns).
     */
    public function getByStore(Request $request)
    {
        $storeId = $request->get('store_id');
        
        if (!$storeId) {
            return response()->json([]);
        }

        $clients = Client::where('store_id', $storeId)
                        ->where('status', 'active')
                        ->orderBy('name')
                        ->get(['id', 'name', 'email']);

        return response()->json($clients);
    }

    public function showClientPage()
    {
        return Inertia::render('Client/Index');
    }
}