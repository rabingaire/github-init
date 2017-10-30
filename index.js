#!/usr/bin/env node

const TOKEN = require('./token');
const inquirer = require('inquirer');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const logUpdate = require('log-update');
const dns = require('dns');

const lang = require('../lang/default')

dns.lookup('github.com', err => {
    if (err) {
        logUpdate(`\n${chalk.red.bold(' ✘')}${chalk.dim('  Can\'t create the repository. Check your internet connection!\n')}`);
        process.exit(1);
    } else {
        const headers = {
            'Authorization': `token ${TOKEN}`
        };

        const defaultChoises: [
          "Yes",
          "No"
        ];

        const parameter = [{
            type: 'input',
            name: 'name',
            message: lang.repoName
        }, {
            type: 'input',
            name: 'description',
            message: lang.repoDesciption
        }, {
            type: 'rawlist',
            name: 'auto_init',
            message: lang.repoReadme,
            choices: defaultChoises
        }, {
            type: 'list',
            name: 'private',
            message: lang.repoMakePrivate,
            choices: defaultChoises
        }, ]

        inquirer.prompt(parameter).then(function(answers) {
            var data = {
                name: answers.name,
                description: answers.description,
                gitignore_template: "nanoc"
            };

            data.auto_init = answers.auto_init === 'Yes';
            data.private = answers.private === 'Yes';

            axios({
                    method: 'post',
                    url: '/user/repos',
                    baseURL: 'https://api.github.com',
                    headers: headers,
                    data: data
                }).then(function(response) {
                    const link = response.data.ssh_url;
                    console.log(chalk.bold.cyan('Repo Created, SSH URL is: ') + link);
                })
                .catch(function(error) {
                    const errorMessage = error.message;
                    console.log(chalk.red(errorMessage));
                });
        });
    }
})
