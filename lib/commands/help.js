'use strict';

module.exports = function printHelp() {
  const help = `
Usage: node-toggl <command>

Available commands:
  help                                            prints this screen
  list-tags                                       prints all your tags in default workspace
  start "entry description"                       creates a new time entry assigned to a project (choose from list)
  start "entry description" -t tag1,tag2          creates a new time entry with tags: tag1,tag2
  start "entry description" -t tag1,tag2 -p       creates a new time entry with tags: tag1,tag2 and assign to a project (choose from list)
  status                                          get current task status
  stop                                            stops current task

  `
  console.log(help);
}