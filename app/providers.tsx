'use client'

import React, { ReactElement } from "react";
import { ThemeProviderProps } from "next-themes";
import { ImageKitProvider } from "imagekitio-next";
import { createContext, useContext } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const authenticator = async () => {
    try{
        const response = await fetch("/api/upload-auth");
        const body = await response.json();
        return body;
    }catch(err){
        console.log("Authentication error", err);
        throw err;
    }
}

export const ImageKitAuthContext = createContext<{
    authenticate: () => Promise<{
        signature: string,
        token: string,
        expire: number,
    }>;
}>({
    authenticate: async() => ({ signature: "", token: "", expire: 0 })
});

export const useImageKitAuth = () => useContext(ImageKitAuthContext);

export interface ProviderProps{
    children: React.ReactNode,
    themeProps?: ThemeProviderProps
};

export function Provider({ children, themeProps } : ProviderProps ){
    return (
        <ImageKitProvider
            authenticator={authenticator}
            publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
        >
            <ImageKitAuthContext.Provider value={{authenticate: authenticator}}>
                <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            </ImageKitAuthContext.Provider>
        </ImageKitProvider>
    )
}