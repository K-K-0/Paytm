const express = require("express");
const cors = require('cors')
const rootRouter = require('./routes/index')

app.use(cors())
app.use(express.json())
const app = express()

app.use('/api/v1', rootRouter)

app.listen(3000)


