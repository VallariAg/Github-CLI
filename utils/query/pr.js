module.exports = (owner, repository, id = 1) => {

  const GET_PR = `
query pullreq($owner: String!, $repository: String!, $id: Int!){
  repository(owner: $owner, name: $repository) {
    projectsUrl

    pullRequest(number: $id) {
      number
      author {
        login
      }
      title
      url
      createdAt
      closed
      labels(first: 10) {
        nodes {
          color
          name
        }
      }
      bodyText
      timelineItems(first: 100) {
        nodes {
          __typename
          ... on PullRequestCommit {
            commit {
              abbreviatedOid
              messageHeadline
              author {
                user {
                  login
                }
              }
            }
          }
          ... on IssueComment {
            bodyText
            author {
              login
            }
          }
          ... on CrossReferencedEvent {
            actor {
              login
            }

          }
          ... on LabeledEvent {
            actor {
              login
            }
            label {
               color
              name
            }
          }
          ... on UnlabeledEvent {
            actor {
              login
            }
            label {
               color
              name
            }
          }
          ... on MergedEvent {
            actor {
              login
            }
            commit {
              abbreviatedOid
            }
            mergeRefName
          }
          ... on HeadRefDeletedEvent {
            actor {
              login
            }
            headRefName
          }
          ... on HeadRefRestoredEvent {
            actor {
              login
            }
            pullRequest {
              headRefName
            }
          }
          ... on ReferencedEvent {
            commit {
              abbreviatedOid
              messageHeadline
              author {
                user {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
}
`

  const data = {
    query: GET_PR,
    variables: { owner: owner, repository: repository, id: id }
  }
  return data;
}
