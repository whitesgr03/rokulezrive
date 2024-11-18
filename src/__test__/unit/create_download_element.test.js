import { expect, describe, it, vi } from 'vitest';

import { createDownloadElement } from '../../utils/create_download_element';

describe('Create download element', () => {
	it('should download resource after creating anchor element and setting href and download attributes', () => {
		const anchorMocked = { href: '', download: '', click: vi.fn() };

		const createElementSpyOn = vi
			.spyOn(document, 'createElement')
			.mockReturnValueOnce(anchorMocked);

		URL.createObjectURL = vi.fn(url => url);

		const mockAttribute = {
			href: 'url',
			name: 'file',
		};

		const actual = createDownloadElement(
			mockAttribute.href,
			mockAttribute.download,
		);

		actual.click();

		const expected = {
			href: mockAttribute.href,
			download: mockAttribute.download,
		};

		expect(actual.href).toBe(expected.href);
		expect(actual.download).toBe(expected.download);
		expect(anchorMocked.click).toBeCalledTimes(1);
		expect(URL.createObjectURL).toBeCalledTimes(1);
		expect(createElementSpyOn).toBeCalledWith('a');
	});
});
