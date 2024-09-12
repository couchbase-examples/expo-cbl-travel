import {DatabaseService} from "@/services/database.service";

/**
 * Retrieves the list of landmarks from the database based on search criteria.
 *
 * This function uses the provided `DatabaseService` instance to fetch the landmarks that match the given search criteria.
 *
 * @param {DatabaseService} databaseService - The service instance used to interact with the database.
 * @param {string} searchName - The name of the landmark to search for.
 * @param {string} searchLocation - The location of the landmark to search for.
 * @param {string} activityType - The type of activity associated with the landmark.
 * @returns {Promise<any>} A promise that resolves to the list of landmarks matching the search criteria.
 * @throws Will throw an error if the retrieval of landmarks fails.
 */
export async function getLandmarkBySearchTerm(databaseService: DatabaseService, searchName: string, searchLocation: string, activityType: string):Promise<any> {
    return await databaseService.getLandmarkBySearchTerm(searchName, searchLocation, activityType);
}