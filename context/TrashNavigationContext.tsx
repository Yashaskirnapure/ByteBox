'use client';

import { DirectoryStack, DirectoryStackItem } from "@/types/types";
import React, { useState, useRef, createContext, useContext } from "react";

interface TrashNavigationContextType{
    workingDir: DirectoryStackItem,
    setWorkingDir: (dir: DirectoryStackItem) => void,
    moveUp: () => void,
}

const ROOT_FOLDER = {
    id: null,
    name: 'root',
}

const TrashNavigationContext = createContext<TrashNavigationContextType | undefined> (undefined);
export const TrashNavigationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
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
        <TrashNavigationContext.Provider value={{ workingDir, setWorkingDir, moveUp }}>
            {children}
        </TrashNavigationContext.Provider>
    )
}

export const useTrashNavigation = () => {
    const context = useContext(TrashNavigationContext);
    if(!context) throw new Error("Could not create trash navigation context");
    return context;
}