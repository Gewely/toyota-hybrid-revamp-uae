import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Calculator,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Minus,
  Plus,
  Send,
  ShieldCheck,
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

type ErrorMap = Record<string, string>;
type SubmittedPayload = CrmLeadPayload & {
  success?: boolean;
  leadReferenceId?: string;
};

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
  'Sales team',
  'Delivery / light cargo',
  'Construction / site operations',
  'Staff transport',
  'Executive mobility',
  'Rental fleet',
  'Field service',
  'Mixed fleet',
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

const steps = [
  'Intro',
  'Business',
  'Usage',
  'Fleet',
  'Ownership',
  'Add-ons',
  'Estimate',
  'Lead',
  'Done',
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

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-red-600">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950 md:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-gray-600">{description}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-semibold text-gray-800">{label}</Label>
      <select
        className={cn(
          'mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100',
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
      {error && <p className="mt-1 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  error,
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-semibold text-gray-800">{label}</Label>
      <Input
        className={cn('mt-2 h-12 rounded-xl border-gray-200 shadow-sm focus-visible:ring-red-100', error && 'border-red-400')}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <p className="mt-1 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-gray-200/60 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {steps.map((label, index) => (
          <div
            key={label}
            className={cn(
              'min-w-fit rounded-full border px-4 py-2 text-xs font-bold',
              index === step && 'border-red-200 bg-red-50 text-red-700',
              index < step && 'border-gray-950 bg-gray-950 text-white',
              index > step && 'border-gray-200 bg-gray-50 text-gray-500',
            )}
          >
            {index + 1}. {label}
          </div>
        ))}
      </div>
      <div className="mt-3 h-2 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-red-600 to-gray-950 transition-all"
          style={{ width: `${Math.min(100, (step / (steps.length - 1)) * 100)}%` }}
        />
      </div>
    </div>
  );
}

function VehicleCard({
  vehicle,
  onQuantityChange,
}: {
  vehicle: RecommendedVehicle;
  onQuantityChange: (quantity: number) => void;
}) {
  return (
    <Card className="overflow-hidden rounded-3xl border-gray-200 shadow-lg shadow-gray-200/60">
      <CardContent className="p-0">
        <div className="relative h-32 bg-gradient-to-br from-gray-950 to-gray-700">
          <Badge className="absolute left-4 top-4 bg-white text-gray-950 hover:bg-white">{vehicle.category}</Badge>
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/10 px-4 py-3 text-center text-2xl font-black text-white backdrop-blur">
            {vehicle.model}
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-gray-950">{vehicle.model}</h3>
              <p className="text-sm text-gray-500">Business suitability match</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-gray-500">Starts from</p>
              <p className="font-black">{money(vehicle.startingPrice)}</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center rounded-full border border-gray-200 bg-white p-1">
              <Button size="icon" variant="ghost" onClick={() => onQuantityChange(Math.max(0, vehicle.quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-black">{vehicle.quantity}</span>
              <Button size="icon" onClick={() => onQuantityChange(vehicle.quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm font-bold text-gray-700">{money(vehicle.startingPrice / 60)}/mo</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CostBreakdown({ estimate }: { estimate: CostEstimate }) {
  return (
    <Card className="rounded-3xl border-gray-200 shadow-xl shadow-gray-200/60">
      <CardContent className="space-y-5 p-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">Estimated total</p>
          <p className="mt-2 text-4xl font-black text-gray-950">{money(estimate.totalMonthlyCost)}</p>
          <p className="text-sm text-gray-500">per month, rules-based MVP estimate</p>
        </div>

        <div className="space-y-3 border-y border-gray-100 py-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Vehicle cost</span>
            <b>{money(estimate.vehicleMonthlyCost)}/mo</b>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Optional add-ons</span>
            <b>{money(estimate.addOnsMonthlyCost)}/mo</b>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estimated vehicle value</span>
            <b>{money(estimate.totalVehicleValue)}</b>
          </div>
        </div>

        {estimate.includedItems.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-black">Included</p>
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

export default function BusinessBuilderPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<BusinessBuilderState>(defaultState);
  const [lead, setLead] = useState<LeadFormData>(emptyLead);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [payload, setPayload] = useState<SubmittedPayload | null>(null);

  const estimate = useMemo(() => estimateBusinessCost(state), [state]);
  const whatsappUrl = buildWhatsAppContinuationUrl(state, lead, estimate);

  const patchState = (patch: Partial<BusinessBuilderState>) => setState((current) => ({ ...current, ...patch }));
  const patchLead = (patch: Partial<LeadFormData>) => setLead((current) => ({ ...current, ...patch }));

  const validate = () => {
    const nextErrors: ErrorMap = {};

    if (step === 1) {
      if (!state.businessType) nextErrors.businessType = 'Required';
      if (!state.companySize) nextErrors.companySize = 'Required';
      if (!state.vehicleCount || state.vehicleCount < 1) nextErrors.vehicleCount = 'Vehicle count must be greater than zero';
      if (!state.emirate) nextErrors.emirate = 'Required';
      if (!state.industry) nextErrors.industry = 'Required';
      if (!state.purchaseTimeline) nextErrors.purchaseTimeline = 'Required';
    }

    if (step === 2) {
      if (!state.useCase) nextErrors.useCase = 'Required';
      if (!state.dailyMileage) nextErrors.dailyMileage = 'Required';
      if (!state.passengerRequirement) nextErrors.passengerRequirement = 'Required';
      if (!state.cargoRequirement) nextErrors.cargoRequirement = 'Required';
      if (!state.offRoadRequirement) nextErrors.offRoadRequirement = 'Required';
      if (!state.fuelEfficiencyPriority) nextErrors.fuelEfficiencyPriority = 'Required';
      if (!state.needHybrid) nextErrors.needHybrid = 'Required';
      if (!state.needCommercialRegistration) nextErrors.needCommercialRegistration = 'Required';
    }

    if (step === 7) {
      if (!lead.firstName) nextErrors.firstName = 'Required';
      if (!lead.lastName) nextErrors.lastName = 'Required';
      if (!lead.mobile) nextErrors.mobile = 'Required';
      if (lead.mobile && !isUaeMobile(lead.mobile)) nextErrors.mobile = 'Enter a valid UAE mobile number';
      if (!lead.email) nextErrors.email = 'Required';
      if (lead.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) nextErrors.email = 'Enter a valid email';
      if (!lead.companyName) nextErrors.companyName = 'Required';
      if (!lead.industry) nextErrors.industry = 'Required';
      if (!lead.preferredContactMethod) nextErrors.preferredContactMethod = 'Required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validate()) return;

    if (step === 0) trackBusinessBuilderEvent('business_builder_start', state);
    if (step === 1) trackBusinessBuilderEvent('business_profile_completed', state);

    if (step === 2) {
      const vehicles = recommendVehicles(state.useCase, state.vehicleCount);
      patchState({ vehicles });
      trackBusinessBuilderEvent('business_use_case_selected', { ...state, vehicles });
    }

    if (step === 3) trackBusinessBuilderEvent('recommended_models_viewed', state);
    if (step === 5) trackBusinessBuilderEvent('cost_summary_viewed', state, estimate);

    setStep((current) => Math.min(7, current + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const continueOnWhatsapp = () => {
    trackBusinessBuilderEvent('whatsapp_continue_clicked', state, estimate);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const submit = async () => {
    if (!validate()) return;

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
      setStep(8);
    } catch (error) {
      trackBusinessBuilderEvent('business_lead_submit_failed', state, estimate, {
        error: String(error),
      });
      setErrors({ submit: 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const updateVehicleQuantity = (vehicle: RecommendedVehicle, quantity: number) => {
    const vehicles = state.vehicles.map((item) => (item.model === vehicle.model ? { ...item, quantity } : item));
    patchState({
      vehicles,
      vehicleCount: vehicles.reduce((sum, item) => sum + item.quantity, 0),
    });
    trackBusinessBuilderEvent('model_quantity_updated', state, undefined, {
      model: vehicle.model,
      quantity,
    });
  };

  const toggleAddOn = (addOn: string) => {
    const included = state.ownership === 'Drive-on-Lease' && leaseIncludedItems.includes(addOn);
    if (included) return;

    const selectedAddOns = state.selectedAddOns.includes(addOn)
      ? state.selectedAddOns.filter((item) => item !== addOn)
      : [...state.selectedAddOns, addOn];

    patchState({ selectedAddOns });
    trackBusinessBuilderEvent('business_addon_selected', state, undefined, {
      add_on: addOn,
      selected: selectedAddOns.includes(addOn),
    });
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 p-8 text-white shadow-2xl md:p-12">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/30 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white text-gray-950 hover:bg-white">Build My Business Fleet</Badge>
                <Badge className="border border-white/20 bg-red-600 text-white hover:bg-red-600">Business Mobility Builder CX</Badge>
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">Toyota Business Mobility Builder</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-200 md:text-xl">
                Build a complete Toyota mobility package for your business — from vehicle selection to lease, finance, service, insurance, registration, and support.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="h-12 rounded-xl px-8" onClick={goNext}>
                  Start Building <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-white/30 bg-white/10 px-8 text-white hover:bg-white hover:text-gray-950"
                  onClick={continueOnWhatsapp}
                >
                  <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
                </Button>
                <Button size="lg" variant="ghost" className="h-12 rounded-xl px-8 text-white hover:bg-white/10 hover:text-white" asChild>
                  <a href="/">Find Vehicles for My Business</a>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ['Built for SMEs, fleets, and business owners', BriefcaseBusiness],
              ['Buy, finance, or lease', Calculator],
              ['Commercial and passenger Toyota vehicles', Truck],
              ['Service, insurance, registration, and warranty support', ShieldCheck],
              ['Proposal-ready summary', Check],
              ['Continue on WhatsApp', MessageCircle],
            ].map(([label, Icon]) => {
              const IconComponent = Icon as React.ComponentType<{ className?: string }>;

              return (
                <Card key={label as string} className="rounded-3xl border-gray-200 shadow-lg shadow-gray-200/60">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <p className="font-black text-gray-950">{label as string}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      );
    }

    if (step === 1) {
      return (
        <section>
          <SectionTitle
            eyebrow="Business profile"
            title="Tell us about your business"
            description="A few details help us shape the right fleet mix, ownership path, and support package."
          />

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <SelectField label="Business type" value={state.businessType} onChange={(value) => patchState({ businessType: value })} options={businessTypes} error={errors.businessType} />
            <SelectField label="Company size" value={state.companySize} onChange={(value) => patchState({ companySize: value })} options={companySizes} error={errors.companySize} />
            <Field label="Number of vehicles needed" type="number" value={state.vehicleCount} onChange={(value) => patchState({ vehicleCount: Number(value) })} error={errors.vehicleCount} />
            <SelectField label="Main emirate" value={state.emirate} onChange={(value) => patchState({ emirate: value })} options={emirates} error={errors.emirate} />
            <Field label="Industry" value={state.industry} onChange={(value) => patchState({ industry: value })} placeholder="e.g. Logistics, real estate, construction" error={errors.industry} />
            <SelectField label="Purchase timeline" value={state.purchaseTimeline} onChange={(value) => patchState({ purchaseTimeline: value })} options={timelines} error={errors.purchaseTimeline} />
            <SelectField label="Existing fleet" value={state.existingFleet} onChange={(value) => patchState({ existingFleet: value })} options={['Yes', 'No']} />
          </div>
        </section>
      );
    }

    if (step === 2) {
      return (
        <section>
          <SectionTitle
            eyebrow="Usage needs"
            title="What will the vehicles be used for?"
            description="Select the primary use case and usage requirements."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase) => (
              <button
                key={useCase}
                type="button"
                onClick={() => patchState({ useCase })}
                className={cn(
                  'rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-red-300 hover:shadow-xl',
                  state.useCase === useCase ? 'border-red-500 bg-red-50' : 'border-gray-200',
                )}
              >
                <Users className="mb-4 h-6 w-6 text-red-600" />
                <p className="font-black text-gray-950">{useCase}</p>
              </button>
            ))}
          </div>

          {errors.useCase && <p className="mt-2 text-sm font-medium text-red-600">{errors.useCase}</p>}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <SelectField label="Daily mileage band" value={state.dailyMileage} onChange={(value) => patchState({ dailyMileage: value })} options={['Less than 50 km/day', '50–100 km/day', '100–200 km/day', '200+ km/day']} error={errors.dailyMileage} />
            <SelectField label="Passenger requirement" value={state.passengerRequirement} onChange={(value) => patchState({ passengerRequirement: value })} options={['1–2 passengers', '3–5 passengers', '6–10 passengers', '10+ passengers']} error={errors.passengerRequirement} />
            <SelectField label="Cargo requirement" value={state.cargoRequirement} onChange={(value) => patchState({ cargoRequirement: value })} options={['None', 'Light cargo', 'Medium cargo', 'Heavy cargo']} error={errors.cargoRequirement} />
            <SelectField label="Off-road requirement" value={state.offRoadRequirement} onChange={(value) => patchState({ offRoadRequirement: value })} options={['No', 'Sometimes', 'Frequent']} error={errors.offRoadRequirement} />
            <SelectField label="Fuel efficiency priority" value={state.fuelEfficiencyPriority} onChange={(value) => patchState({ fuelEfficiencyPriority: value })} options={['Low', 'Medium', 'High']} error={errors.fuelEfficiencyPriority} />
            <SelectField label="Need hybrid?" value={state.needHybrid} onChange={(value) => patchState({ needHybrid: value })} options={['Yes', 'No', 'Not sure']} error={errors.needHybrid} />
            <SelectField label="Need commercial registration?" value={state.needCommercialRegistration} onChange={(value) => patchState({ needCommercialRegistration: value })} options={['Yes', 'No', 'Not sure']} error={errors.needCommercialRegistration} />
          </div>
        </section>
      );
    }

    if (step === 3) {
      return (
        <section>
          <SectionTitle
            eyebrow="Recommended fleet"
            title="Recommended Toyota business package"
            description="Adjust quantities before moving to ownership and estimate."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {state.vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.model} vehicle={vehicle} onQuantityChange={(quantity) => updateVehicleQuantity(vehicle, quantity)} />
            ))}
          </div>
        </section>
      );
    }

    if (step === 4) {
      return (
        <section>
          <SectionTitle
            eyebrow="Ownership"
            title="Choose how your business wants to operate"
            description="Select Buy, Finance, or Drive-on-Lease."
          />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ['Buy', 'Best for businesses that want ownership and long-term asset value.'],
              ['Finance', 'Best for businesses that want ownership with monthly payments.'],
              ['Drive-on-Lease', 'Best for predictable monthly cost with service, insurance, registration, and support included.'],
            ].map(([ownership, description]) => (
              <button
                key={ownership}
                type="button"
                onClick={() => patchState({ ownership: ownership as BusinessBuilderState['ownership'] })}
                className={cn(
                  'rounded-3xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-red-300 hover:shadow-xl',
                  state.ownership === ownership ? 'border-red-500 bg-red-50' : 'border-gray-200',
                )}
              >
                <h3 className="text-2xl font-black text-gray-950">{ownership}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
              </button>
            ))}
          </div>

          {state.ownership === 'Drive-on-Lease' && (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <SelectField label="Lease duration" value={state.leaseDuration} onChange={(value) => patchState({ leaseDuration: value })} options={['24 months', '36 months']} />
              <SelectField label="Annual mileage" value={state.annualMileage} onChange={(value) => patchState({ annualMileage: value })} options={['40,000 km', '60,000 km', '80,000 km', '100,000 km', '120,000 km']} />
            </div>
          )}
        </section>
      );
    }

    if (step === 5) {
      return (
        <section>
          <SectionTitle
            eyebrow="Business support"
            title="Add business support options"
            description="Choose support items for the proposal."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allAddOns.map((addOn) => {
              const included = state.ownership === 'Drive-on-Lease' && leaseIncludedItems.includes(addOn);
              const selected = state.selectedAddOns.includes(addOn) || included;

              return (
                <button
                  key={addOn}
                  type="button"
                  disabled={included}
                  onClick={() => toggleAddOn(addOn)}
                  className={cn(
                    'rounded-3xl border p-4 text-left shadow-sm transition',
                    included && 'border-emerald-300 bg-emerald-50 text-emerald-900',
                    !included && selected && 'border-red-500 bg-red-50',
                    !included && !selected && 'border-gray-200 bg-white hover:border-red-300',
                  )}
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-black">{addOn}</p>
                      <p className="mt-1 text-sm text-gray-500">{included ? 'Included with Drive-on-Lease' : selected ? 'Selected' : 'Optional'}</p>
                    </div>
                    {(selected || included) && <Check className="h-5 w-5 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      );
    }

    if (step === 6) {
      return (
        <section>
          <SectionTitle
            eyebrow="Estimate"
            title="Estimated Business Mobility Cost"
            description="A transparent MVP estimate before final Toyota advisor confirmation."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-gray-950 p-8 text-white shadow-2xl">
              <Calculator className="mb-8 h-10 w-10 text-red-500" />
              <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Monthly estimate</p>
              <p className="mt-3 text-5xl font-black">{money(estimate.totalMonthlyCost)}</p>
              <p className="mt-4 text-gray-300">Includes selected support items and ownership calculation.</p>
            </div>
            <CostBreakdown estimate={estimate} />
          </div>
        </section>
      );
    }

    if (step === 7) {
      return (
        <section>
          <SectionTitle
            eyebrow="Lead request"
            title="Submit your business request"
            description="Send your proposal to the Toyota Business Team."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <Card className="rounded-3xl border-gray-200 shadow-xl shadow-gray-200/60">
              <CardContent className="grid gap-5 p-6 md:grid-cols-2">
                <Field label="First name" value={lead.firstName} onChange={(value) => patchLead({ firstName: value })} error={errors.firstName} />
                <Field label="Last name" value={lead.lastName} onChange={(value) => patchLead({ lastName: value })} error={errors.lastName} />
                <Field label="Mobile number" value={lead.mobile} onChange={(value) => patchLead({ mobile: value })} placeholder="05XXXXXXXX" error={errors.mobile} />
                <Field label="Email" value={lead.email} onChange={(value) => patchLead({ email: value })} placeholder="name@company.com" error={errors.email} />
                <Field label="Company name" value={lead.companyName} onChange={(value) => patchLead({ companyName: value })} error={errors.companyName} />
                <Field label="Industry" value={lead.industry} onChange={(value) => patchLead({ industry: value })} error={errors.industry} />
                <SelectField label="Preferred contact method" value={lead.preferredContactMethod} onChange={(value) => patchLead({ preferredContactMethod: value })} options={['WhatsApp', 'Call', 'Email']} error={errors.preferredContactMethod} />
                <Field label="Existing fleet size" value={lead.existingFleetSize} onChange={(value) => patchLead({ existingFleetSize: value })} />
                <Field label="Current brand used" value={lead.currentBrand} onChange={(value) => patchLead({ currentBrand: value })} />
                <SelectField label="Need trade-in?" value={lead.needTradeIn} onChange={(value) => patchLead({ needTradeIn: value })} options={['Yes', 'No', 'Not sure']} />
                <Field label="Company website" value={lead.website} onChange={(value) => patchLead({ website: value })} />
                <Field label="VAT/TRN number" value={lead.trn} onChange={(value) => patchLead({ trn: value })} />
                <div className="md:col-span-2">
                  <Label className="text-sm font-semibold text-gray-800">Comments optional</Label>
                  <Textarea className="mt-2 min-h-28 rounded-xl border-gray-200 shadow-sm focus-visible:ring-red-100" value={lead.comments} onChange={(event) => patchLead({ comments: event.target.value })} />
                </div>
              </CardContent>
            </Card>

            <CostBreakdown estimate={estimate} />
          </div>
        </section>
      );
    }

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
          <Card className="rounded-3xl border-gray-200 shadow-lg shadow-gray-200/60">
            <CardContent className="space-y-4 p-6">
              <div className="flex justify-between rounded-2xl bg-gray-50 p-4">
                <span className="text-gray-500">Lead score</span>
                <b>{payload?.leadScore}</b>
              </div>
              <div className="flex justify-between rounded-2xl bg-gray-50 p-4">
                <span className="text-gray-500">Assigned team</span>
                <b>{payload?.routingTeam}</b>
              </div>
              <div className="flex justify-between rounded-2xl bg-gray-50 p-4">
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
  };

  return (
    <ToyotaLayout activeNavItem="business">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.12),transparent_32%),linear-gradient(180deg,#f9fafb_0%,#ffffff_45%,#f3f4f6_100%)] pb-32 md:pb-16">
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
          <div className="mb-5 flex flex-col gap-3 rounded-3xl border border-red-100 bg-white/80 p-4 shadow-lg shadow-red-100/40 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">Recreated premium experience</p>
              <p className="mt-1 text-sm text-gray-600">
                A guided B2B journey with live estimate, fleet summary, CRM payload, WhatsApp continuation, and analytics hooks.
              </p>
            </div>
            <Badge className="w-fit bg-gray-950 text-white hover:bg-gray-950">Business Mobility Builder CX</Badge>
          </div>

          <Stepper step={step} />

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_320px]">
            <main className="min-w-0">{renderStep()}</main>

            {step > 0 && step < 8 && (
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
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Vehicles</span>
                    <b>{state.vehicleCount}</b>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Ownership</span>
                    <b>{state.ownership}</b>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Use case</span>
                    <b className="text-right">{state.useCase || 'Pending'}</b>
                  </div>
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
            )}
          </div>

          {errors.submit && <p className="mt-4 text-sm font-medium text-red-600">{errors.submit}</p>}

          {step > 0 && step < 8 && (
            <div className="mt-10 hidden items-center justify-between md:flex">
              <Button variant="outline" className="rounded-xl" onClick={goBack}>
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>

              <div className="flex items-center gap-4">
                <div className="hidden text-right lg:block">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Current estimate</p>
                  <p className="font-black text-gray-950">{money(estimate.totalMonthlyCost)}/mo</p>
                </div>
                <Button className="rounded-xl px-8" onClick={step === 7 ? submit : goNext} disabled={submitting}>
                  {step === 7 ? (submitting ? 'Submitting...' : 'Submit request') : 'Continue'} <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </section>

        {step > 0 && step < 8 && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
            <div className="mb-2 flex items-center justify-between px-1 text-xs">
              <span className="font-semibold text-gray-500">Estimated monthly</span>
              <span className="font-black text-gray-950">{money(estimate.totalMonthlyCost)}</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-12 flex-1 rounded-xl" onClick={goBack}>
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button className="h-12 flex-1 rounded-xl" onClick={step === 7 ? submit : goNext} disabled={submitting}>
                {step === 7 ? 'Submit' : 'Continue'} <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToyotaLayout>
  );
}
