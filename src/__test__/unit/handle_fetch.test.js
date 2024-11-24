import { expect, describe, it, vi } from 'vitest';

import { handleFetch, handleFetchBlob } from '../../utils/handle_fetch';

describe('Fetch data', () => {
	it('should return error messages if fetch data is fails', async () => {
		const mockUrl = 'http://localhost:3000';
		const mockOptions = {
			method: 'GET',
			signal: new AbortController().signal,
		};

		const mockResponse = {
			json: vi.fn().mockRejectedValueOnce('fetch error'),
		};

		window.fetch = vi.fn().mockResolvedValueOnce(mockResponse);

		const actual = await handleFetch(mockUrl, mockOptions);

		const expected = {
			success: false,
			message: 'fetch error',
		};

		expect(actual).toStrictEqual(expected);
		expect(fetch).toBeCalledWith(mockUrl, mockOptions);
		expect(mockResponse.json).toBeCalledTimes(1);
	});
	it('should return null if fetch data is aborted', async () => {
		const mockUrl = 'http://localhost:3000';
		const controller = new AbortController();

		const mockOptions = {
			method: 'GET',
			signal: controller.signal,
		};

		window.fetch = vi.fn().mockImplementationOnce(() => controller.abort());

		const actual = await handleFetch(mockUrl, mockOptions);

		const expected = null;

		expect(actual).toBe(expected);
	});
});

describe('Fetch blob', () => {
	it('should return blob if fetch blob is success', async () => {
		const mockUrl = 'http://localhost:3000';
		const mockBlob = 'blob data';

		const mockResponse = {
			blob: vi.fn().mockResolvedValueOnce(mockBlob),
		};

		window.fetch = vi.fn().mockResolvedValueOnce(mockResponse);

		const actual = await handleFetchBlob(mockUrl);

		const expected = {
			success: true,
			blob: mockBlob,
		};

		expect(actual).toStrictEqual(expected);
		expect(fetch).toBeCalledWith(mockUrl);
		expect(mockResponse.blob).toBeCalledTimes(1);
	});
	it('should return error messages if fetch blob is fails', async () => {
		const mockUrl = 'http://localhost:3000';

		const mockResponse = {
			blob: vi.fn().mockRejectedValueOnce('fetch error'),
		};

		window.fetch = vi.fn().mockResolvedValueOnce(mockResponse);

		const actual = await handleFetchBlob(mockUrl);

		const expected = {
			success: false,
			message: 'fetch error',
		};

		expect(actual).toStrictEqual(expected);
		expect(fetch).toBeCalledWith(mockUrl);
		expect(mockResponse.blob).toBeCalledTimes(1);
	});
});
