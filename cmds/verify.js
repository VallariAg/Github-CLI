const axios = require("axios")

module.exports = async function (clientID, device_code) {
    let config = {
        method: "POST",
        url: "https://github.com/login/oauth/access_token",
        params: {
            client_id: clientID,
            device_code: device_code,
            grant_type: "urn:ietf:params:oauth:grant-type:device_code"
        },
        headers: {
            'Content-Type': "application/json",
            'Accept': "application/json"
        }
    };
    try {
        let { data } = await axios(config);

        if (data.access_token) {
            let access_token = data.access_token;
            // process.env.github_cli_token = access_token;
            console.log("You're all set!")
            return access_token;
        } else {
            throw console.error(`Something went wrong! ${data}`);

        }

    } catch (e) {
        console.log(e);
    }

}
