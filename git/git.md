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
