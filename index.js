#!/usr/bin/env node

const program = require('commander');
const TOKEN = require('./token');
const inquirer = require("inquirer");
const axios = require('axios');
const chalk = require('chalk');

var headers = {
  'Authorization': `token ${TOKEN}`
};

var parameter = [
  {
    type: 'input',
    name: 'name',
    message: 'Repository name: '
  },
  {
    type: 'input',
    name: 'description',
    message: 'Description: '
  },
  {
    type: 'list',
    name: 'auto_init',
    message: 'Initialize Readme?',
    choices: [
      "Yes",
      "No",
    ]
  },
  {
    type: 'list',
    name: 'private',
    message: 'Make Repository Private?',
    choices: [
      "Yes",
      "No",
    ]
  },
]

program
  .option('-r, --name <Repository>', 'Enter Repository name')
  .option('-d, --description  <Description >', 'Enter Description')
  .option('-i, --auto_init', 'Add this flag to initialize Readme')
  .option('-p, --private', 'Add this flag to make repository private')
  .action(function(init) {
    inquirer.prompt(parameter, function(response) {
      var data = {
        name: response.name,
        description: response.description,
        gitignore_template: "nanoc"
      };

      if(response.auto_init === 'Yes') {
        data.auto_init = true;
      } else {
        data.auto_init = false;
      }

      if(response.private === 'Yes') {
        data.private = true;
      } else {
        data.private = false;
      }

      axios({
        method:'post',
        url:'/user/repos',
        baseURL: 'https://api.github.com',
        headers: headers,
        data: data
      }).then(function(response) {
        var errorMessage;
        if(!response.message) {
          var link = response.ssh_url;
          console.log(chalk.bold.cyan('Repo Created, SSH URL is: ') + link);
          process.exit(0);
        } else if(response.message) {
          errorMessage = "Authentication failed!";
        } else {
          errorMessage = response.message;
        }
        console.log(chalk.red(errorMessage));
        process.exit(1);
      });
    });
  })
  .parse(process.argv);