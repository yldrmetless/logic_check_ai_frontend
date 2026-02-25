import React from 'react';
import { render, screen } from '@testing-library/react';
import MyIdeas from '@/app/dashboard/my-ideas/page';
import '@testing-library/jest-dom';

describe('Ideas Module', () => {
    it('renders empty state when no ideas exist', () => {
        render(<MyIdeas />);
        // Adjust based on your 'no data' UI component
        expect(screen.getByText(/no ideas found/i)).toBeInTheDocument();
    });
});
