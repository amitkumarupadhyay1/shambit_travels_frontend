import { Metadata } from 'next';
import ExperiencesListingClient from '@/components/experiences/ExperiencesListingClient';

export const metadata: Metadata = {
  title: 'Browse Experiences | ShamBit',
  description: 'Explore our curated collection of spiritual and cultural experiences across India. From temple visits to cultural immersions.',
};

export default function ExperiencesPage() {
  return <ExperiencesListingClient />;
}
