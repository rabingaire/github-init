#!/usr/bin/env node

const axios = require('axios');
const chalk = require('chalk');
const dns = require('dns');
const inquirer = require('inquirer');
const lang = require('./lang/default')
const logUpdate = require('log-update');
const ora = require('ora');
const execa = require('execa');
const pAny = require('p-any');
const TOKEN = require('./token');

const spinner = ora();

dns.lookup('github.com', err => {
    if (err) {
        logUpdate(`\n${chalk.red.bold(' ✘')}${chalk.dim('  Can\'t create the repository. Check your internet connection!\n')}`);
        process.exit(1);
    } else {
        const headers = {
            'Authorization': `token ${TOKEN}`
        };

        logUpdate();

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

        inquirer.prompt(parameter).then(answers => {
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
                }).then(response => {
                    const link = response.data.ssh_url;
                    spinner.text = ' Cloning';
                    logUpdate();
                    spinner.start();
                    execa('git', ['clone', `${link}`]).then(res => {
                        logUpdate(`\n ${chalk.blue.bold('✓')} Done 

 ${chalk.blue.bold('✓')} Cloned in ~ ${process.cwd()}/${answers.name}\n`);
                        spinner.stop();
                    })

                })
                .catch(error => {
                    const errorMessage = error.message;
                    console.log(`\n${chalk.red('✘')} Could not create the repository ${chalk.dim('[Unprocessable Entity]')}\n`);
                });
        });
    }
})