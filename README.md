
Tracking time without leaving command line using [Toggl](https://www.toggl.com/).

To start tracking time, you will need the API token that you can grab from your toggl [profile page](https://www.toggl.com/app/profile).

On the first run, the program will ask you for the API token.

### Install

```console
$ npm install toggl -g
```

### Usage

#### Start a new task

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

#### Stop a task

```console
$ toggl stop
```

