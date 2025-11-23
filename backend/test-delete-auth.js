const axios = require('axios');

// Test script to verify delete authorization
async function testDeleteAuthorization() {
    const baseURL = 'http://localhost:8080/api';

    console.log('Testing Delete Authorization...\n');

    // Test 1: Login as user1 (test@example.com)
    console.log('1. Logging in as test@example.com...');
    const loginRes1 = await axios.post(`${baseURL}/auth/login`, {
        email: 'test@example.com',
        password: 'password123'
    }, { withCredentials: true });

    const user1Cookie = loginRes1.headers['set-cookie'];
    console.log('✓ Logged in as testuser\n');

    // Test 2: Get all queries
    console.log('2. Fetching all queries...');
    const queriesRes = await axios.get(`${baseURL}/queries`);
    const queries = queriesRes.data;
    console.log(`✓ Found ${queries.length} queries\n`);

    // Find a query by testuser and another user
    const myQuery = queries.find(q => q.author.username === 'testuser');
    const otherQuery = queries.find(q => q.author.username !== 'testuser');

    if (myQuery) {
        console.log(`3. Found my query: "${myQuery.title}" (ID: ${myQuery._id})`);
        console.log(`   Author: ${myQuery.author.username}\n`);
    }

    if (otherQuery) {
        console.log(`4. Found other user's query: "${otherQuery.title}" (ID: ${otherQuery._id})`);
        console.log(`   Author: ${otherQuery.author.username}\n`);
    }

    // Test 3: Try to delete own query (should succeed)
    if (myQuery) {
        console.log('5. Testing: Delete own query (should succeed)...');
        try {
            await axios.delete(`${baseURL}/queries/${myQuery._id}`, {
                headers: { Cookie: user1Cookie },
                withCredentials: true
            });
            console.log('✓ Successfully deleted own query\n');
        } catch (error) {
            console.log(`✗ Failed: ${error.response?.data?.message || error.message}\n`);
        }
    }

    // Test 4: Try to delete other user's query (should fail)
    if (otherQuery) {
        console.log('6. Testing: Delete other user\'s query (should fail)...');
        try {
            await axios.delete(`${baseURL}/queries/${otherQuery._id}`, {
                headers: { Cookie: user1Cookie },
                withCredentials: true
            });
            console.log('✗ SECURITY ISSUE: Was able to delete other user\'s query!\n');
        } catch (error) {
            if (error.response?.status === 403) {
                console.log('✓ Correctly blocked: Not authorized\n');
            } else {
                console.log(`✗ Unexpected error: ${error.response?.data?.message || error.message}\n`);
            }
        }
    }

    console.log('Authorization test complete!');
}

testDeleteAuthorization().catch(console.error);
