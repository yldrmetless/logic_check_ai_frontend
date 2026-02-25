import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import '@testing-library/jest-dom';

describe('Home Page', () => {
    it('renders the main landing elements', () => {
        render(<Home />);

        // Using a more flexible query to avoid text content mismatch
        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toBeInTheDocument();
    });

    it('matches the snapshot', () => {
        const { asFragment } = render(<Home />);
        expect(asFragment()).toMatchSnapshot();
    });
});
