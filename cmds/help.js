module.exports = (args) => {
    if (args.help || args.h) {
        console.log(` help in specific commands`)
    } else {
        console.log(`
usage: github-cli [--help][--repository][--owner] <command are> [<args>]

The most commonly used github-cli commands are:
    login       Authorize github
    verify      Grant github access to github-cli
    pr <id>     View Pull Request messages of #ID 

See 'git --help <command>' to read about specific command.
`)
    }
}
