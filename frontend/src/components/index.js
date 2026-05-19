/**
 * Components - Root Barrel Export
 * Importa todos los componentes desde un solo punto
 */
export * from './ui'
export * from './layout'
export * from './sections'

// También exporta por defecto para imports más cortos
import { Section, Card, Badge } from './ui'
import { Navigation, Footer } from './layout'
import { 
  HeroSection, 
  WelcomeSection, 
  DetailsSection, 
  MapSection, 
  AccommodationSection, 
  FaqSection,
  GuestCountSection,
  RsvpSection 
} from './sections'

export default {
  Section,
  Card,
  Badge,
  Navigation,
  Footer,
  HeroSection,
  WelcomeSection,
  DetailsSection,
  MapSection,
  AccommodationSection,
  FaqSection,
  GuestCountSection,
  RsvpSection,
}
