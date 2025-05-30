'use client';

import { DirectoryStack, DirectoryStackItem } from "@/types/types";
import React, { useState, useRef, createContext, useContext } from "react";

interface DirectoryNavigationContextType{
    workingDir: DirectoryStackItem,
    setWorkingDir: (dir: DirectoryStackItem) => void,
    moveUp: () => void,
}

const ROOT_FOLDER = {
    id: null,
    name: 'root',
}

const DirectoryNavigationContext = createContext<DirectoryNavigationContextType | undefined> (undefined);
export const DirectoryNavigationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const stackRef = useRef(new DirectoryStack([ROOT_FOLDER]));
    const [ workingDir, setWorkingDirState ] = useState<DirectoryStackItem>(ROOT_FOLDER);

    const moveUp = () => {
        if(stackRef.current.length() === 1) return;
        stackRef.current.pop();
        const top = stackRef.current.peek();
        setWorkingDirState(top!);
    }

    const setWorkingDir = (folder: DirectoryStackItem) => {
        stackRef.current.push(folder);
        setWorkingDirState(folder);
    }

    return (
        <DirectoryNavigationContext.Provider value={{ workingDir, setWorkingDir, moveUp }}>
			{children}
		</DirectoryNavigationContext.Provider>
    )
}

export const useDirectoryNavigation = () => {
    const context = useContext(DirectoryNavigationContext);
    if(!context) throw new Error("Could not create navigation context");
    return context;
}