import { Button } from '@/components/ui/button';
import logo from '@/pages/toya.png';
import { Head, Link } from '@inertiajs/react';
import { Activity, Building2, Calendar, CheckCircle, MapPin, MessageSquare, Phone, User, Wrench, X } from 'lucide-react';
import { useState } from 'react';

// Since we don't have the actual client data from props yet,
// we'll use a dummy object for display purposes.
const dummyClient = {
    id: 1,
    name: 'Contoh Klien',
    address: 'Jl. Contoh Alamat No. 123, Jakarta',
    phone: '+62 821 1234 5678',
    created_at: '2024-01-15T10:30:00Z',
    status: 'Active',
    company: {
        id: 1,
        name: 'PT. Contoh Perusahaan',
    },
    // For individual store, set company to null
    // company: null
};

// The props interface can be defined for when the data is passed from the controller.
interface Company {
    id: number;
    name: string;
}

interface Client {
    id: number;
    name: string;
    address: string;
    phone?: string;
    created_at?: string;
    status?: string;
    company?: Company | null;
}

interface Props {
    client?: Client; // Making client optional for now
}

export default function ClientPage({ client = dummyClient }: Props) {
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        request_type: '',
    });

    const handleRequestMaintenance = () => {
        setShowRequestForm(true);
    };

    const handleSubmitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real scenario, this would trigger a post request to the server.
        // For this frontend-only task, we just show the success popup.
        setShowRequestForm(false);
        setShowSuccessPopup(true);
        // Reset form
        setFormData({
            name: '',
            phone: '',
            address: '',
            request_type: '',
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Head title={`Client Area - ${client.name}`} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
                {/* Custom Header with Client Profile */}
                <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 shadow-sm backdrop-blur-md">
                    <nav className="mx-12 flex items-center justify-between px-0 py-3">
                        <Link href={route('home')} className="flex items-center gap-3">
                            <img src={logo} alt="Toya Bumi Bersih" className="h-12 w-auto object-contain" />
                        </Link>
                        <div className="flex items-center gap-6">
                            <Link
                                href={route('companies.index')}
                                className="flex items-center gap-2 text-base font-medium text-gray-600 transition-colors hover:text-blue-600"
                            >
                                <Building2 className="h-5 w-5" />
                                Companies
                            </Link>
                            <Link
                                href={route('feedback.create')}
                                className="flex items-center gap-2 text-base font-medium text-gray-600 transition-colors hover:text-blue-600"
                            >
                                <MessageSquare className="h-5 w-5" />
                                Feedback
                            </Link>
                            {/* Client Profile */}
                            <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-white px-4 py-2 shadow-sm">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                    <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                                    <p className="text-xs text-gray-500">Client</p>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>

                {/* Main Content - Full Width with 50px spacing */}
                <main className="px-12 py-12">
                    <div className="w-full">
                        {/* Main Client Card */}
                        <div className="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl">
                            {/* Header Section with Gradient */}
                            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
                                <div className="relative z-10">
                                    <div className="mb-4">
                                        <div>
                                            <h1 className="mb-2 text-4xl font-bold text-white">
                                                Client Area: {client.name}
                                                {client.company && (
                                                    <span className="mt-2 block text-2xl font-normal text-blue-100">{client.company.name}</span>
                                                )}
                                            </h1>
                                            <p className="text-lg text-white opacity-90">Selamat datang di halaman personal Anda.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="px-8 py-8">
                                <div className="mb-8 text-center">
                                    <p className="mb-8 text-lg text-gray-700">
                                        Jika Anda mengalami kendala atau membutuhkan jadwal perawatan, silakan ajukan permintaan di bawah ini. Tim
                                        kami akan segera merespons.
                                    </p>
                                    <Button
                                        onClick={handleRequestMaintenance}
                                        className="group inline-flex h-16 transform items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-4 text-xl font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl"
                                    >
                                        <Wrench className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" />
                                        Request Maintenance
                                    </Button>
                                </div>

                                {/* Client Information Section */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="mb-6 flex items-center text-xl font-semibold text-gray-900">
                                            <Activity className="mr-3 h-6 w-6 text-blue-600" />
                                            Client Information
                                        </h3>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {/* Client Name */}
                                            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                                                <div className="mb-3 flex items-center">
                                                    <User className="mr-3 h-5 w-5 text-blue-600" />
                                                    <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">Client Name</span>
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900">{client.name}</p>
                                                <p className="mt-1 text-sm text-gray-500">Registered Client</p>
                                            </div>

                                            {/* Company Info - Only show if client has company */}
                                            {client.company && (
                                                <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                                                    <div className="mb-3 flex items-center">
                                                        <Building2 className="mr-3 h-5 w-5 text-blue-600" />
                                                        <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">Company</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-gray-900">{client.company.name}</p>
                                                    <p className="mt-1 text-sm text-gray-500">Parent Company</p>
                                                </div>
                                            )}

                                            {/* Address Info */}
                                            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                                                <div className="mb-3 flex items-center">
                                                    <MapPin className="mr-3 h-5 w-5 text-blue-600" />
                                                    <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">Address</span>
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900">{client.address}</p>
                                                <p className="mt-1 text-sm text-gray-500">Client Location</p>
                                            </div>

                                            {/* Phone Info */}
                                            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                                                <div className="mb-3 flex items-center">
                                                    <Phone className="mr-3 h-5 w-5 text-blue-600" />
                                                    <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">Phone</span>
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900">{client.phone || 'Not provided'}</p>
                                                <p className="mt-1 text-sm text-gray-500">Contact Number</p>
                                            </div>

                                            {/* Created Date */}
                                            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                                                <div className="mb-3 flex items-center">
                                                    <Calendar className="mr-3 h-5 w-5 text-blue-600" />
                                                    <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">Created</span>
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {client.created_at ? new Date(client.created_at).toLocaleDateString() : 'Unknown'}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">Registration Date</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information Cards */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Services Card */}
                            <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                                <div className="mb-4 flex items-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                        <CheckCircle className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Our Services</h3>
                                        <p className="text-sm text-gray-500">Available Services</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-700">• Regular Maintenance</p>
                                    <p className="text-sm text-gray-700">• Emergency Repairs</p>
                                    <p className="text-sm text-gray-700">• Equipment Installation</p>
                                    <p className="text-sm text-gray-700">• System Monitoring</p>
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                                <div className="mb-4 flex items-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                        <Phone className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Contact Support</h3>
                                        <p className="text-sm text-gray-500">24/7 Support</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-700">Emergency: +62 21 1234 5678</p>
                                    <p className="text-sm text-gray-700">Email: support@toyabumibersih.com</p>
                                    <p className="text-sm text-gray-700">Hours: Mon-Fri 8AM-6PM</p>
                                </div>
                            </div>

                            {/* Status Card */}
                            <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                                <div className="mb-4 flex items-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
                                        <p className="text-sm text-gray-500">Current Status</p>
                                    </div>
                                </div>
                                <p className="text-lg font-semibold text-green-600">{client.status || 'Active Client'}</p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Request Maintenance Form Modal */}
                {showRequestForm && (
                    <div className="bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black px-4 backdrop-blur-sm">
                        <div className="relative w-full max-w-2xl transform rounded-2xl bg-white shadow-2xl transition-all">
                            <button
                                onClick={() => setShowRequestForm(false)}
                                className="absolute -top-2 -right-2 z-10 rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Form Header */}
                            <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                                <h3 className="text-2xl font-bold text-white">Request Maintenance</h3>
                                <p className="mt-1 text-blue-100">Silakan isi form di bawah ini untuk mengajukan permintaan</p>
                            </div>

                            {/* Form Content */}
                            <form onSubmit={handleSubmitRequest} className="p-8">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Nama */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>

                                    {/* Nomor Telepon */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Nomor Telepon <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="Contoh: +62 821 1234 5678"
                                        />
                                    </div>
                                </div>

                                {/* Alamat */}
                                <div className="mt-6">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Alamat Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                        placeholder="Masukkan alamat lengkap"
                                    />
                                </div>

                                {/* Jenis Request */}
                                <div className="mt-6">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Jenis Permintaan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="request_type"
                                        value={formData.request_type}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                    >
                                        <option value="">Pilih jenis permintaan</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="perbaikan">Perbaikan</option>
                                        <option value="pelepasan_filter">Pelepasan Filter</option>
                                    </select>
                                </div>

                                {/* Form Actions */}
                                <div className="mt-8 flex gap-4">
                                    <Button
                                        type="button"
                                        onClick={() => setShowRequestForm(false)}
                                        className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 shadow-md transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                                    >
                                        Kirim Permintaan
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Success Popup */}
                {showSuccessPopup && (
                    <div className="bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
                        <div className="relative w-full max-w-md transform rounded-2xl bg-white p-8 text-center shadow-2xl transition-all">
                            <button
                                onClick={() => setShowSuccessPopup(false)}
                                className="absolute -top-2 -right-2 rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                            >
                                <X className="h-6 w-6" />
                            </button>
                            <CheckCircle className="mx-auto mb-5 h-20 w-20 text-green-500" />
                            <h3 className="mb-2 text-2xl font-bold text-gray-800">Berhasil!</h3>
                            <p className="mb-6 text-lg text-gray-600">Permintaan maintenance Anda telah diterima dan akan segera diproses.</p>
                            <Button
                                onClick={() => setShowSuccessPopup(false)}
                                className="h-12 w-full rounded-xl bg-green-500 text-lg text-white transition-colors hover:bg-green-600"
                            >
                                Tutup
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
