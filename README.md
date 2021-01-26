# Intro
Tracking time without leaving command line using [Toggl](https://www.toggl.com/).

To start tracking time, you will need the API token that you can grab from your toggl [profile page](https://www.toggl.com/app/profile).

On the first run, the program will ask you for the API token.

# Install

```console
$ npm install toggl -g
```

# Usage
```
Usage: node-toggl <command>

Available commands:
  help                                            prints this screen
  list-tags                                       prints all your tags in default workspace
  start "entry description"                       creates a new time entry assigned to a project (choose from list)
  start "entry description" -t tag1,tag2          creates a new time entry with tags: tag1,tag2
  start "entry description" -t tag1,tag2 -p       creates a new time entry with tags: tag1,tag2 and assign to a project (choose from list)
  status                                          get current task status
  stop                                            stops current task

```

## Start a new task

```console
$ toggl start working on issue 34
```

or

```console
$ toggl working on issue 34
```

(```start``` is optional)

Every task should be assigned to a project, select one of the project listed with the arrow keys and the *TAB* entry.
Insert a new string to create a new project in default workspace.