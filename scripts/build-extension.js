const fs = require('fs-extra')
const path = require('path')
const archiver = require('archiver')

/**
 * Build script for Chrome Extension
 * Prepares the extension for distribution
 */

const BUILD_DIR = path.join(__dirname, '..', 'extension')
const DIST_DIR = path.join(__dirname, '..', 'dist', 'extension')

async function buildExtension() {
  console.log('🔨 Building Chrome Extension...')
  
  try {
    // Ensure dist directory exists
    await fs.ensureDir(DIST_DIR)
    
    // Copy extension files to dist
    await fs.copy(BUILD_DIR, DIST_DIR, {
      filter: (src) => {
        // Exclude README and other non-essential files
        const basename = path.basename(src)
        return !basename.startsWith('.') && basename !== 'README.md'
      }
    })
    
    // Validate manifest.json
    const manifestPath = path.join(DIST_DIR, 'manifest.json')
    if (await fs.pathExists(manifestPath)) {
      const manifest = await fs.readJson(manifestPath)
      console.log(`✅ Extension: ${manifest.name} v${manifest.version}`)
      
      // Validate required fields
      const requiredFields = ['name', 'version', 'manifest_version', 'action']
      const missingFields = requiredFields.filter(field => !manifest[field])
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required manifest fields: ${missingFields.join(', ')}`)
      }
    } else {
      throw new Error('manifest.json not found')
    }
    
    // Check for required files
    const requiredFiles = ['popup.html', 'popup.js', 'styles.css']
    for (const file of requiredFiles) {
      const filePath = path.join(DIST_DIR, file)
      if (!(await fs.pathExists(filePath))) {
        throw new Error(`Required file missing: ${file}`)
      }
    }
    
    console.log('✅ Extension built successfully')
    console.log(`📁 Output: ${DIST_DIR}`)
    
    return DIST_DIR
    
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    process.exit(1)
  }
}

async function packageExtension() {
  console.log('📦 Packaging extension for distribution...')
  
  try {
    const zipPath = path.join(__dirname, '..', 'dist', 'gmat-study-tracker-extension.zip')
    
    // Create zip archive
    const output = fs.createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })
    
    output.on('close', () => {
      console.log(`✅ Extension packaged: ${path.basename(zipPath)}`)
      console.log(`📊 Total bytes: ${archive.pointer()}`)
    })
    
    archive.on('error', (err) => {
      throw err
    })
    
    archive.pipe(output)
    archive.directory(DIST_DIR, false)
    await archive.finalize()
    
    return zipPath
    
  } catch (error) {
    console.error('❌ Packaging failed:', error.message)
    process.exit(1)
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const shouldPackage = args.includes('--package') || args.includes('-p')
  
  await buildExtension()
  
  if (shouldPackage) {
    await packageExtension()
  }
  
  console.log('🎉 Extension build complete!')
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  buildExtension,
  packageExtension
}
