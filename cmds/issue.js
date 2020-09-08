const chalk = require("chalk")
const fetch_issue = require("../utils/fetch")
const ora = require("ora");

function get_labels(labels) {
    if (labels) {
        labels.nodes.forEach(({ color, name }) => { console.log(chalk.inverse.hex(color)(name)) })
    }
    return ""
}

module.exports = async (args) => {
    loader = ora("Loading issue").start()
    let issue = await fetch_issue(args);
    loader.stop();

    if (!issue) {
        console.log("failed to fetch issue data");
        return;
    }

    get_labels(issue.labels);
    console.log(`
${chalk.bold("#" + issue.number + " " + issue.title)}   
${chalk.gray(issue.url)}

Author ${chalk.bold.green(issue.author.login)} commented:`);
    console.group();
    console.log(`${chalk.cyanBright(issue.bodyText)} \n`);


    let issue_nodes = issue.timelineItems.nodes;
    issue_nodes.forEach(node => {

        if (node.__typename == "IssueComment") {
            console.log(`${chalk.bold.green(node.author.login)} commented: \n`);
            console.group();
            console.log(`${chalk.blueBright(node.bodyText)} \n`);
            console.groupEnd();
        }
        else if (node.__typename == "LabeledEvent") {
            let color = node.label.color;
            let name = node.label.name;
            console.log(`Added label ${chalk.inverse.hex(color)(name)}`);
        }
    });
}
