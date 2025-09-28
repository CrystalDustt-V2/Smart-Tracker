import { Navigation } from '../Navigation';
import { ThemeProvider } from '@/lib/theme-context';

export default function NavigationExample() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}