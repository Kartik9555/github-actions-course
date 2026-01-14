const core = require('@actions/core');

async function run() {
    const prTitle = core.getInput('pr-title', { required: true });

    if(prTitle.startsWith("feat")){
        core.info("PR is a feature");
    } else {
        core.info("PR is not a feature")
    }
}

run();