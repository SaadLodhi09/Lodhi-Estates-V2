export type PropertyStatus = 'Available' | 'Under Offer' | 'Reserved';

export interface Property {
  id: string;
  refCode: string;
  name: string;
  location: string;
  coordinates: string;
  type: 'Villa' | 'Residence' | 'Penthouse' | 'Estate';
  status: PropertyStatus;
  price: number;
  currency: 'PKR';
  areaSqft: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  architect: string;
  description: string;
  image: string;
  gallery: string[];
  featured?: boolean;
}
