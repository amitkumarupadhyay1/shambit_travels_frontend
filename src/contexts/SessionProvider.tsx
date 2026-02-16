"use client";

import { useEffect } from "react";
import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";
import { storeTokens, clearTokens } from "@/lib/auth-utils";

function SessionSync() {
    const { data: session } = useSession();

    useEffect(() => {
        // When session becomes available, persist tokens to localStorage
        if (session) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const access = (session as any).accessToken as string | undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const refresh = (session as any).refreshToken as string | undefined;

            if (access && refresh) {
                try {
                    storeTokens(access, refresh);
                } catch (e) {
                    console.error("Failed to store tokens from session", e);
                }
                return;
            }

            // If session cleared, remove tokens
            if (!access && !refresh) {
                try {
                    clearTokens();
                } catch (e) {
                    console.error("Failed to clear tokens", e);
                }
            }
        }
    }, [session]);

    return null;
}

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextAuthSessionProvider>
            <SessionSync />
            {children}
        </NextAuthSessionProvider>
    );
}
