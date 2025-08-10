import { render, screen, fireEvent } from '@testing-library/react';
import AppShell from './AppShell';

describe('AppShell', () => {
  it('shows HUD and switches tabs', () => {
    render(<AppShell />);
    expect(screen.getByText('Credits: 0')).toBeInTheDocument();
    expect(screen.getByText('Lvl 1')).toBeInTheDocument();
    expect(screen.getByText('Hacking L1')).toBeInTheDocument();
    expect(screen.getByText('Combat L1')).toBeInTheDocument();
    expect(screen.getByText('Exploration L1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Combat' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Map' }));
    expect(screen.getAllByText('Neon Market')[0]).toBeInTheDocument();
  });
});
