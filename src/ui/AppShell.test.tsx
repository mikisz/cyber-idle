import { render, screen, fireEvent } from '@testing-library/react';
import AppShell from './AppShell';

describe('AppShell', () => {
  it('renders map by default and switches tabs', () => {
    render(<AppShell />);
    // breadcrumb shows Mapa
    expect(screen.getAllByText('Mapa')[0]).toBeInTheDocument();
    // switch to inventory via bottom nav
    fireEvent.click(screen.getByRole('button', { name: '🎒' }));
    expect(screen.getByText('Equipped')).toBeInTheDocument();
  });
});
