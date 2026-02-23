import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/page'; 
import { useRouter } from 'next/navigation';

// 1. Definišemo mock funkciju van svega
const mockPush = jest.fn();

// 2. Mock-ujemo ceo modul 'next/navigation'
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));

// 3. Postavljamo mockFetch
const mockFetch = jest.fn() as any;
global.fetch = mockFetch;

describe('LoginPage - Testovi prijave', () => {
  beforeEach(() => {
    // Čistimo sve prethodne pozive pre svakog testa
    jest.clearAllMocks();
  });

  // ... testovi idu ispod
  // ... ostatak testova ostaje isti, samo pazi na mockFetch
  it('renderuje formu sa svim potrebnim poljima', () => {
    render(<LoginPage />);
    
    expect(screen.getByText(/Prijava/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ime@primer\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Prijavi se/i })).toBeInTheDocument();
  });

  it('omogućava korisniku da unese email i lozinku', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/ime@primer\.com/i) as HTMLInputElement;
    const passInput = screen.getByPlaceholderText(/••••••••/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@user.com' } });
    fireEvent.change(passInput, { target: { value: 'sifra123' } });

    expect(emailInput.value).toBe('test@user.com');
    expect(passInput.value).toBe('sifra123');
  });

  it('uspešno preusmerava na /glavna nakon prijave običnog korisnika', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { admin: false } }),
    } as Response);

    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/ime@primer\.com/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'lozinka' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Prijavi se/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/glavna');
    });
  });


});