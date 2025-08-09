import { render, screen, fireEvent } from '@testing-library/react';
import AppShell from './AppShell';

describe('AppShell', () => {
  it('shows HUD and switches tabs', () => {
    render(<AppShell />);
    expect(screen.getByText('Credits: 0')).toBeInTheDocument();
    expect(screen.getByText('Hacking L1')).toBeInTheDocument();
    expect(screen.getByText('Combat L1')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content')).toHaveTextContent('Start hack');
    fireEvent.click(screen.getByRole('button', { name: 'Combat' }));
    expect(screen.getByRole('button', { name: 'Engage' })).toBeInTheDocument();
  });
});
