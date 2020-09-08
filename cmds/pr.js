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
  console.log(`Author ${chalk.bold.green(pr.author.login)} commented:`);
  console.group();
  console.log(`${chalk.cyanBright(pr.bodyText)} \n`);


  let issue_nodes = pr.timelineItems.nodes;
  issue_nodes.forEach(node => {

    if (node.__typename == "IssueComment") {
      console.log(`${chalk.bold.green(node.author.login)} commented: \n`);
      console.group();
      console.log(`${chalk.blueBright(node.bodyText)} \n`);
      console.groupEnd();
    }
    else if (node.__typename == "PullRequestCommit") {
      console.log(`${chalk.bold.green(node.commit.author.name)} commited ${chalk.inverse.grey(node.commit.abbreviatedOid)}`)
      console.group();
      console.log(chalk.grey(`${node.commit.messageHeadline}\n`))
      console.groupEnd();
    }
    else if (node.__typename == "LabeledEvent") {
      let color = node.label.color;
      let name = node.label.name;
      console.log(`Added label ${chalk.inverse.hex(color)(name)}`);
    }
  });
}
