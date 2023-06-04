const Account = require("./account");
const util = require("../util/helper")
const debug = require('debug')('app:helper');

Account.sync();


// Get Access Token Associated with a company
const getToken = async (company_id) => {
    try {
        const record = await Account.findOne({
            where: {
                company_id
            }
        });
        if (record && String(record.dataValues.refresh_token).length > 1) {
            const token = await util.getNewToken(record.dataValues.refresh_token);
            return {
                success: true,
                value: token.data.access_token
            }
        } else
            return {
                success: false
            }
    } catch (error) {
        debug(error);
        throw new Error("Getting company from database failed");
    }
}

const getName = async (company_id) =>{
   try {
        const record = await Account.findOne({
            where: {
                company_id
            }
        });
        if (record && String(record.dataValues.company_name).length > 1) {
            console.log(record.dataValues.company_name);
            return String(record.dataValues.company_name);
        } else
            return {
                success: false
            }
    } catch (error) {
        debug(error);
        throw new Error("Getting name from database failed");
    }
}

// Creates a new company
const createCompany = async (company, token) => {
    try {
        await Account.upsert({
            company_id: company.company_id,
            company_name: company.company_name,
            access_token: token.access_token,
            refresh_token: token.refresh_token,
        });
    } catch (error) {
        debug(error);
        throw new Error("Creating company failed");
    }
}


module.exports = {
    getToken,
    getName,
    createCompany,

};