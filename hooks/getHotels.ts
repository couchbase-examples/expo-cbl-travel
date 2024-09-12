import {DatabaseService} from "@/services/database.service";

/**
 * Retrieves the list of hotels from the database.
 *
 * This function uses the provided `DatabaseService` instance to fetch the hotels.
 *
 * @param {DatabaseService} databaseService - The service instance used to interact with the database.
 * @returns {Promise<any>} A promise that resolves to the list of hotels.
 * @throws Will throw an error if the retrieval of hotels fails.
 */
export async function getHotels(databaseService: DatabaseService):Promise<any> {
    return await databaseService.getHotels();
}

/**
 * Retrieves the list of hotels from the database based on a search term.
 *
 * This function uses the provided `DatabaseService` instance to fetch the hotels
 * that match the given search term.
 *
 * @param {DatabaseService} databaseService - The service instance used to interact with the database.
 * @param {string} search - The search term used to filter the hotels.
 * @returns {Promise<any>} A promise that resolves to the list of hotels matching the search term.
 * @throws Will throw an error if the retrieval of hotels fails.
 */
export async function getHotelsBySearch(databaseService: DatabaseService, search: string):Promise<any> {
    return await databaseService.getHotelsBySearchTerm(search);
}