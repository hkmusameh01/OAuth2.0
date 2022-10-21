const dotenv = require('dotenv').config();
const axios = require('axios')

const google_auth_token_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

const query_params = {
  client_id: process.env.CLIENT_APP_ID,
  redirect_uri: `http://localhost:4000${process.env.REDIRECT_URI}`
}

// -----------------------------------------------------------

const get_access_token = async auth_token => {
  const access_token_params = {
    client_id: process.env.CLIENT_APP_ID,
    redirect_uri: `http://localhost:4000${process.env.REDIRECT_URI}`,
    client_secret: process.env.CLIENT_APP_SECRET,
    code: auth_token,
    grant_type: 'authorization_code'
  }

  const params_ = new URLSearchParams({ ...access_token_params })
  console.log('here arrive');
  const access_token_url = params_.toString();

  return await axios({
    method: 'post',
    url: `${google_auth_token_endpoint}?${access_token_url}`
  })
}

// -----------------------------------------------------------

const auth_token_params = {
  ...query_params,
  response_type: 'code',
}

const scopes = ['profile', 'email', 'openid']


const params = new URLSearchParams({ ...auth_token_params, scope: scopes.join(' ') })

const request_get_auth_code_url = `${google_auth_token_endpoint}?${params}`

module.exports = { request_get_auth_code_url, get_access_token }