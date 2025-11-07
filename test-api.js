// Simple API test script
const testAPI = async () => {
  const baseURL = 'http://localhost:3001';
  
  try {
    // Test users endpoint
    const usersResponse = await fetch(`${baseURL}/users`);
    const users = await usersResponse.json();
    console.log('✅ Users endpoint working:', users.length, 'users found');
    
    // Test works endpoint
    const worksResponse = await fetch(`${baseURL}/works`);
    const works = await worksResponse.json();
    console.log('✅ Works endpoint working:', works.length, 'works found');
    
    // Test equipment endpoint
    const equipmentResponse = await fetch(`${baseURL}/equipment`);
    const equipment = await equipmentResponse.json();
    console.log('✅ Equipment endpoint working:', equipment.length, 'items found');
    
    console.log('\n🎉 All API endpoints are working correctly!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
};

// Run the test if json-server is running
testAPI();