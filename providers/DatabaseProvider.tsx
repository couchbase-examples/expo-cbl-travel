import React, {useState, ReactNode, useMemo, useEffect} from 'react';
import {DatabaseService} from "@/services/database.service";
import DatabaseContext from './DatabaseContext';

type DatabaseProviderProps = {
    children: ReactNode;
}

const DatabaseProvider: React.FC<DatabaseProviderProps> = ({children}) => {
    const dbService = new DatabaseService();
    const [databaseService, setDatabaseService] = useState<DatabaseService>(dbService);

    useEffect(() => {
        const initializeDatabase = async () => {
            await dbService.initializeDatabase();
        };
        initializeDatabase().then().catch(e => console.error(e));
    }, [dbService]);

    const databaseServiceValue = useMemo(() => ({databaseService, setDatabaseService}), [databaseService, setDatabaseService]);
    return (
        <DatabaseContext.Provider value={databaseServiceValue}>
            {children}
        </DatabaseContext.Provider>
    );
};

export default DatabaseProvider;