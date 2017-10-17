#!/usr/bin/env node

const TOKEN = require('./token');
const inquirer = require('inquirer');
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

inquirer.prompt(parameter).then(function (answers) {
  var data = {
    name: answers.name,
    description: answers.description,
    gitignore_template: "nanoc"
  };

  if(answers.auto_init === 'Yes') {
    data.auto_init = true;
  } else {
    data.auto_init = false;
  }

  if(answers.private === 'Yes') {
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
    var link = response.data.ssh_url;
    console.log(chalk.bold.cyan('Repo Created, SSH URL is: ') + link);
  })
  .catch(function (error) {
    var errorMessage;
    if(error.message) {
      errorMessage = "Authentication failed!";
    } else {
      errorMessage = error.message;
    }
    console.log(chalk.red(errorMessage));
  });
});