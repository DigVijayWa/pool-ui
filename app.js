var path = require('path'),
	express = require('express')
	app = express()
	expressWs = require('express-ws')(app)


app.use('/', express.static(path.join(__dirname, 'webapp')))

app.listen(process.env.PORT || 3000, function () {
	console.log('UI is available on port 3000!')
})
