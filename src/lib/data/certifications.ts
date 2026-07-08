// Certification data

import { Certification } from '@/lib/types';

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'cka',
    name: 'Certified Kubernetes Administrator',
    file: '/certs/CKA_Cert.pdf',
    image: '/images/kubernetes-cka.svg',
    earned: 'Jun 2024',
    expires: '2026-06-26',
    verifyUrl: 'https://www.credly.com/badges/6fb906d2-66a0-4f00-8803-69458e122ad1/public_url',
  },
  {
    id: 'aws-ccp',
    name: 'AWS Certified Cloud Practitioner',
    file: '/certs/AWS-CCP-Cert.pdf',
    image: '/images/aws-ccp.webp',
    earned: 'May 2025',
    expires: '2028-05-26',
    verifyUrl: 'https://www.credly.com/badges/dd7e3d8e-f4f0-4caa-ac05-5a50876e79a6/public_url',
  },
  {
    id: 'aws-cap',
    name: 'AWS Certified AI Practitioner',
    file: '/certs/AWS-CAP-Cert.pdf',
    image: '/images/aws-cap.webp',
    earned: 'Jun 2025',
    expires: '2028-06-01',
    verifyUrl: 'https://www.credly.com/badges/9c907d66-ce15-4892-b2b5-3141d9339349/public_url',
  },
  {
    id: 'alteryx-designer-core',
    name: 'Alteryx Designer Core Certification',
    file: '/certs/Alteryx_Designer_Core_Cert.pdf',
    image: '/images/alteryx-designer-core-certification.png',
    earned: 'Jun 2026',
    expires: '2028-06-17',
    verifyUrl: 'https://www.credly.com/earner/earned/badge/625da434-f2e8-41fe-a0c7-1efc492e7970',
  },
];

export function isCertExpired(cert: Certification): boolean {
  if (!cert.expires) return false;
  return new Date(cert.expires) < new Date();
}
