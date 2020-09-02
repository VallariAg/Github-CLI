const ENDPOINT = "https://api.github.com/graphql";
const axios = require("axios");
require('dotenv').config();

const get_PR_query = () => {
  // owner, repository, PRnum
  // const GIT_PATH = process.cwd() + "/.git"
  const GET_PR = `
{
    repository(owner: "TaniaMalhotra", name: "Fake-News-Classifier-") {
        description
        projectsUrl
        pullRequest(number: 2){
          author {
            login
          }
          bodyText
          comments(first: 10) {
            totalCount
          }
        }
      }
}`;
  const data = {
    query: GET_PR,
    variables: {}
  }
  return data;
}




module.exports = (args) => {
  // args.owner
  // args.repository
  // args.
  console.log(" a pr here")
  const config = {
    method: "POST",
    url: ENDPOINT,
    headers: {
      // 'Authorization': "Token 6af3d4704ff1640571a31ab6aad73be5b8c3bcca",
      'Authorization': `bearer ${process.env.github_cli_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: get_PR_query(),
  };
  // axios.get(ENDPOINT, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': "bearer 6af3d4704ff1640571a31ab6aad73be5b8c3bcca",
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'
  //   },
  //   body: JSON.stringify({ query: get_PR_query() })
  // })
  axios(config)
    .then(r => JSON.stringify(r.data))
    .then((data) => console.log(data))
    .catch(e => console.log(e));
}

// 6af3d4704ff1640571a31ab6aad73be5b8c3bcca
