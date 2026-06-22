import type { CrmLeadPayload } from '@/utils/businessMobility/types';

const requiredFields: Array<keyof CrmLeadPayload> = [
  'leadType',
  'companyName',
  'businessType',
  'emirate',
  'fleetSizeRequired',
  'useCase',
  'ownershipPreference',
  'customerFirstName',
  'customerLastName',
  'mobile',
  'email',
];

// Mock POST /api/business-mobility-lead handler contract for the MVP.
// TODO: Replace this stub with the real Toyota C4C/CRM integration endpoint.
// TODO: Move validation to the production API boundary and never expose secrets in client code.
export async function postBusinessMobilityLead(payload: CrmLeadPayload) {
  const missing = requiredFields.filter((field) => !payload[field]);

  if (missing.length || payload.fleetSizeRequired <= 0) {
    return {
      status: 400,
      body: { success: false, error: 'Missing required lead values', missing },
    };
  }

  if (import.meta.env.DEV) {
    console.info('[Mock API] POST /api/business-mobility-lead', payload);
  }

  return {
    status: 200,
    body: { success: true, leadReferenceId: `BMB-${Date.now()}` },
  };
}
