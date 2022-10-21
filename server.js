const express = require('express')
const { join } = require('path')
const utils = require('./utils')

const port = 4000;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'))
})

app.get('/auth', (req, res) => {
  try {
    // res.redirect(utils.request_get_auth_code_url)
    res.send({ redirectUrl: utils.request_get_auth_code_url })

  } catch (error) {
    console.log('msg=>>> ', error.message);
    res.sendStatus(500);
  }
})

app.get(process.env.REDIRECT_URI, async (req, res) => {
  const authorization_token = req.query;

  try {
    // get access token using authorization token
    const response = await utils.get_access_token(authorization_token.code);
    // get access token from payload
    const { access_token } = response.data;
    // get user profile data
    const user = await utils.get_profile_data(access_token);
    const user_data = user.data;
    console.log(user_data);
    res.send(`
      <h1> welcome ${user_data.name}</h1>
      <img src='${user_data.picture}' alt="user_image" />
    `);
    console.log(user_data);

  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Your server is listening on http://localhost:${port}`)
})