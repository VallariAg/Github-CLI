const ENDPOINT = "https://api.github.com/graphql";
const axios = require("axios");
require('dotenv').config();

const get_pr_data = require("./query/pr")
const get_issue_data = require("./query/issue")


module.exports = async function (args) {
  const owner = args.owner
  const repository = args.repository
  const id = args._[1]
  const cmd = args._[0]

  let query_data = cmd == "issue" ? get_issue_data(owner, repository, id) : get_pr_data(owner, repository, id)

  const config = {
    method: "POST",
    url: ENDPOINT,
    headers: {
      'Authorization': `bearer ${process.env.github_cli_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: query_data,
  };

  let response;
  try {
    response = await axios(config);

  } catch (e) {
    console.log(`\nSomething went wrong!\n${e}\n`);
    return;
  }
  let repoDetails = response.data.data.repository;
  let issue_pr = (cmd === "issue") ? repoDetails.issue : repoDetails.pullRequest;
  return issue_pr;
}

