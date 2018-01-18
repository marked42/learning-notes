# Git

## Workflow

Questions should be asked evaluation a workflow for a team.

1. Does this workflow scale with team size ?
1. Is it easy to undo mistakes and errors with this workflow.
1. Does it impose any extra unnecessary cognitive overhead to the team ?

### Centralized Workflow

In centralized workflow, there exists a repository as central repository. Everyone makes their own copy of central repository and works on their own copy. After work is done on local copy, push their changes to central repository.

1. Initialize central repository.
    ```bash
    ssh user@host
    git init --bare /path/to/repo.git
    ```
1. Makes your own copy.
    ```bash
    git clone ssh://user@host/path/to/repo.git
    ```
1. Commit your work locally.
    ```bash
    git status
    git add .
    git commit
    ```
1. Pull latest central repository. Use `--rebase` to move your commit to tip of master branch.
    ```bash
    git pull --rebase origin master
    ```
1. Resolve conflicts one by one. Use `git rebase --abort` to go back where you started resolving conflicts.
    ```bash
    git status
    git add <some-file> # edit <some-file>
    git rebase --continue # continue resolving conflicts
    ```
1. Push changes to central repository.
    ```bash
    git push origin master
    ```

### Feature Branching Workflow

Core idea is that every featured should be developed on single dedicated branch instead of master branch. This allows a feature to be developed without disturbing `master` branch. After feature is complete, a pull request from feature branch to master branch can be created to merge feature code into master branch. This ensures that master branch is always stable and it's easy to apply continuous integration on it.

1. Create a new branch dedicated for specific feature.
    ```bash
    git checkout -b new-feature
    ```
1.  Develop and commit on local feature branch, maybe push it to central repository for to others to see.
    ```bash
    git push -u origin new-feature
    ```
1. Start a pull request to merge new-feature branch in central repository to master branch in central repository.
1. Somebody pulls latest master and new-feature branch in central repository. Merge new-feature branch to master branch, then push updated master branch to central repository.
    ```bash
    git checkout master
    git pull
    git pull origin new-feature
    git push
    ```

### Gitflow

Gitflow introduces develop branch dedicated for development.

1. master (permanant) - base branch.
1. dev (permanant) - development.
1. feature (temporary) - created from develop branch for certain feature, merged to develop branch when finished, then it's deleted
    ```bash
    git checkout -b some-feature develop
    git pull origin develop
    git checkout develop
    git merge some-feature
    git push
    git branch -d some-feature
    ```
1. release (temporary) - created from dev branch, after finished should be merged into master branch with tags, then it's deleted.
    ```bash
    git checkout -b release-0.1 develop
    git checkout master
    git merge release-0.1
    git push
    git checkout develop
    git merge release-0.1
    git push
    git branch -d release-0.1

    git tag -a 0.1 -m "Initial public release" master
    git push --tags
    ```
1. issue (temporary) - created from master for a bug fix.
    ```bash
    # create new branch.
    git checkout -b issue-#001 master

    # fix the bug and merge to master
    git checkout master
    git merge issue-#001
    git push

    # merge to dev and delete hotfix branch
    git checkout develop
    git merge issue-#001
    git push
    git branch -d issue-#001
    ```

There's extention tool for gitflow.