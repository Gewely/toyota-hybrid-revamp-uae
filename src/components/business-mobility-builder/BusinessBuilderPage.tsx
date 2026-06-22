import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Calculator,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Gauge,
  MessageCircle,
  Minus,
  Plus,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from 'lucide-react';
import ToyotaLayout from '@/components/ToyotaLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { estimateBusinessCost, leaseIncludedItems } from '@/utils/businessMobility/costEstimator';
import { mapToCrmPayload, submitBusinessMobilityLead } from '@/utils/businessMobility/crmPayloadMapper';
import { trackBusinessBuilderEvent } from '@/utils/businessMobility/analytics';
import { recommendVehicles } from '@/utils/businessMobility/vehicleRecommendations';
import { buildWhatsAppContinuationUrl } from '@/utils/businessMobility/whatsappContinuation';
import {
  BusinessBuilderState,
  CostEstimate,
  CrmLeadPayload,
  LeadFormData,
  RecommendedVehicle,
} from '@/utils/businessMobility/types';

type StatePatch = Partial<BusinessBuilderState>;
type LeadPatch = Partial<LeadFormData>;
type ErrorMap = Record<string, string>;
type FieldKey = keyof BusinessBuilderState;
type LeadKey = keyof LeadFormData;
type SubmittedPayload = CrmLeadPayload & { success?: boolean; leadReferenceId?: string };

const steps = [
  { label: 'Intro', icon: Sparkles },
  { label: 'Business', icon: BriefcaseBusiness },
  { label: 'Usage', icon: Route },
  { label: 'Vehicles', icon: Truck },
  { label: 'Ownership', icon: BadgeCheck },
  { label: 'Add-ons', icon: ShieldCheck },
  { label: 'Estimate', icon: Calculator },
  { label: 'Proposal', icon: FileText },
  { label: 'Lead', icon: Send },
];

const businessTypes = [
  'SME',
  'Corporate fleet',
  'Delivery / logistics',
  'Construction',
  'Real estate',
  'Rental company',
  'Government',
  'School / transport',
  'Hospitality',
  'Field service',
  'Personal business owner',
];
const companySizes = ['1–10 employees', '11–50 employees', '51–200 employees', '200+ employees'];
const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
const timelines = ['Immediately', 'Within 30 days', '1–3 months', '3+ months', 'Researching only'];
const useCases = [
  { label: 'Sales team', icon: Users, description: 'Efficient sedans for high-mileage business travel.' },
  { label: 'Delivery / light cargo', icon: Truck, description: 'Compact cargo-ready mobility for daily operations.' },
  { label: 'Construction / site operations', icon: Gauge, description: 'Durable vehicles for sites, payloads, and rough roads.' },
  { label: 'Staff transport', icon: Users, description: 'Passenger-focused solutions for company transport.' },
  { label: 'Executive mobility', icon: BadgeCheck, description: 'Comfort-led premium mobility for leadership teams.' },
  { label: 'Rental fleet', icon: ClipboardCheck, description: 'Reliable, easy-to-operate fleet-ready Toyota models.' },
  { label: 'Field service', icon: ShieldCheck, description: 'Practical commercial vehicles for technicians and support.' },
  { label: 'Mixed fleet', icon: Route, description: 'A balanced package across passenger and commercial needs.' },
];
const allAddOns = [
  'Service maintenance contract',
  'Extended warranty',
  'Insurance',
  'Registration support',
  'Rustproofing',
  'Paint protection film',
  'Ceramic coating',
  'Window tinting',
  'Branding / wrapping',
  'Replacement vehicle',
  'Roadside recovery',
  'Driver safety kit',
  'Telematics / tracking',
];

const defaultState: BusinessBuilderState = {
  businessType: '',
  companySize: '',
  vehicleCount: 1,
  emirate: '',
  industry: '',
  purchaseTimeline: '',
  existingFleet: '',
  useCase: '',
  dailyMileage: '',
  passengerRequirement: '',
  cargoRequirement: '',
  offRoadRequirement: '',
  fuelEfficiencyPriority: '',
  needHybrid: '',
  needCommercialRegistration: '',
  vehicles: [],
  ownership: 'Not sure',
  leaseDuration: '36 months',
  annualMileage: '60,000 km',
  selectedAddOns: ['Service maintenance contract', 'Insurance', 'Registration support', 'Roadside recovery'],
};

const emptyLead: LeadFormData = {
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  companyName: '',
  industry: '',
  preferredContactMethod: 'WhatsApp',
  comments: '',
  tradeLicense: '',
  existingFleetSize: '',
  currentBrand: '',
  needTradeIn: '',
  website: '',
  trn: '',
};

const money = (value: number) => `AED ${Math.round(value).toLocaleString()}`;
const isUaeMobile = (value: string) => /^(\+971|00971|971|0)?5[0-9]{8}$/.test(value.replace(/[\s-]/g, ''));

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  helper?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-gray-800">{label}</Label>
      <select
        className={cn(
          'h-12 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition focus:border-[hsl(var(--toyota-red))] focus:outline-none focus:ring-4 focus:ring-red-100',
          error ? 'border-red-400' : 'border-gray-200',
        )}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      {helper && !error && <p className="text-xs text-gray-500">{helper}</p>}
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  error,
  helper,
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  helper?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-gray-800">{label}</Label>
      <Input
        className={cn(
          'h-12 rounded-xl border-gray-200 bg-white shadow-sm transition focus-visible:ring-red-100',
          error && 'border-red-400',
        )}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {helper && !error && <p className="text-xs text-gray-500">{helper}</p>}
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-red-600">{eyebrow}</p>}
      <h2 className="text-3xl font-black tracking-tight text-gray-950 md:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">{description}</p>}
    </div>
  );
}

export function Stepper({ step }: { step: number }) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-3 shadow-xl shadow-gray-200/60 backdrop-blur md:p-5">
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {steps.map(({ label, icon: Icon }, index) => {
          const active = index === step;
          const complete = index < step;
          return (
            <div key={label} className="flex min-w-fit items-center gap-3">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-2 transition',
                  active && 'border-red-200 bg-red-50 text-red-700 shadow-sm',
                  complete && 'border-gray-900 bg-gray-950 text-white',
                  !active && !complete && 'border-gray-200 bg-gray-50 text-gray-500',
                )}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/80 text-xs font-black text-gray-950">
                  {complete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <span className="hidden text-xs font-bold sm:inline">{label}</span>
              </div>
              {index < steps.length - 1 && <span className="h-px w-6 bg-gray-200" />}
            </div>
          );
        })}
      </div>
      <div className="mt-3 h-2 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-red-600 to-gray-950 transition-all duration-500"
          style={{ width: `${Math.min(100, (step / 8) * 100)}%` }}
        />
      </div>
    </div>
  );
}

function ChoiceCard({
  active,
  children,
  onClick,
  className,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group rounded-[1.5rem] border bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-xl hover:shadow-red-100/60 focus:outline-none focus:ring-4 focus:ring-red-100',
        active ? 'border-red-500 bg-gradient-to-br from-red-50 to-white shadow-lg shadow-red-100' : 'border-gray-200',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function VehicleCard({ vehicle, onQty }: { vehicle: RecommendedVehicle; onQty: (quantity: number) => void }) {
  return (
    <Card className="overflow-hidden rounded-[1.75rem] border-gray-200 bg-white shadow-lg shadow-gray-200/50 transition hover:-translate-y-1 hover:shadow-2xl">
      <CardContent className="p-0">
        <div className="relative h-36 overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.16),transparent_35%),linear-gradient(135deg,#111827,#374151)]">
          <div className="absolute inset-x-6 bottom-5 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-center text-3xl font-black tracking-tight text-white backdrop-blur">
            {vehicle.model}
          </div>
          <Badge className="absolute left-5 top-5 bg-white text-gray-950 hover:bg-white">{vehicle.category}</Badge>
        </div>
        <div className="space-y-5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-gray-950">{vehicle.model}</h3>
              <p className="mt-1 text-sm text-gray-500">Business suitability match</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-gray-500">Starts from</p>
              <p className="font-black text-gray-950">{money(vehicle.startingPrice)}</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-gray-600">{vehicle.reason}</p>
          <div className="flex flex-wrap gap-2">
            {vehicle.businessTags.map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {tag}
              </span>
            ))}
          </div>
          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">MVP monthly placeholder</span>
              <span className="font-black text-gray-950">{money(vehicle.startingPrice / 60)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between rounded-full border border-gray-200 bg-white p-1 shadow-sm">
              <Button size="icon" variant="ghost" onClick={() => onQty(Math.max(0, vehicle.quantity - 1))} aria-label={`Decrease ${vehicle.model} quantity`}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-lg font-black">{vehicle.quantity}</span>
              <Button size="icon" onClick={() => onQty(vehicle.quantity + 1)} aria-label={`Increase ${vehicle.model} quantity`}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Replace</Button>
              <Button variant="outline" size="sm">Details</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AddOnCard({
  name,
  selected,
  included,
  onClick,
}: {
  name: string;
  selected: boolean;
  included: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={included}
      onClick={onClick}
      className={cn(
        'rounded-[1.35rem] border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-red-100',
        included && 'border-emerald-300 bg-emerald-50 text-emerald-900',
        !included && selected && 'border-red-500 bg-red-50 text-red-900 shadow-md shadow-red-100',
        !included && !selected && 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-red-300 hover:shadow-lg',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-black">{name}</div>
          <div className="mt-1 text-sm text-gray-500">
            {included ? 'Included with Drive-on-Lease' : selected ? 'Selected for proposal' : 'Optional business support'}
          </div>
        </div>
        {(selected || included) && <Check className="h-5 w-5 text-red-600" />}
      </div>
    </button>
  );
}

export function CostBreakdown({ estimate }: { estimate: CostEstimate }) {
  return (
    <Card className="rounded-[1.75rem] border-gray-200 bg-white shadow-xl shadow-gray-200/60">
      <CardContent className="space-y-5 p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Estimated total</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-gray-950">{money(estimate.totalMonthlyCost)}</p>
          <p className="text-sm text-gray-500">per month, rules-based MVP estimate</p>
        </div>
        <div className="grid gap-3 border-y border-gray-100 py-4">
          <div className="flex justify-between gap-4">
            <span className="text-gray-600">Vehicle cost</span>
            <b>{money(estimate.vehicleMonthlyCost)}/mo</b>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600">Optional add-ons</span>
            <b>{money(estimate.addOnsMonthlyCost)}/mo</b>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600">One-time vehicle value</span>
            <b>{money(estimate.totalVehicleValue)}</b>
          </div>
        </div>
        {estimate.includedItems.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-black text-gray-900">Included</p>
            <div className="flex flex-wrap gap-2">
              {estimate.includedItems.map((item) => (
                <Badge key={item} variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <p className="rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-500">
          Final pricing, availability, approvals, lease terms, and fleet discounts will be confirmed by a Toyota business advisor.
        </p>
      </CardContent>
    </Card>
  );
}

export function StickyJourneyCTA({
  step,
  onBack,
  onNext,
  nextLabel = 'Next',
  estimate,
}: {
  step: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  estimate: CostEstimate;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
      <div className="mb-2 flex items-center justify-between px-1 text-xs">
        <span className="font-semibold text-gray-500">Estimated monthly</span>
        <span className="font-black text-gray-950">{money(estimate.totalMonthlyCost)}</span>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="h-12 flex-1 rounded-xl" onClick={onBack} disabled={step === 0}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <Button className="h-12 flex-1 rounded-xl" onClick={onNext}>
          {nextLabel} <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function BusinessProfileStep({ state, setState, errors }: { state: BusinessBuilderState; setState: (patch: StatePatch) => void; errors: ErrorMap }) {
  return (
    <section>
      <SectionHeader
        eyebrow="Business profile"
        title="Tell us about your business"
        description="A few details help us shape the right fleet mix, ownership path, and support package."
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <SelectField label="Business type" value={state.businessType} onChange={(value) => setState({ businessType: value })} options={businessTypes} error={errors.businessType} />
        <SelectField label="Company size" value={state.companySize} onChange={(value) => setState({ companySize: value })} options={companySizes} error={errors.companySize} />
        <Field label="Number of vehicles needed" type="number" value={state.vehicleCount} onChange={(value) => setState({ vehicleCount: Number(value) })} error={errors.vehicleCount} helper="You can fine-tune quantities in the recommendation step." />
        <SelectField label="Main emirate" value={state.emirate} onChange={(value) => setState({ emirate: value })} options={emirates} error={errors.emirate} />
        <Field label="Industry" value={state.industry} onChange={(value) => setState({ industry: value })} error={errors.industry} placeholder="e.g. Logistics, real estate, construction" />
        <SelectField label="Purchase timeline" value={state.purchaseTimeline} onChange={(value) => setState({ purchaseTimeline: value })} options={timelines} error={errors.purchaseTimeline} />
        <SelectField label="Existing fleet" value={state.existingFleet} onChange={(value) => setState({ existingFleet: value })} options={['Yes', 'No']} helper="Optional, but useful for your advisor." />
      </div>
    </section>
  );
}

function UsageNeedStep({ state, setState, errors }: { state: BusinessBuilderState; setState: (patch: StatePatch) => void; errors: ErrorMap }) {
  return (
    <section>
      <SectionHeader
        eyebrow="Usage needs"
        title="What will the vehicles be used for?"
        description="Select the primary use case. The recommendation engine will build a Toyota fleet mix around it."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {useCases.map(({ label, icon: Icon, description }) => (
          <ChoiceCard key={label} active={state.useCase === label} onClick={() => setState({ useCase: label })}>
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gray-950 text-white transition group-hover:bg-red-600">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-black text-gray-950">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
          </ChoiceCard>
        ))}
      </div>
      {errors.useCase && <p className="mt-3 text-sm font-medium text-red-600">{errors.useCase}</p>}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <SelectField label="Daily mileage band" value={state.dailyMileage} onChange={(value) => setState({ dailyMileage: value })} options={['Less than 50 km/day', '50–100 km/day', '100–200 km/day', '200+ km/day']} error={errors.dailyMileage} />
        <SelectField label="Passenger requirement" value={state.passengerRequirement} onChange={(value) => setState({ passengerRequirement: value })} options={['1–2 passengers', '3–5 passengers', '6–10 passengers', '10+ passengers']} error={errors.passengerRequirement} />
        <SelectField label="Cargo requirement" value={state.cargoRequirement} onChange={(value) => setState({ cargoRequirement: value })} options={['None', 'Light cargo', 'Medium cargo', 'Heavy cargo']} error={errors.cargoRequirement} />
        <SelectField label="Off-road requirement" value={state.offRoadRequirement} onChange={(value) => setState({ offRoadRequirement: value })} options={['No', 'Sometimes', 'Frequent']} error={errors.offRoadRequirement} />
        <SelectField label="Fuel efficiency priority" value={state.fuelEfficiencyPriority} onChange={(value) => setState({ fuelEfficiencyPriority: value })} options={['Low', 'Medium', 'High']} error={errors.fuelEfficiencyPriority} />
        <SelectField label="Need hybrid?" value={state.needHybrid} onChange={(value) => setState({ needHybrid: value })} options={['Yes', 'No', 'Not sure']} error={errors.needHybrid} />
        <SelectField label="Need commercial registration?" value={state.needCommercialRegistration} onChange={(value) => setState({ needCommercialRegistration: value })} options={['Yes', 'No', 'Not sure']} error={errors.needCommercialRegistration} />
      </div>
    </section>
  );
}

function VehicleRecommendationStep({ state, setState }: { state: BusinessBuilderState; setState: (patch: StatePatch) => void }) {
  const updateQuantity = (vehicle: RecommendedVehicle, quantity: number) => {
    const vehicles = state.vehicles.map((item) => (item.model === vehicle.model ? { ...item, quantity } : item));
    setState({ vehicles, vehicleCount: vehicles.reduce((sum, item) => sum + item.quantity, 0) });
    trackBusinessBuilderEvent('model_quantity_updated', state, undefined, { model: vehicle.model, quantity });
  };

  return (
    <section>
      <SectionHeader
        eyebrow="Recommended fleet mix"
        title="Recommended Toyota business package"
        description={`A proposal-ready starting point for ${state.useCase || 'your business'} with adjustable model quantities.`}
      />
      <div className="mt-6 rounded-[1.75rem] border border-red-100 bg-red-50/70 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black text-gray-950">Recommendation logic applied</p>
            <p className="text-sm text-gray-600">Adjust quantities now. Replacement and details actions are placeholders for Phase 2 catalogue integration.</p>
          </div>
          <Badge className="w-fit bg-red-600 text-white hover:bg-red-600">{state.vehicleCount} vehicles selected</Badge>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {state.vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.model} vehicle={vehicle} onQty={(quantity) => updateQuantity(vehicle, quantity)} />
        ))}
      </div>
    </section>
  );
}

function OwnershipOptionStep({ state, setState }: { state: BusinessBuilderState; setState: (patch: StatePatch) => void }) {
  const options: Array<{ name: BusinessBuilderState['ownership']; description: string; highlight: string }> = [
    { name: 'Buy', description: 'Best for businesses that want ownership and long-term asset value.', highlight: 'Asset ownership' },
    { name: 'Finance', description: 'Best for businesses that want ownership with monthly payments.', highlight: 'Monthly payments' },
    { name: 'Drive-on-Lease', description: 'Best for predictable monthly cost with service, insurance, registration, and support included.', highlight: 'All-in support' },
  ];

  return (
    <section>
      <SectionHeader eyebrow="Ownership" title="Choose how your business wants to operate" description="Compare the operating model before your estimate is calculated." />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {options.map((option) => (
          <ChoiceCard
            key={option.name}
            active={state.ownership === option.name}
            onClick={() => {
              setState({ ownership: option.name });
              trackBusinessBuilderEvent('ownership_option_selected', { ...state, ownership: option.name });
            }}
          >
            <Badge variant="outline" className="mb-4 border-gray-200 bg-gray-50 text-gray-700">{option.highlight}</Badge>
            <h3 className="text-2xl font-black text-gray-950">{option.name}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">{option.description}</p>
          </ChoiceCard>
        ))}
      </div>
      {state.ownership === 'Drive-on-Lease' && (
        <div className="mt-8 rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-lg shadow-gray-200/60">
          <div className="grid gap-5 md:grid-cols-2">
            <SelectField label="Lease duration" value={state.leaseDuration} onChange={(value) => setState({ leaseDuration: value })} options={['24 months', '36 months']} />
            <SelectField label="Annual mileage" value={state.annualMileage} onChange={(value) => setState({ annualMileage: value })} options={['40,000 km', '60,000 km', '80,000 km', '100,000 km', '120,000 km']} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {['Service and maintenance', 'Insurance', 'Registration management', 'Breakdown and recovery', 'Fine/toll administration'].map((item) => (
              <div key={item} className="rounded-2xl bg-gray-50 p-4 text-sm font-semibold text-gray-700">
                <Check className="mb-2 h-4 w-4 text-red-600" /> {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function AddOnsStep({ state, setState }: { state: BusinessBuilderState; setState: (patch: StatePatch) => void }) {
  return (
    <section>
      <SectionHeader eyebrow="Business support" title="Add business support options" description="Select services that make fleet operation easier for your team." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allAddOns.map((addOn) => {
          const included = state.ownership === 'Drive-on-Lease' && leaseIncludedItems.includes(addOn);
          const selected = state.selectedAddOns.includes(addOn) || included;
          return (
            <AddOnCard
              key={addOn}
              name={addOn}
              selected={selected}
              included={included}
              onClick={() => {
                const selectedAddOns = selected ? state.selectedAddOns.filter((item) => item !== addOn) : [...state.selectedAddOns, addOn];
                setState({ selectedAddOns });
                trackBusinessBuilderEvent('business_addon_selected', state, undefined, { add_on: addOn, selected: !selected });
              }}
            />
          );
        })}
      </div>
    </section>
  );
}

function CostEstimateStep({ estimate }: { estimate: CostEstimate }) {
  return (
    <section>
      <SectionHeader eyebrow="Business mobility cost" title="Estimated Business Mobility Cost" description="A transparent MVP estimate to help your team compare operating scenarios before Toyota confirms final pricing." />
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] bg-gray-950 p-7 text-white shadow-2xl">
          <Calculator className="mb-8 h-10 w-10 text-red-500" />
          <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Monthly estimate</p>
          <p className="mt-3 text-5xl font-black tracking-tight">{money(estimate.totalMonthlyCost)}</p>
          <p className="mt-4 leading-7 text-gray-300">Includes selected support items and your chosen ownership calculation.</p>
        </div>
        <CostBreakdown estimate={estimate} />
      </div>
    </section>
  );
}

function ProposalSummaryStep({ state, estimate, onWhatsapp }: { state: BusinessBuilderState; estimate: CostEstimate; onWhatsapp: () => void }) {
  const summaryRows = [
    ['Business type', state.businessType],
    ['Industry', state.industry],
    ['Emirate', state.emirate],
    ['Number of vehicles', String(state.vehicleCount)],
    ['Use case', state.useCase],
    ['Ownership preference', state.ownership],
    ['Lease duration', state.ownership === 'Drive-on-Lease' ? `${state.leaseDuration} / ${state.annualMileage}` : 'N/A'],
    ['Purchase timeline', state.purchaseTimeline],
  ];

  return (
    <section>
      <SectionHeader eyebrow="Proposal" title="Your Toyota Business Mobility Proposal" description="A clean package summary that is ready for Toyota business advisor follow-up." />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[1.75rem] border-gray-200 shadow-lg shadow-gray-200/60">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {summaryRows.map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
                  <p className="mt-1 font-black text-gray-950">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-gray-100 p-4">
              <p className="mb-3 font-black text-gray-950">Recommended vehicles</p>
              <div className="flex flex-wrap gap-2">
                {state.vehicles.map((vehicle) => (
                  <Badge key={vehicle.model} variant="outline" className="border-gray-200 bg-white text-gray-700">
                    {vehicle.model} x{vehicle.quantity}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button>Submit to Toyota Business Team</Button>
              <Button variant="outline">Edit package</Button>
              <Button variant="outline" onClick={onWhatsapp}>
                <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
              </Button>
              <Button variant="ghost">Download summary placeholder</Button>
              <Button variant="ghost">Email summary placeholder</Button>
            </div>
          </CardContent>
        </Card>
        <CostBreakdown estimate={estimate} />
      </div>
    </section>
  );
}

function LeadCaptureStep({
  lead,
  setLead,
  errors,
  onSubmit,
  submitting,
}: {
  lead: LeadFormData;
  setLead: (patch: LeadPatch) => void;
  errors: ErrorMap;
  onSubmit: () => void;
  submitting: boolean;
}) {
  return (
    <section>
      <SectionHeader eyebrow="Lead request" title="Submit your business request" description="Send your proposal details to the Toyota Business Team for a tailored follow-up." />
      <div className="mt-8 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-xl shadow-gray-200/60 md:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="First name" value={lead.firstName} onChange={(value) => setLead({ firstName: value })} error={errors.firstName} />
          <Field label="Last name" value={lead.lastName} onChange={(value) => setLead({ lastName: value })} error={errors.lastName} />
          <Field label="Mobile number" value={lead.mobile} onChange={(value) => setLead({ mobile: value })} error={errors.mobile} placeholder="05XXXXXXXX" />
          <Field label="Email" value={lead.email} onChange={(value) => setLead({ email: value })} error={errors.email} placeholder="name@company.com" />
          <Field label="Company name" value={lead.companyName} onChange={(value) => setLead({ companyName: value })} error={errors.companyName} />
          <Field label="Industry" value={lead.industry} onChange={(value) => setLead({ industry: value })} error={errors.industry} />
          <SelectField label="Preferred contact method" value={lead.preferredContactMethod} onChange={(value) => setLead({ preferredContactMethod: value })} options={['WhatsApp', 'Call', 'Email']} error={errors.preferredContactMethod} />
          <Field label="Trade license upload placeholder" value={lead.tradeLicense} onChange={(value) => setLead({ tradeLicense: value })} helper="Phase 2 upload integration." />
          <Field label="Existing fleet size" value={lead.existingFleetSize} onChange={(value) => setLead({ existingFleetSize: value })} />
          <Field label="Current brand used" value={lead.currentBrand} onChange={(value) => setLead({ currentBrand: value })} />
          <SelectField label="Need trade-in?" value={lead.needTradeIn} onChange={(value) => setLead({ needTradeIn: value })} options={['Yes', 'No', 'Not sure']} />
          <Field label="Company website" value={lead.website} onChange={(value) => setLead({ website: value })} />
          <Field label="VAT/TRN number" value={lead.trn} onChange={(value) => setLead({ trn: value })} />
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold text-gray-800">Comments optional</Label>
            <Textarea className="min-h-28 rounded-xl border-gray-200 shadow-sm focus-visible:ring-red-100" value={lead.comments} onChange={(event) => setLead({ comments: event.target.value })} />
          </div>
        </div>
        <Button className="mt-7 h-12 rounded-xl px-8" disabled={submitting} onClick={onSubmit}>
          <Send className="h-4 w-4" /> {submitting ? 'Submitting...' : 'Submit your business request'}
        </Button>
      </div>
    </section>
  );
}

function ConfirmationStep({ payload, estimate, whatsappUrl }: { payload: SubmittedPayload | null; estimate: CostEstimate; whatsappUrl: string }) {
  return (
    <section>
      <div className="rounded-[2rem] bg-gradient-to-br from-gray-950 to-gray-800 p-8 text-white shadow-2xl md:p-12">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-red-600">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="mt-8 text-4xl font-black tracking-tight md:text-6xl">Your request has been submitted</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-300">
          Thank you. Your Toyota Business Mobility request has been received. A Toyota business advisor will contact you with a tailored proposal.
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[1.75rem] border-gray-200 shadow-lg shadow-gray-200/60">
          <CardContent className="space-y-4 p-6">
            <div className="flex justify-between gap-4 rounded-2xl bg-gray-50 p-4">
              <span className="text-gray-500">Lead score</span>
              <b>{payload?.leadScore}</b>
            </div>
            <div className="flex justify-between gap-4 rounded-2xl bg-gray-50 p-4">
              <span className="text-gray-500">Assigned team</span>
              <b>{payload?.routingTeam}</b>
            </div>
            <div className="flex justify-between gap-4 rounded-2xl bg-gray-50 p-4">
              <span className="text-gray-500">Reference</span>
              <b>{payload?.leadReferenceId || 'Generated'}</b>
            </div>
            <Button className="w-full rounded-xl" asChild>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
        <CostBreakdown estimate={estimate} />
      </div>
    </section>
  );
}

function ExecutiveSummary({ state, estimate }: { state: BusinessBuilderState; estimate: CostEstimate }) {
  return (
    <aside className="sticky top-24 hidden self-start rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-2xl shadow-gray-200/70 backdrop-blur xl:block">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gray-950 text-white">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
        <div>
          <p className="font-black text-gray-950">Live package</p>
          <p className="text-sm text-gray-500">Updates as you build</p>
        </div>
      </div>
      <div className="mt-5 rounded-3xl bg-gradient-to-br from-red-600 to-gray-950 p-5 text-white">
        <p className="text-sm text-white/70">Estimated monthly</p>
        <p className="mt-1 text-3xl font-black">{money(estimate.totalMonthlyCost)}</p>
      </div>
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4"><span className="text-gray-500">Vehicles</span><b>{state.vehicleCount}</b></div>
        <div className="flex justify-between gap-4"><span className="text-gray-500">Ownership</span><b>{state.ownership}</b></div>
        <div className="flex justify-between gap-4"><span className="text-gray-500">Use case</span><b className="text-right">{state.useCase || 'Pending'}</b></div>
      </div>
      <div className="mt-5 border-t border-gray-100 pt-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Recommended models</p>
        <div className="flex flex-wrap gap-2">
          {state.vehicles.length > 0 ? (
            state.vehicles.map((vehicle) => (
              <Badge key={vehicle.model} variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
                {vehicle.model} x{vehicle.quantity}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-gray-500">Complete usage needs to generate recommendations.</p>
          )}
        </div>
      </div>
    </aside>
  );
}

function LandingStep({ onStart, onWhatsapp }: { onStart: () => void; onWhatsapp: () => void }) {
  const cards = [
    ['Built for SMEs, fleets, and business owners', BriefcaseBusiness],
    ['Buy, finance, or lease', BadgeCheck],
    ['Commercial and passenger Toyota vehicles', Truck],
    ['Service, insurance, registration, and warranty support', ShieldCheck],
    ['Proposal-ready summary', FileText],
    ['Continue on WhatsApp', MessageCircle],
  ] as const;

  return (
    <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 p-8 text-white shadow-2xl md:p-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/30 blur-3xl" />
        <div className="absolute -bottom-28 left-8 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <Badge className="bg-white text-gray-950 hover:bg-white">Build My Business Fleet</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">Toyota Business Mobility Builder</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-200 md:text-xl">
            Build a complete Toyota mobility package for your business — from vehicle selection to lease, finance, service, insurance, registration, and support.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-12 rounded-xl px-8" onClick={onStart}>
              Start Building <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 rounded-xl border-white/30 bg-white/10 px-8 text-white hover:bg-white hover:text-gray-950" onClick={onWhatsapp}>
              <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {cards.map(([label, Icon]) => (
          <Card key={label} className="rounded-[1.5rem] border-gray-200 bg-white/90 shadow-lg shadow-gray-200/60 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-black text-gray-950">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default function BusinessBuilderPage() {
  const [step, setStep] = useState(0);
  const [state, setWholeState] = useState<BusinessBuilderState>(defaultState);
  const [lead, setWholeLead] = useState<LeadFormData>(emptyLead);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [payload, setPayload] = useState<SubmittedPayload | null>(null);

  const estimate = useMemo(() => estimateBusinessCost(state), [state]);
  const whatsappUrl = buildWhatsAppContinuationUrl(state, lead, estimate);
  const setState = (patch: StatePatch) => setWholeState((current) => ({ ...current, ...patch }));
  const setLead = (patch: LeadPatch) => setWholeLead((current) => ({ ...current, ...patch }));

  const requireStateFields = (fields: FieldKey[], nextErrors: ErrorMap) => {
    fields.forEach((field) => {
      if (!state[field]) nextErrors[field] = 'Required';
    });
  };

  const requireLeadFields = (fields: LeadKey[], nextErrors: ErrorMap) => {
    fields.forEach((field) => {
      if (!lead[field]) nextErrors[field] = 'Required';
    });
  };

  const validateStep = () => {
    const nextErrors: ErrorMap = {};
    if (step === 1) {
      requireStateFields(['businessType', 'companySize', 'emirate', 'industry', 'purchaseTimeline'], nextErrors);
      if (!state.vehicleCount || state.vehicleCount < 1) nextErrors.vehicleCount = 'Vehicle count must be greater than zero';
    }
    if (step === 2) {
      requireStateFields(['useCase', 'dailyMileage', 'passengerRequirement', 'cargoRequirement', 'offRoadRequirement', 'fuelEfficiencyPriority', 'needHybrid', 'needCommercialRegistration'], nextErrors);
    }
    if (step === 8) {
      requireLeadFields(['firstName', 'lastName', 'mobile', 'email', 'companyName', 'industry', 'preferredContactMethod'], nextErrors);
      if (lead.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) nextErrors.email = 'Enter a valid email';
      if (lead.mobile && !isUaeMobile(lead.mobile)) nextErrors.mobile = 'Enter a valid UAE mobile number';
      if (state.vehicleCount < 1) nextErrors.vehicleCount = 'Vehicle count must be greater than zero';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (step === 0) trackBusinessBuilderEvent('business_builder_start', state);
    if (step === 1) trackBusinessBuilderEvent('business_profile_completed', state);
    if (step === 2) {
      const vehicles = recommendVehicles(state.useCase, state.vehicleCount);
      setState({ vehicles });
      trackBusinessBuilderEvent('business_use_case_selected', { ...state, vehicles });
    }
    if (step === 3) trackBusinessBuilderEvent('recommended_models_viewed', state);
    if (step === 6) trackBusinessBuilderEvent('cost_summary_viewed', state, estimate);
    if (step === 7) trackBusinessBuilderEvent('proposal_summary_viewed', state, estimate);
    setStep((current) => Math.min(8, current + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const crmPayload = mapToCrmPayload(state, lead, estimate);
      const result = await submitBusinessMobilityLead(crmPayload);
      const submittedPayload = { ...crmPayload, ...result };
      setPayload(submittedPayload);
      trackBusinessBuilderEvent('business_lead_submitted', state, estimate, {
        lead_score: crmPayload.leadScore,
        routing_team: crmPayload.routingTeam,
      });
      setStep(9);
    } catch (error) {
      trackBusinessBuilderEvent('business_lead_submit_failed', state, estimate, { error: String(error) });
      setErrors({ submit: 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const continueOnWhatsapp = () => {
    trackBusinessBuilderEvent('whatsapp_continue_clicked', state, estimate);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const stepContent = () => {
    switch (step) {
      case 0:
        return <LandingStep onStart={goNext} onWhatsapp={continueOnWhatsapp} />;
      case 1:
        return <BusinessProfileStep state={state} setState={setState} errors={errors} />;
      case 2:
        return <UsageNeedStep state={state} setState={setState} errors={errors} />;
      case 3:
        return <VehicleRecommendationStep state={state} setState={setState} />;
      case 4:
        return <OwnershipOptionStep state={state} setState={setState} />;
      case 5:
        return <AddOnsStep state={state} setState={setState} />;
      case 6:
        return <CostEstimateStep estimate={estimate} />;
      case 7:
        return <ProposalSummaryStep state={state} estimate={estimate} onWhatsapp={continueOnWhatsapp} />;
      case 8:
        return <LeadCaptureStep lead={lead} setLead={setLead} errors={errors} onSubmit={submit} submitting={submitting} />;
      default:
        return <ConfirmationStep payload={payload} estimate={estimate} whatsappUrl={whatsappUrl} />;
    }
  };

  return (
    <ToyotaLayout activeNavItem="business">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.12),transparent_32%),linear-gradient(180deg,#f9fafb_0%,#ffffff_45%,#f3f4f6_100%)] pb-32 md:pb-16">
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
          <Stepper step={Math.min(step, 8)} />
          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_320px]">
            <main className="min-w-0">{stepContent()}</main>
            {step > 0 && step < 9 && <ExecutiveSummary state={state} estimate={estimate} />}
          </div>
          {errors.submit && <p className="mt-4 text-sm font-medium text-red-600">{errors.submit}</p>}
          {step > 0 && step < 9 && (
            <div className="mt-10 hidden items-center justify-between md:flex">
              <Button variant="outline" className="rounded-xl" onClick={goBack}>
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <div className="flex items-center gap-4">
                <div className="hidden text-right lg:block">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Current estimate</p>
                  <p className="font-black text-gray-950">{money(estimate.totalMonthlyCost)}/mo</p>
                </div>
                <Button className="rounded-xl px-8" onClick={step === 8 ? submit : goNext} disabled={submitting}>
                  {step === 8 ? 'Submit request' : 'Continue'} <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </section>
        {step > 0 && step < 9 && (
          <StickyJourneyCTA step={step} onBack={goBack} onNext={step === 8 ? submit : goNext} nextLabel={step === 8 ? 'Submit' : 'Continue'} estimate={estimate} />
        )}
      </div>
    </ToyotaLayout>
  );
}
