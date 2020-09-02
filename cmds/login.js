const axios = require("axios")

module.exports = async function (client_id) {

    let config = {
        method: "POST",
        url: "https://github.com/login/device/code",
        data: { client_id: client_id },
        headers: {
            'Content-Type': "application/json",
            'Accept': "application/json"
        }
    }

    try {

        let response = await axios(config);
        response = response.data;

        let device_code, user_code, verification_uri;
        user_code = response["user_code"]
        verification_uri = response["verification_uri"]
        device_code = response["device_code"]

        console.log(`
    Go to ${verification_uri} 
    And enter this code there: ${user_code}
    After confirming acitivation, run:
    github-cli verify
    `);
        return device_code;

    } catch (e) {
        console.log(e);
        throw e;
    }
}
