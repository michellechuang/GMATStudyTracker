const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

/**
 * Helper script to install the Chrome extension
 * Provides instructions and automates where possible
 */

const EXTENSION_DIR = path.join(__dirname, '..', 'extension')
const CHROME_EXTENSIONS_URL = 'chrome://extensions/'

function detectOS() {
  const platform = process.platform
  switch (platform) {
    case 'win32':
      return 'Windows'
    case 'darwin':
      return 'macOS'
    case 'linux':
      return 'Linux'
    default:
      return 'Unknown'
  }
}

function openChromeExtensions() {
  const os = detectOS()
  
  try {
    switch (os) {
      case 'Windows':
        execSync(`start chrome ${CHROME_EXTENSIONS_URL}`)
        break
      case 'macOS':
        execSync(`open -a "Google Chrome" ${CHROME_EXTENSIONS_URL}`)
        break
      case 'Linux':
        execSync(`google-chrome ${CHROME_EXTENSIONS_URL}`)
        break
      default:
        console.log(`Please manually open: ${CHROME_EXTENSIONS_URL}`)
    }
    return true
  } catch (error) {
    console.log('Could not automatically open Chrome. Please open manually.')
    return false
  }
}

async function validateExtension() {
  console.log('🔍 Validating extension files...')
  
  // Check if extension directory exists
  if (!(await fs.pathExists(EXTENSION_DIR))) {
    throw new Error(`Extension directory not found: ${EXTENSION_DIR}`)
  }
  
  // Check for required files
  const requiredFiles = [
    'manifest.json',
    'popup.html',
    'popup.js',
    'styles.css'
  ]
  
  const missingFiles = []
  for (const file of requiredFiles) {
    const filePath = path.join(EXTENSION_DIR, file)
    if (!(await fs.pathExists(filePath))) {
      missingFiles.push(file)
    }
  }
  
  if (missingFiles.length > 0) {
    throw new Error(`Missing required files: ${missingFiles.join(', ')}`)
  }
  
  // Validate manifest.json
  try {
    const manifestPath = path.join(EXTENSION_DIR, 'manifest.json')
    const manifest = await fs.readJson(manifestPath)
    
    if (!manifest.name || !manifest.version || !manifest.manifest_version) {
      throw new Error('Invalid manifest.json structure')
    }
    
    console.log(`✅ Extension validated: ${manifest.name} v${manifest.version}`)
    return manifest
    
  } catch (error) {
    throw new Error(`Invalid manifest.json: ${error.message}`)
  }
}

function printInstructions(manifest) {
  console.log('\n📋 CHROME EXTENSION INSTALLATION INSTRUCTIONS')
  console.log('=' .repeat(50))
  console.log('')
  console.log('1. 🌐 Chrome Extensions page should open automatically')
  console.log('   If not, manually navigate to: chrome://extensions/')
  console.log('')
  console.log('2. 🔧 Enable Developer Mode:')
  console.log('   Toggle the "Developer mode" switch in the top right corner')
  console.log('')
  console.log('3. 📁 Load the extension:')
  console.log('   Click "Load unpacked" button')
  console.log(`   Select this folder: ${EXTENSION_DIR}`)
  console.log('')
  console.log('4. ✅ Verify installation:')
  console.log(`   Look for "${manifest.name}" in your extensions list`)
  console.log('   Pin it to your toolbar for easy access')
  console.log('')
  console.log('5. 🚀 Start using:')
  console.log('   Click the extension icon to log study sessions')
  console.log('   View detailed analytics in the PWA dashboard')
  console.log('')
  console.log('💡 TROUBLESHOOTING:')
  console.log('- If you see errors, check the browser console')
  console.log('- Refresh the extension after making code changes')
  console.log('- Clear browser cache if data seems outdated')
  console.log('')
}

function printPostInstallation() {
  console.log('🎉 NEXT STEPS:')
  console.log('=' .repeat(30))
  console.log('')
  console.log('• Start the PWA dashboard:')
  console.log('  cd pwa && npm run dev')
  console.log('')
  console.log('• Log your first study session')
  console.log('• Explore the analytics dashboard')
  console.log('• Set up your study goals')
  console.log('')
  console.log('📚 Happy studying!')
}

async function main() {
  try {
    console.log('🚀 GMAT Study Tracker - Extension Installer')
    console.log('=' .repeat(45))
    console.log('')
    
    // Validate extension files
    const manifest = await validateExtension()
    
    console.log('📂 Extension location:', EXTENSION_DIR)
    console.log('')
    
    // Print instructions
    printInstructions(manifest)
    
    // Try to open Chrome extensions page
    console.log('🌐 Opening Chrome Extensions page...')
    const opened = openChromeExtensions()
    
    if (!opened) {
      console.log('⚠️  Please manually open Chrome and navigate to:')
      console.log(`   ${CHROME_EXTENSIONS_URL}`)
    }
    
    console.log('')
    printPostInstallation()
    
  } catch (error) {
    console.error('❌ Installation setup failed:', error.message)
    console.log('')
    console.log('🔧 Please ensure:')
    console.log('• All extension files are present')
    console.log('• manifest.json is valid')
    console.log('• Chrome browser is installed')
    process.exit(1)
  }
}

// Handle command line arguments
const args = process.argv.slice(2)
if (args.includes('--help') || args.includes('-h')) {
  console.log('GMAT Study Tracker - Extension Installer')
  console.log('')
  console.log('Usage: node install-extension.js [options]')
  console.log('')
  console.log('Options:')
  console.log('  --help, -h     Show this help message')
  console.log('  --no-open      Don\'t try to open Chrome automatically')
  console.log('')
  process.exit(0)
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}
