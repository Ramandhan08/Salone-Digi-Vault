"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { envServer } from "@/lib/env";

export default function PrivyRegistry({ children }: { children: React.ReactNode }) {
  const isSecure =
    typeof window !== "undefined" &&
    (window.isSecureContext || window.location.protocol === "https:" || window.location.hostname === "localhost");

  const embeddedWallets = isSecure
    ? {
        ethereum: { createOnLogin: "users-without-wallets" },
        solana: { createOnLogin: "users-without-wallets" },
      }
    : {
        ethereum: { createOnLogin: "off" },
        solana: { createOnLogin: "off" },
      };
      

  if (!isSecure) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: 12, borderRadius: 8 }}>
          Privy embedded wallets require HTTPS. Please access this site over HTTPS.
        </div>
        {children}
      </div>
    );
  }

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || envServer.NEXT_PUBLIC_PRIVY_APP_ID || "";

  if (!appId) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: 12, borderRadius: 8 }}>
          Privy App ID missing. Set NEXT_PUBLIC_PRIVY_APP_ID in environment variables.
        </div>
        {children}
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["email"],
        embeddedWallets,
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

