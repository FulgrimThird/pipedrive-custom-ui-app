const axios = require("axios");
const debug = require('debug')('app:helper');
const querystring = require('querystring');
const Account = require("../data/account");
const nanoid = require("nanoid");

const pipedrive = require('pipedrive');

// const apiClient = new pipedrive.ApiClient();
// apiClient.authentications.api_key.apiKey = process.env.PIPEDRIVE_API_KEY;


// Generates a new token based on the refresh token
const getNewToken = async (refresh_token) => {
    try {
        return axios({
            method: "POST",
            url: "https://oauth.pipedrive.com/oauth/token",
            headers: {
                Authorization: `Basic ${Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64")}`,
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: querystring.stringify({
                grant_type: "refresh_token",
                refresh_token,
            }),
        });
    } catch (error) {
        debug(error);
        throw new Error("Getting new token from refresh token failed");
    }
};


// Gets information about a particular deal (by ID) in Pipedrive
async function getDeal(deal_id, access_token) {
    try {
        const deal = await axios({
            method: 'GET',
            url: `https://api.pipedrive.com/v1/deals/${deal_id}`,
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        return deal.data;
    } catch (error) {
        debug(error);
        throw new Error("API request to get deal by ID failed");
    }
}

async function createDeal(data){
    
    var body = {
        "title": "Test Deal " + nanoid.nanoid(6) ,
        "user_id": null,
        "person_id": Number(data.person),
        "org_id": 4,
        "visible_to": "1",
        "5748f5d5a2e7caa0eea957f830804f9166445152": data.first_name,
        "4f8b7ac46c581bb83fa972ac1ab2941ffd650235": data.last_name,
        "185342ec7e5c40365e9e270d593a068c179e1a49": data.email_addr,
        "92e599acb91fba3230ae8d85787552f3eae72c2d": data.telly,
        "4d1cae2e084b32da21bd8179df0eae8b0762a055": data.job_comment,
        "5349d284c3ed98eca38330c806f99ce7196ce920": data.job_type,
        "358d8e3e7c33e77750e8ec9d4a63955fe81e8816": data.job_source,
        "4efb016ee8425f853775eba91ed1cc2df467c3a2": data.s_address + ", " + data.city + ", " + data.state + ", " + data.postal_code,
        "ed392f71d132853d8c219408f678213e1d31ff27": data.date,
        "20790c00d16f6a72230c68400a567608f0f26b5c": data.time1,
        "20790c00d16f6a72230c68400a567608f0f26b5c_timezone_id": 304,
        "20790c00d16f6a72230c68400a567608f0f26b5c_until": data.time2,


    }
 
    const resp = await axios({
        method: "POST",
        url: `https://api.pipedrive.com/v1/deals?api_token=${process.env.PIPEDRIVE_API_KEY}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: body
    });
  
    return resp.data

}

// Generate error response, log the details
function getErrorResponse(name, detail, status_code, response) {
    console.error(`[${new Date().toISOString()}] ${name}: ${detail.message}`);
    debug(detail);
    response.status(status_code).send({
        success: false,
        message: name
    })
}

function logImportantURLs() {
    debug("App started.");
    const domain = process.env.PROJECT_DOMAIN;
    const callBackUrl = `CallBack URL : https://${domain}.glitch.me/auth/callback`;
    const appPanelUrl = `Custom UI Panel URL : https://${domain}.glitch.me/ui/panel`;
    const appModalUrl = `Custom UI Modal URL : https://${domain}.glitch.me/ui/modal`;

    console.info(`🟢 App is running\n${callBackUrl}\n${appPanelUrl}\n${appModalUrl}`);
}

module.exports = {
    getNewToken,
    getDeal,
    createDeal,
    getErrorResponse,
    logImportantURLs
}