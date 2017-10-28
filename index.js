#!/usr/bin/env node

const axios = require('axios');
const chalk = require('chalk');
const dns = require('dns');
const inquirer = require('inquirer');
const lang = require('./lang/default')
const logUpdate = require('log-update');
const ora = require('ora');
const TOKEN = require('./token');


dns.lookup('github.com', err => {
    if (err) {
        logUpdate(`\n${chalk.red.bold(' ✘')}${chalk.dim('  Can\'t create the repository. Check your internet connection!\n')}`);
        process.exit(1);
    } else {
        const headers = {
            'Authorization': `token ${TOKEN}`
        };

        const parameter = [{
            type: 'input',
            name: 'name',
            message: lang.repoName
        }, {
            type: 'input',
            name: 'description',
            message: lang.repoDesciption
        }, {
            type: 'list',
            name: 'auto_init',
            message: lang.repoReadme,
            choices: [
                "Yes",
                "No",
            ]
        }, {
            type: 'list',
            name: 'private',
            message: lang.repoMakePrivate,
            choices: [
                "Yes",
                "No",
            ]
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
