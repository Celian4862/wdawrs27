import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PlayerSetup } from '@/utility/Setup';

describe('PlayerSetup', () => {
	it('renders correctly and dispatches the right action on click', async () => {
		const mockDispatch = vi.fn();
		render(<PlayerSetup dispatch={mockDispatch} />);

		// 1. Test title presence (replaces "test if it displays 'How many players?'")
		expect(
			screen.getByRole('heading', { name: /how many players\?/i }),
		).toBeInTheDocument();

		// 2. Test that all expected buttons exist and show the correct numbers
		// (This covers: buttons display, numbers display, numbers are correct)
		const expectedCounts = ['2', '3', '4', '5'];

		for (const count of expectedCounts) {
			const button = screen.getByRole('button', { name: count });
			expect(button).toBeInTheDocument();
		}

		// 3. Test interaction (clicking dispatches correctly)
		await userEvent.click(screen.getByRole('button', { name: '3' }));

		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'SET_PLAYERS',
			count: 3,
		});
	});
});
