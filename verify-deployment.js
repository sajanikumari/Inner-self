// Deployment verification script
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying deployment configuration...\n');

// Check main server file
const serverPath = path.join(__dirname, 'server', 'index.js');
if (fs.existsSync(serverPath)) {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    console.log('✅ Main server file exists');
    
    // Check if it includes auth routes
    if (serverContent.includes("require('./routes/authRoutes')")) {
        console.log('✅ Auth routes are included');
    } else {
        console.log('❌ Auth routes are NOT included');
    }
    
    // Check if it includes all routes
    const routes = ['authRoutes', 'diaryRoutes', 'reminderRoutes', 'taskRoutes', 'settingRoutes', 'calendarRoutes'];
    routes.forEach(route => {
        if (serverContent.includes(route)) {
            console.log(`✅ ${route} included`);
        } else {
            console.log(`❌ ${route} NOT included`);
        }
    });
} else {
    console.log('❌ Main server file does not exist');
}

// Check auth routes file
const authRoutesPath = path.join(__dirname, 'server', 'routes', 'authRoutes.js');
if (fs.existsSync(authRoutesPath)) {
    const authContent = fs.readFileSync(authRoutesPath, 'utf8');
    console.log('\n✅ Auth routes file exists');
    
    // Check if it has real implementation
    if (authContent.includes('bcrypt.compare') && authContent.includes('jwt.sign')) {
        console.log('✅ Auth routes have real implementation');
    } else {
        console.log('❌ Auth routes appear to be stubs');
    }
    
    // Check for mock responses
    if (authContent.includes('authentication logic needed') || authContent.includes('Test User')) {
        console.log('❌ Auth routes contain mock responses');
    } else {
        console.log('✅ No mock responses found in auth routes');
    }
} else {
    console.log('❌ Auth routes file does not exist');
}

// Check package.json
const packagePath = path.join(__dirname, 'server', 'package.json');
if (fs.existsSync(packagePath)) {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log('\n✅ Package.json exists');
    console.log(`📦 Main entry point: ${packageContent.main}`);
    console.log(`🚀 Start script: ${packageContent.scripts.start}`);
} else {
    console.log('❌ Package.json does not exist');
}

// Check Dockerfile
const dockerfilePath = path.join(__dirname, 'Dockerfile');
if (fs.existsSync(dockerfilePath)) {
    const dockerContent = fs.readFileSync(dockerfilePath, 'utf8');
    console.log('\n✅ Dockerfile exists');
    
    if (dockerContent.includes('CMD ["node", "index.js"]')) {
        console.log('✅ Dockerfile uses correct entry point');
    } else {
        console.log('❌ Dockerfile may have incorrect entry point');
    }
} else {
    console.log('❌ Dockerfile does not exist');
}

// Check render.yaml
const renderConfigPath = path.join(__dirname, 'render.yaml');
if (fs.existsSync(renderConfigPath)) {
    const renderContent = fs.readFileSync(renderConfigPath, 'utf8');
    console.log('\n✅ Render.yaml exists');
    console.log('📄 Render configuration:');
    console.log(renderContent);
} else {
    console.log('❌ Render.yaml does not exist');
}

console.log('\n🔍 Verification complete!');
console.log('\n💡 If the deployed version is different from local:');
console.log('1. Make sure to commit and push all changes');
console.log('2. Trigger a new deployment on Render');
console.log('3. Check the deployment logs for any errors');
console.log('4. Verify environment variables are set correctly');