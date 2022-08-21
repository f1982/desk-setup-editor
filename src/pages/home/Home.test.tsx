import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import { BrowserRouter, MemoryRouter } from 'react-router-dom'

test('renders learn react link', () => {
  render(<Home />, { wrapper: BrowserRouter });
  const linkElement = screen.getByText(/This is Setup Editor/i);
  expect(linkElement).toBeInTheDocument();
});
