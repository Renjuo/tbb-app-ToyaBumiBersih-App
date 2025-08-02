import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Store {
    id: number;
    name: string;
}

interface Technician {
    id: number;
    name: string;
}

interface Props {
    stores?: Store[];
    technicians?: Technician[];
}

export default function Create({ stores = [], technicians = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        store_id: '',
        technician_id: '',
        status: '',
        date: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('maintenance.reports.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Maintenance Report" />

            <div className="min-h-screen bg-gradient-to-br from-white to-cyan-50/30">
                <div className="mx-auto px-12 py-8" style={{ maxWidth: 'calc(100vw - 100px)' }}>
                    {/* Main Content */}
                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                        {/* Form Section - Takes 2 columns on xl screens */}
                        <div className="xl:col-span-2">
                            <Card className="overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-sm">
                                <CardHeader className="border-b border-cyan-100/50 bg-gradient-to-r from-cyan-50 to-white px-8 py-6">
                                    <CardTitle className="flex items-center text-2xl font-bold text-slate-900">
                                        <svg className="mr-3 h-7 w-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        Create Maintenance Report
                                    </CardTitle>
                                    <p className="mt-2 text-slate-600">Fill in the details to create a new maintenance report for your store</p>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Store and Technician Selection */}
                                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label htmlFor="store" className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                                    <svg className="h-5 w-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                        />
                                                    </svg>
                                                    Store
                                                </Label>
                                                <Select value={data.store_id} onValueChange={(value) => setData('store_id', value)}>
                                                    <SelectTrigger
                                                        className={`h-14 rounded-xl border-2 bg-white/50 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.store_id ? 'border-red-400' : 'border-slate-200'}`}
                                                    >
                                                        <SelectValue placeholder="Select a store" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {stores.map((store) => (
                                                            <SelectItem key={store.id} value={store.id.toString()} className="py-3">
                                                                <span className="font-medium">{store.name}</span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.store_id && (
                                                    <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                        <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                        {errors.store_id}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="technician" className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                                    <svg className="h-5 w-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                    Technician
                                                </Label>
                                                <Select value={data.technician_id} onValueChange={(value) => setData('technician_id', value)}>
                                                    <SelectTrigger
                                                        className={`h-14 rounded-xl border-2 bg-white/50 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.technician_id ? 'border-red-400' : 'border-slate-200'}`}
                                                    >
                                                        <SelectValue placeholder="Select a technician" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {technicians.map((technician) => (
                                                            <SelectItem key={technician.id} value={technician.id.toString()} className="py-3">
                                                                <span className="font-medium">{technician.name}</span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.technician_id && (
                                                    <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                        <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                        {errors.technician_id}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status and Date Selection */}
                                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label htmlFor="status" className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                                    <svg className="h-5 w-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    Status
                                                </Label>
                                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                                    <SelectTrigger
                                                        className={`h-14 rounded-xl border-2 bg-white/50 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.status ? 'border-red-400' : 'border-slate-200'}`}
                                                    >
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="pending" className="py-3">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">Pending</span>
                                                                <span className="text-sm text-slate-500">Awaiting review</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="approved" className="py-3">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">Approved</span>
                                                                <span className="text-sm text-slate-500">Report approved</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="revision" className="py-3">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">Revision</span>
                                                                <span className="text-sm text-slate-500">Needs revision</span>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.status && (
                                                    <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                        <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                        {errors.status}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="date" className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                                    <svg className="h-5 w-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    Date
                                                </Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={data.date}
                                                    onChange={(e) => setData('date', e.target.value)}
                                                    className={`h-14 rounded-xl border-2 bg-white/50 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.date ? 'border-red-400' : 'border-slate-200'}`}
                                                />
                                                {errors.date && (
                                                    <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                        <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                        {errors.date}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-3">
                                            <Label htmlFor="description" className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                                <svg className="h-5 w-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                                </svg>
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Describe the maintenance issue or work performed..."
                                                className={`min-h-32 resize-none rounded-xl border-2 bg-white/50 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.description ? 'border-red-400' : 'border-slate-200'}`}
                                            />
                                            {errors.description && (
                                                <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                    <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => window.history.back()}
                                                className="h-14 rounded-xl border-2 border-slate-300 bg-white/50 text-lg transition-all duration-200 hover:border-slate-400"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-14 flex-1 rounded-xl bg-cyan-600 text-lg text-white shadow-lg transition-all duration-200 hover:bg-cyan-700 hover:shadow-xl"
                                            >
                                                {processing ? (
                                                    <>
                                                        <svg
                                                            className="mr-3 h-6 w-6 animate-spin"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                            />
                                                        </svg>
                                                        Creating Report...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                            />
                                                        </svg>
                                                        Create Report
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Preview Section */}
                        <div className="xl:col-span-1">
                            <Card className="sticky top-8 overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-sm">
                                <CardHeader className="border-b border-cyan-100/50 bg-gradient-to-r from-cyan-50 to-white px-6 py-6">
                                    <CardTitle className="flex items-center text-xl font-bold text-slate-900">
                                        <svg className="mr-2 h-6 w-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        Report Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    {data.store_id && (
                                        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/50 to-white p-6">
                                            <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                                                <svg className="h-5 w-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                    />
                                                </svg>
                                                Store
                                            </h3>
                                            <p className="font-medium text-slate-800">
                                                {stores.find((s) => s.id.toString() === data.store_id)?.name || 'Selected store'}
                                            </p>
                                        </div>
                                    )}

                                    {data.technician_id && (
                                        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/50 to-white p-6">
                                            <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                                                <svg className="h-5 w-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                Technician
                                            </h3>
                                            <p className="font-medium text-slate-800">
                                                {technicians.find((t) => t.id.toString() === data.technician_id)?.name || 'Selected technician'}
                                            </p>
                                        </div>
                                    )}

                                    {data.status && (
                                        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/50 to-white p-6">
                                            <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                                                <svg className="h-5 w-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Status
                                            </h3>
                                            <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-800 capitalize">
                                                {data.status}
                                            </span>
                                        </div>
                                    )}

                                    {data.date && (
                                        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/50 to-white p-6">
                                            <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                                                <svg className="h-5 w-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Date
                                            </h3>
                                            <p className="font-medium text-slate-800">{data.date}</p>
                                        </div>
                                    )}

                                    {!data.store_id && !data.technician_id && !data.status && !data.date && (
                                        <div className="py-12 text-center">
                                            <svg
                                                className="mx-auto mb-4 h-16 w-16 text-slate-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <p className="text-lg text-slate-500">Fill the form to see preview</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
