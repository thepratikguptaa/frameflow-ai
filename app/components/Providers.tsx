"use client";

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notification";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

export default function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider refetchInterval={5*60}>
        <NotificationProvider>
            <ImageKitProvider urlEndpoint={urlEndpoint}>
                {children}
            </ImageKitProvider>
        </NotificationProvider>
    </SessionProvider>;
}