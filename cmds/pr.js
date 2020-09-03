const ENDPOINT = "https://api.github.com/graphql";
const axios = require("axios");
require('dotenv').config();

const get_PR_query = (owner, repository, PRnum = 1) => {
  // owner, repository, PRnum
  // const GIT_PATH = process.cwd() + "/.git"
  const GET_PR = `
query getPR($owner: String!, $repository: String!, $PRnum: Int!){
    repository(owner: $owner, name: $repository) {
        description
        projectsUrl
        pullRequest(number: $PRnum){
          author {
            login
          }
          bodyText
          comments(first: 20) {
            totalCount
            nodes {
              author {
                login
              }
              bodyText
            }
          }
        }
      }
}`;
  const data = {
    query: GET_PR,
    variables: { "owner": owner, repository: repository, PRnum: PRnum }
  }
  return data;
}




module.exports = async function (args) {
  let owner = args.owner
  let repository = args.repository
  let PRnum = args._[1]

  const config = {
    method: "POST",
    url: ENDPOINT,
    headers: {
      'Authorization': `bearer ${process.env.github_cli_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: get_PR_query(owner, repository, PRnum),
  };

  try {
    let response = await axios(config);
    let repoDetails = response.data.data.repository;
    let PR_details = repoDetails.pullRequest;


    console.log(`
  Author ${PR_details.author.login} commented: \n
  ${PR_details.bodyText} \n
  Comments: ${PR_details.comments.totalCount}
    `);


    let all_comments = PR_details.comments.nodes;
    all_comments.forEach(node => {
      console.log(`
  ${node.author.login} commented: \n
  ${node.bodyText} \n
    `);
    });


  } catch (e) {
    console.log(`something went wrong! ${e}`);
  }
}

