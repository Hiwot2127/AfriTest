export const integrationTestTemplate = (apiEndpoint: string, expectedResponse: any) => {
    return `
import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary

describe('Integration Test for ${apiEndpoint}', () => {
    it('should return the expected response', async () => {
        const response = await request(app).get('${apiEndpoint}');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(${JSON.stringify(expectedResponse)});
    });
});
    `;
};