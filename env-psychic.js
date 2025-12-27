#!/usr/bin/env node

// ENV Var Psychic - Because your environment variables are hiding from you
// I see dead... env vars. They're everywhere!

const fs = require('fs');
const path = require('path');

// The crystal ball of environment variable detection
function psychicScan(envFile = '.env', requiredVars = []) {
    console.log('🔮 ENV Var Psychic is tuning in...');
    console.log('Reading your aura (and your .env file)...\n');
    
    // Check if we can even find the .env file
    if (!fs.existsSync(envFile)) {
        console.log(`💀 SPOOKY! Can't find ${envFile}. It's a ghost file!`);
        return false;
    }
    
    // Read the sacred text (aka .env file)
    const envContent = fs.readFileSync(envFile, 'utf8');
    const envLines = envContent.split('\n');
    
    // Extract defined variables (the ones that actually showed up)
    const definedVars = new Set();
    envLines.forEach(line => {
        const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
        if (match) definedVars.add(match[1]);
    });
    
    // The moment of truth: which variables are playing hide and seek?
    const missingVars = requiredVars.filter(varName => !definedVars.has(varName));
    
    // Deliver the psychic reading
    if (missingVars.length === 0) {
        console.log('✅ All required variables are present! The spirits are pleased.');
        console.log('Your app won\'t randomly explode at 3 AM. Probably.');
        return true;
    } else {
        console.log('🚨 PSYCHIC ALERT! Missing environment variables:');
        missingVars.forEach(varName => {
            console.log(`   👻 ${varName} - This ghost variable will haunt your runtime`);
        });
        console.log('\n💡 Tip: These variables are like socks in the dryer - they disappear when you need them most.');
        return false;
    }
}

// Main execution - because every psychic needs a stage
if (require.main === module) {
    // Default required vars - customize these based on your app's needs
    const defaultRequired = [
        'DATABASE_URL',
        'API_KEY',
        'SECRET_KEY',
        'NODE_ENV'
    ];
    
    // Check for custom requirements file
    let requiredVars = defaultRequired;
    const requirementsFile = '.env-requirements';
    
    if (fs.existsSync(requirementsFile)) {
        try {
            const reqContent = fs.readFileSync(requirementsFile, 'utf8');
            requiredVars = reqContent.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));
            console.log(`📋 Using custom requirements from ${requirementsFile}`);
        } catch (error) {
            console.log(`⚠️  Failed to read ${requirementsFile}, using defaults`);
        }
    }
    
    // Perform the psychic reading
    const success = psychicScan('.env', requiredVars);
    
    // Exit with appropriate code (because production cares about exit codes)
    process.exit(success ? 0 : 1);
}

module.exports = { psychicScan };