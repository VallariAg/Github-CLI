const chalk = require("chalk")
const fetch_issue = require("../utils/fetch")
const ora = require("ora");

function get_labels(labels) {
  if (labels) {
    labels.nodes.forEach(({ color, name }) => { console.log(chalk.inverse.hex(color)(name)) })
  }
}

module.exports = async (args) => {
  loader = ora("Loading Pull request").start()
  let pr = await fetch_issue(args);
  loader.stop();

  if (!pr) {
    console.log("failed to fetch pull request data");
    return;
  }

  console.log(`
${chalk.bold("#" + pr.number + " " + pr.title)}   
${chalk.gray(pr.url)}`);
  get_labels(pr.labels);
  console.group();
  console.log(`Author ${chalk.bold.green(pr.author.login)} commented:`);
  console.log(`${chalk.cyanBright(pr.bodyText)} \n`);
  console.groupEnd();

  let issue_nodes = pr.timelineItems.nodes;
  issue_nodes.forEach(node => {
    switch (node.__typename) {
      case "IssueComment": {
        console.group();
        console.log(`📝  ${chalk.bold.green(node.author.login)} commented: `);
        console.group();
        console.log(`${chalk.blueBright(node.bodyText)} \n`);
        console.groupEnd();
        console.groupEnd();
        break;
      }
      // 🔗
      case "PullRequestCommit": {
        console.group();
        console.log(`🔗 ${chalk.bold.green(node.commit.author.user.login)} commited ${chalk.inverse.grey(node.commit.abbreviatedOid)}`)
        console.group();
        console.log(chalk.grey(`${node.commit.messageHeadline}\n`))
        console.groupEnd();
        console.groupEnd();
        break;
      }
      case "LabeledEvent": {
        let color = node.label.color;
        let name = node.label.name;
        // console.groupEnd()
        console.log(`- ${chalk.inverse.hex(color)(name)} label added\n`);
        // console.group()
        break;
      }
      case "UnlabeledEvent": {
        let color = node.label.color;
        let name = node.label.name;
        // console.groupEnd()
        console.log(`${chalk.inverse.hex(color)(name)} label removed\n`);
        // console.group()
        break;
      }
      case "MergedEvent": {
        let merger = node.actor.login;
        let commitId = node.commit.abbreviatedOid;
        // console.groupEnd()
        console.log(`🔄 ${chalk.bold.green(merger)} merged commit ${chalk.inverse.grey(commitId)} into ${chalk.underline(node.mergeRefName)}\n`);
        // console.group()
        break;
      }
      case "HeadRefDeletedEvent": {
        let actor = node.actor.login;
        let ref = node.headRefName;
        console.log(`${chalk.bold.green(actor)} deleted the ${chalk.underline(ref)} branch\n`);
        break;
      }
      case "HeadRefRestoredEvent": {
        let actor = node.actor.login;
        let ref = node.pullRequest.headRefName;
        console.log(`${chalk.bold.green(actor)} restored the ${chalk.underline(ref)} branch\n`);
        break;
      }
      case "ReferencedEvent": {
        let { abbreviatedOid, messageHeadline, author } = node.commit;
        console.log(`📍 ${chalk.bold.green(author.user.login)} added a commit (${abbreviatedOid}) that referenced this pull request
        ${chalk.dim(messageHeadline)}\n`);
        break;
      }
    }
  });
}
