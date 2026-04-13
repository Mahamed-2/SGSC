"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth, useStore } from "@/lib/store/useStore";
import type { AuthUser } from "@/types";

interface DemoContextType {
  isDemoMode: boolean;
  activePersona: string;
  toggleDemoMode: () => void;
  setPersona: (personaId: string) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const PERSONAS = {
  admin: {
    id: "admin-1",
    name: "Ibrahim Al-Zahrani",
    role: "SystemAdmin",
    email: "admin@clubos.sa",
  },
  coach: {
    id: "coach-1",
    name: "Sultan Al-Shahrani",
    role: "Coach",
    email: "s.shahrani@alfaisalyfc.net",
  },
  board: {
    id: "board-1",
    name: "Faisal Al-Dawsari",
    role: "ExecutiveDirector",
    email: "f.dawsari@alfaisalyfc.net",
  },
};

/**
 * DemoProvider — Seamlessly toggles the platform between LIVE and DEMO data.
 * Persists the demo state and handles persona (role) spoofing for sales showcases.
 */
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activePersona, setActivePersona] = useState("admin");
  const { setAuth, clearAuth } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("clubos_demo_mode");
    if (saved === "true") setIsDemoMode(true);
  }, []);

  const toggleDemoMode = () => {
    const newVal = !isDemoMode;
    setIsDemoMode(newVal);
    localStorage.setItem("clubos_demo_mode", String(newVal));
    
    if (newVal) {
      // Auto-login as Demo Admin when toggling on
      setPersona("admin");
    } else {
      clearAuth();
    }
  };

  const setPersona = (personaId: string) => {
    setActivePersona(personaId);
    const persona = PERSONAS[personaId as keyof typeof PERSONAS];
    if (persona) {
      setAuth(persona as any, "demo-mock-token-" + personaId);
    }
  };

  return (
    <DemoContext.Provider value={{ isDemoMode, activePersona, toggleDemoMode, setPersona }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used within a DemoProvider");
  return context;
}
