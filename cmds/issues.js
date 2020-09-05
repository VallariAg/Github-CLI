const ENDPOINT = "https://api.github.com/graphql";
const axios = require("axios");
require('dotenv').config();
const issue_output = require("./output/print_issue")


const get_issue_data = (owner, repository, issueNum = 1) => {
    const GET_ISSUE = `
query getIssue($owner: String!, $repository: String!, $issueNum: Int!){
    repository(owner: $owner, name: $repository) {
        description
        projectsUrl
    
    issue(number: $issueNum) {
      author {
        login
      }
      title
      url
      number
      createdAt
      closed
      labels(first: 20) {
        nodes {
          color
          name
        }
      }
      bodyText
      timelineItems(first: 100) {
        nodes {
          __typename
          ... on IssueComment {
            author {
              login
            }
            createdAt
            bodyText
          }
          ... on LabeledEvent {
            label {
              color
              name
            }
          }
        }
      }
      
    }
    }
}
`;
    const data = {
        query: GET_ISSUE,
        variables: { "owner": owner, repository: repository, issueNum: issueNum }
    }
    return data;
}




module.exports = async function (args) {
    let owner = args.owner
    let repository = args.repository
    let issueNum = args._[1]

    const config = {
        method: "POST",
        url: ENDPOINT,
        headers: {
            'Authorization': `bearer ${process.env.github_cli_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: get_issue_data(owner, repository, issueNum),
    };

    try {
        let response = await axios(config);
        // console.log(response.data)
        let repoDetails = response.data.data.repository;
        let issue_details = repoDetails.issue;

        issue_output(issue_details);
        //         console.log(`
        //   Author ${issue_details.author.login} commented: \n
        //   ${issue_details.bodyText} \n
        //     `);


        //         let all_comments = issue_details.comments.nodes;
        //         all_comments.forEach(node => {
        //             console.log(`
        //   ${node.author.login} commented: \n
        //   ${node.bodyText} \n
        //     `);
        //         });


    } catch (e) {
        console.log(`Something went wrong!\nError\n${e}`);
    }
}

