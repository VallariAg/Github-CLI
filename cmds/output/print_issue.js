const chalk = require("chalk")
// const red = chalk.red()
function get_labels(labels) {
    if (labels) {
        labels.nodes.forEach(({ color, name }) => { console.log(chalk.inverse.hex(color)(name)) })
    }
    return ""
}
module.exports = (issue) => {

    // const title = issue.title;
    // const author = issue.author;
    // const label = issue.label;


    console.log(chalk(`
${chalk.bold("#" + issue.number + " " + issue.title)}   
${chalk.gray(issue.url)}
${get_labels(issue.labels)}

Author ${chalk.bold.green(issue.author.login)} commented:
${chalk.dim.green(issue.bodyText)} \n
`));


    let issue_nodes = issue.timelineItems.nodes;
    issue_nodes.forEach(node => {

        if (node.__typename == "IssueComment") {
            console.log(`
${chalk.bold.green(node.author.login)} commented: \n
${chalk.magenta(node.bodyText)} \n
`);
        }
        else if (node.__typename == "LabeledEvent") {
            // console.log(node)
            let color = node.label.color;
            let name = node.label.name;
            console.log(`
Added label ${chalk.inverse.hex(color)(name)}
`)
        }
    });
}
