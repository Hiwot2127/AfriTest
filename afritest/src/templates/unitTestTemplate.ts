export const unitTestTemplate = (functionName: string, parameters: string[], expected: string) => `
describe('${functionName}', () => {
    it('should return expected result', () => {
        const result = ${functionName}(${parameters.join(', ')});
        expect(result).toEqual(${expected});
    });
});
`;