import React, {useState, ReactNode, useMemo, useEffect} from 'react';
import {DatabaseService} from "@/services/database.service";
import DatabaseContext from './DatabaseContext';

type DatabaseProviderProps = {
    children: ReactNode;
}

const DatabaseProvider: React.FC<DatabaseProviderProps> = ({children}) => {
    const [databaseService] = useState<DatabaseService>(new DatabaseService());
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                await databaseService.initializeDatabase();
                setIsInitialized(true);
            } catch (error) {
                console.error("Database initialization failed:", error);
            }
        };
        initializeDatabase()
    }, [databaseService]);

    const databaseServiceValue = useMemo(() => ({databaseService, isInitialized}), [databaseService, isInitialized]);
    return (
        <DatabaseContext.Provider value={databaseServiceValue}>
            {children}
        </DatabaseContext.Provider>
    );
};

export default DatabaseProvider;