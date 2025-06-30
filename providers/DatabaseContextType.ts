import { DatabaseService } from "@/services/database.service";

export type DatabaseContextType = {
  databaseService: DatabaseService;
  isInitialized: boolean;
};
