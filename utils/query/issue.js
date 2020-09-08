module.exports = (owner, repository, id = 1) => {
  const GET_ISSUE = `
query getIssue($owner: String!, $repository: String!, $id: Int!){
    repository(owner: $owner, name: $repository) {
        description
        projectsUrl
        issue(number: $id) {
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
    variables: { owner: owner, repository: repository, id: id }
  }
  return data;
}
