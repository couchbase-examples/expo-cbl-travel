import React from 'react';
import {DatabaseService} from "@/services/database.service";

export type DatabaseContextType = {
    databaseService: DatabaseService;
    setDatabaseService: React.Dispatch<React.SetStateAction<DatabaseService>>;
};