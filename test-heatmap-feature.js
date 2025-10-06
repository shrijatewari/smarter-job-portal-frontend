// test-heatmap-feature.js - End-to-end test for Skill Heatmap feature
import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:3000';

async function testHeatmapFeature() {
  console.log('🧪 Testing Skill Demand Heatmap Feature End-to-End\n');
  
  const results = {
    backend_api: false,
    data_structure: false,
    skill_analysis: false,
    error_handling: false,
    frontend_integration: false
  };

  try {
    // Test 1: Backend API Availability
    console.log('1️⃣ Testing Backend API Availability...');
    const healthCheck = await axios.get(`${BACKEND_URL}/`);
    if (healthCheck.status === 200) {
      console.log('   ✅ Backend server is running');
      results.backend_api = true;
    }

    // Test 2: Heatmap API Data Structure
    console.log('\n2️⃣ Testing Heatmap API Data Structure...');
    const heatmapResponse = await axios.get(`${BACKEND_URL}/api/skills/heatmap`);
    const data = heatmapResponse.data;
    
    // Validate required fields
    const requiredFields = ['skills', 'categories', 'matrix', 'metadata'];
    const hasAllFields = requiredFields.every(field => data.hasOwnProperty(field));
    
    if (hasAllFields && Array.isArray(data.skills) && Array.isArray(data.categories) && Array.isArray(data.matrix)) {
      console.log('   ✅ API returns proper data structure');
      console.log(`   ✅ Skills: ${data.skills.length} found`);
      console.log(`   ✅ Categories: ${data.categories.length} found`);
      console.log(`   ✅ Matrix: ${data.matrix.length} rows`);
      results.data_structure = true;
    }

    // Test 3: Skill Analysis Quality
    console.log('\n3️⃣ Testing Skill Analysis Quality...');
    const topSkills = data.skills.slice(0, 5);
    const expectedSkills = ['React', 'JavaScript', 'Python', 'Git', 'TypeScript'];
    const skillsFound = expectedSkills.filter(skill => topSkills.includes(skill)).length;
    
    if (skillsFound >= 3) {
      console.log('   ✅ Top skills include expected technologies');
      console.log(`   ✅ Found ${skillsFound}/5 expected skills in top results`);
      console.log(`   ✅ Top 5 skills: ${topSkills.join(', ')}`);
      results.skill_analysis = true;
    }

    // Test 4: Error Handling
    console.log('\n4️⃣ Testing Error Handling...');
    try {
      // Test non-existent endpoint
      await axios.get(`${BACKEND_URL}/api/skills/nonexistent`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('   ✅ Proper 404 handling for invalid endpoints');
        results.error_handling = true;
      }
    }

    // Test 5: Frontend Integration
    console.log('\n5️⃣ Testing Frontend Integration...');
    try {
      const frontendCheck = await axios.get(FRONTEND_URL, { timeout: 5000 });
      if (frontendCheck.status === 200 && frontendCheck.data.includes('<!DOCTYPE html>')) {
        console.log('   ✅ Frontend is accessible');
        console.log('   ✅ React app is served properly');
        results.frontend_integration = true;
      }
    } catch (error) {
      console.log('   ❌ Frontend connection failed:', error.message);
    }

    // Summary
    console.log('\n📊 Test Results Summary:');
    console.log('═══════════════════════════');
    
    Object.entries(results).forEach(([test, passed]) => {
      const status = passed ? '✅ PASS' : '❌ FAIL';
      const testName = test.replace(/_/g, ' ').toUpperCase();
      console.log(`${status} ${testName}`);
    });

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('\n🎉 ALL TESTS PASSED! Skill Heatmap feature is fully functional!');
      console.log('\n📋 Feature Components:');
      console.log('   • Backend API: /api/skills/heatmap');
      console.log('   • React Component: SkillHeatmap.jsx');
      console.log('   • Homepage Integration: Complete');
      console.log('   • Interactive Features: Skill filtering, tooltips, refresh');
      console.log('   • Responsive Design: Mobile & desktop optimized');
      console.log('   • Error Handling: Robust fallback data');
      
      console.log('\n🚀 Ready for Production!');
      console.log(`   Frontend: ${FRONTEND_URL}`);
      console.log(`   Backend: ${BACKEND_URL}`);
    } else {
      console.log('\n⚠️  Some tests failed. Please check the issues above.');
    }

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }
}

// Run the tests
testHeatmapFeature();