import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface HospitalTenant {
  id: string;
  name: string;
  code: string;
  location: string;
  tier: string;
}

export const HOSPITALS: HospitalTenant[] = [
  { id: "hosp-main-tenant-001", name: "Metro General Hospital", code: "MGH", location: "Mumbai Central", tier: "Tertiary Care" },
  { id: "hosp-delhi-002", name: "Apollo Specialty Healthcare", code: "ASH", location: "Delhi NCR", tier: "Super Specialty" },
  { id: "hosp-blr-003", name: "Fortis Memorial Institute", code: "FMI", location: "Bangalore", tier: "Multi Specialty" },
];

interface TenantContextType {
  currentHospital: HospitalTenant;
  setHospital: (hospital: HospitalTenant) => void;
  hospitals: HospitalTenant[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentHospital, setCurrentHospital] = useState<HospitalTenant>(() => {
    try {
      const saved = localStorage.getItem("hospital_active_tenant");
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = HOSPITALS.find((h) => h.id === parsed.id);
        if (match) return match;
      }
    } catch (e) {
      // ignore
    }
    return HOSPITALS[0];
  });

  const setHospital = (h: HospitalTenant) => {
    setCurrentHospital(h);
    try {
      localStorage.setItem("hospital_active_tenant", JSON.stringify(h));
    } catch (e) {
      // ignore
    }
  };

  return (
    <TenantContext.Provider value={{ currentHospital, setHospital, hospitals: HOSPITALS }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
