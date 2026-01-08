const core = require('@actions/core');
const exec = require('@actions/exec');

const validateBranchName = ({ branchName }) => /[a-zA-Z0_\-\.\/]+$/.test(branchName);
const validateDirectoryName = ({ dirName }) => /[a-zA-Z0_\-\/]+$/.test(dirName);

async function run() {
    const baseBranch = core.getInput('base-branch');
    const targetBranch = core.getInput('target-branch');
    const workingDirectory = core.getInput('working-directory');
    const ghToken = core.getInput('gh-token');
    const debug = core.getBooleanInput('debug');

    core.setSecret(ghToken);
    if(!validateBranchName({ branchName: baseBranch })) {
        core.setFailed('Invalid base-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots and forward slashes.');
        return;
    }

    if(!validateBranchName({ branchName: targetBranch })) {
        core.setFailed('Invalid target-branch name. Branch names should include only characters, numbers, hyphens, underscores, dots and forward slashes.');
        return;
    }

    if(!validateDirectoryName({ dirName: workingDirectory })) {
        core.setFailed('Invalid working-directory name. Directory names should include only characters, numbers, hyphens, underscores and forward slashes.');
        return;
    }
    core.info(` [js-dependency-update] : base-branch is: ${baseBranch}`);
    core.info(` [js-dependency-update] : target-branch is: ${targetBranch}`);
    core.info(` [js-dependency-update] : working-directory is: ${workingDirectory}`);

    await exec.exec('npm update', [], {
        cwd: workingDirectory
    });

    const gitStatus = await exec.getExecOutput('git status -s package*.json', [], {
        cwd: workingDirectory
    });

    if(gitStatus.stdout.length > 0) {
        core.info(' [js-dependency-update] : There are updates available!');
    } else {
        core.info(' [js-dependency-update] : No updates at this point in time.');
    }

    core.info('I am a custom JS action');
}

run();