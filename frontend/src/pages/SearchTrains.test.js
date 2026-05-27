import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import SearchTrains from './SearchTrains';
import api from '../services/api';

jest.mock('../services/api');
jest.mock('../store/authStore', () => ({
  __esModule: true,
  default: () => ({
    user: { user_id: 'user-1', name: 'tester' },
  }),
}));

describe('SearchTrains', () => {
  let container;
  let root;
  let alertSpy;
  const futureDate = '2099-05-26';

  const setInputValue = (input, value) => {
    const valueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;

    valueSetter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    api.get.mockResolvedValue({
      data: {
        data: [
          {
            train_id: 'tr-001',
            train_no: 'TR001',
            total_seats: 100,
            available_seats: 45,
            stations: [
              {
                id: 1,
                station_name: 'Delhi',
                station_sequence: 1,
                arrival_time: '06:00:00',
                departure_time: '06:10:00',
              },
              {
                id: 2,
                station_name: 'Mumbai',
                station_sequence: 2,
                arrival_time: '18:30:00',
                departure_time: '18:40:00',
              },
            ],
          },
        ],
      },
    });
    api.post.mockResolvedValue({
      data: {
        data: {
          seat: {
            seat_number: '1A',
          },
        },
      },
    });
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    alertSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('renders normalized train data after searching', async () => {
    await act(async () => {
      root.render(<SearchTrains />);
    });

    const sourceInput = container.querySelector('#source');
    const destinationInput = container.querySelector('#destination');
    const dateInput = container.querySelector('#date');
    const searchButton = container.querySelector('button[type="submit"]');

    await act(async () => {
      setInputValue(sourceInput, 'delhi');
      setInputValue(destinationInput, 'mumbai');
      setInputValue(dateInput, futureDate);
    });

    await act(async () => {
      searchButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(api.get).toHaveBeenCalledWith('/trains/search', {
      params: { source: 'delhi', destination: 'mumbai', date: futureDate },
    });
    expect(container.textContent).toContain('TR001');
    expect(container.textContent).toContain('45 seats available');
    expect(container.textContent).toContain('06:10');
    expect(container.textContent).toContain('18:30');
    expect(container.textContent).toContain('100');
  });

  it('books without asking the user to choose a seat', async () => {
    await act(async () => {
      root.render(<SearchTrains />);
    });

    const sourceInput = container.querySelector('#source');
    const destinationInput = container.querySelector('#destination');
    const dateInput = container.querySelector('#date');
    const searchButton = container.querySelector('button[type="submit"]');

    await act(async () => {
      setInputValue(sourceInput, 'delhi');
      setInputValue(destinationInput, 'mumbai');
      setInputValue(dateInput, futureDate);
    });

    await act(async () => {
      searchButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const selectBookButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Select & Book'
    );

    await act(async () => {
      selectBookButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(container.querySelector('#seatNumber')).toBeNull();
    expect(container.textContent).toContain('assigned automatically');

    const bookingForm = container.querySelectorAll('form')[1];

    await act(async () => {
      bookingForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(api.post).toHaveBeenCalledWith('/tickets/book', {
      userId: 'user-1',
      trainId: 'tr-001',
      source: 'delhi',
      destination: 'mumbai',
      dateOfTravel: futureDate,
    });
    expect(alertSpy).toHaveBeenCalledWith('Ticket booked successfully! Seat 1A has been assigned.');
  });

  it('does not allow searching with a past date', async () => {
    await act(async () => {
      root.render(<SearchTrains />);
    });

    const sourceInput = container.querySelector('#source');
    const destinationInput = container.querySelector('#destination');
    const dateInput = container.querySelector('#date');
    const searchButton = container.querySelector('button[type="submit"]');

    await act(async () => {
      setInputValue(sourceInput, 'delhi');
      setInputValue(destinationInput, 'mumbai');
      setInputValue(dateInput, '2000-01-01');
    });

    await act(async () => {
      searchButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(api.get).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Please select today or a future travel date');
  });
});