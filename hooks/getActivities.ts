import {DatabaseService} from "@/services/database.service";

/**
 * Retrieves the list of activities from the database.
 *
 * This function uses the provided `DatabaseService` instance to fetch the
 * activities.
 *
 * @param {DatabaseService} databaseService - The service instance used to interact with the database.
 * @returns {Promise<any>} A promise that resolves to the list of activities.
 * @throws Will throw an error if the retrieval of activities fails.
 */
export async function getActivities(databaseService: DatabaseService):Promise<any> {
    return await databaseService.getActivities();
}