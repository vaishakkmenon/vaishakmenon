// Test the generateSessionId utility function

describe('generateSessionId', () => {
    it('should return a string', () => {
        const { generateSessionId } = require('@/lib/api/chat');
        const id = generateSessionId();
        expect(typeof id).toBe('string');
    });

    it('should return non-empty IDs', () => {
        const { generateSessionId } = require('@/lib/api/chat');
        const id = generateSessionId();
        expect(id.length).toBeGreaterThan(0);
    });

    it('should return unique IDs on subsequent calls', () => {
        const { generateSessionId } = require('@/lib/api/chat');
        const id1 = generateSessionId();
        const id2 = generateSessionId();
        expect(id1).not.toBe(id2);
    });
});
