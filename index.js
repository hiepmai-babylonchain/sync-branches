const core = require("@actions/core");
const github = require("@actions/github");

// most @actions toolkit packages have async methods
async function run() {
  const fromBranch = core.getInput("FROM_BRANCH");
  const toBranch = core.getInput("TO_BRANCH");
  try {
    console.log(`Making a PR to ${toBranch} from ${fromBranch}`);
    const actionContext = JSON.stringify(github.context, undefined, 2);
    const {
      payload: { repository }
    } = actionContext;

    const githubToken = core.getInput("GITHUB_TOKEN");

    const octokit = new github.GitHub(githubToken);

    const { data: pullRequest } = await octokit.pulls.create({
      owner: repository.owner,
      repo: repository.name,
      title: `sync: ${fromBranch} to ${toBranch}`,
      head: fromBranch,
      base: toBranch
    });

    console.log(pullRequest);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
