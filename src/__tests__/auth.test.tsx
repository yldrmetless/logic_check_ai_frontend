import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '@/app/login/page';
import '@testing-library/jest-dom';

describe('Auth Flow', () => {
    it('renders login form correctly', () => {
        render(<Login />);
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('shows validation errors on empty submission', async () => {
        render(<Login />);
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        // Add assertions based on your validation library (e.g., Zod/React Hook Form)
    });
});
