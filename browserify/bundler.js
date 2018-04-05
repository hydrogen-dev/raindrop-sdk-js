const fs = require('fs')
const path = require('path')
const browserify = require('browserify')

var raindropBundle = browserify({standalone: 'raindrop'})
raindropBundle.add('./modules.js')
raindropBundle.bundle().pipe(fs.createWriteStream(path.join(process.cwd(), './raindrop.js')))
