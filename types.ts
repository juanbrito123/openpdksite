// Added React import to provide access to the React namespace for types like ReactNode
import React from 'react';

export interface PDKOption {
  id: string;
  name: string;
  description: string;
  details: string;
  techSummary: string;
  useCases: string[];
  docsLink: string;
  mpwLink: string;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  website: string;
  installTip: string;
}

export interface FlowStep {
  id: number;
  label: string;
  description: string;
  details: string;
}

export interface ResourceLink {
  title: string;
  url: string;
  type: 'github' | 'docs' | 'community' | 'course';
  description: string;
}

export interface ContentTranslation {
  nav: {
    home: string;
    pdk: string;
    tools: string;
    flow: string;
    resources: string;
  };
  hero: {
    // Fix: Referenced React namespace requires an import of React
    title: React.ReactNode;
    description: string;
    cta: string;
  };
  intro: {
    title: string;
    description: string;
    bullets: string[];
    illustration: string;
  };
  pdkSection: {
    title: string;
    description: string;
    options: PDKOption[];
    viewDetails: string;
  };
  toolsSection: {
    title: string;
    description: string;
    tools: Tool[];
    visitSite: string;
  };
  flowSection: {
    title: string;
    description: string;
    steps: FlowStep[];
    cta: string;
  };
  resourcesSection: {
    title: string;
    description: string;
    roadmapTitle: string;
    roadmapDescription: string;
    roadmapFeatures: string[];
  };
  footer: {
    rights: string;
    contact: string;
  };
}