export interface PackageSelections {
    packageId: number;
    slug: string;
    experienceIds: number[];
    hotelTierId: number;
    transportOptionId: number;
    bookingDate?: string;
    idempotencyKey: string;
}

const STORAGE_KEY = 'shambit_booking_selection';

export function storeSelections(
    packageId: number,
    slug: string,
    experienceIds: number[],
    hotelTierId: number,
    transportOptionId: number,
    bookingDate?: string
): void {
    const selection: PackageSelections = {
        packageId,
        slug,
        experienceIds,
        hotelTierId,
        transportOptionId,
        bookingDate,
        idempotencyKey: crypto.randomUUID(),
    };

    if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    }
}

export function getSelections(): PackageSelections | null {
    if (typeof window === 'undefined') return null;

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored) as PackageSelections;
    } catch (e) {
        console.error('Failed to parse package selections', e);
        return null;
    }
}

export function clearSelections(): void {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY);
    }
}

export function hasSelections(): boolean {
    return !!getSelections();
}
