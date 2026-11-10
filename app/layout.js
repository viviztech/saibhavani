import './globals.css';
import { SiteFooter, SiteHeader } from './site-shell';

export const metadata = {
  title: 'Sai Bhavani Tours & Travels | Journeys made personal',
  description: 'Discover a more personal way to plan your next journey with Sai Bhavani Tours & Travels.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
