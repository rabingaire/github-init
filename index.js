#!/usr/bin/env node

'use strict';

const axios = require('axios');
const chalk = require('chalk');
const dns = require('dns');
const execa = require('execa');
const fs = require('fs');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const jsonFile = require('jsonfile');
const logUpdate = require('log-update');
const os = require('os');
const ora = require('ora');
const updateNotifier = require('update-notifier');
const lang = require('./lang/default');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const spinner = ora();

const token = `${os.homedir()}/.repogit/token.json`;
const obj = {
	token: 'Put your access token here!'
};

if (!fs.existsSync(token)) {
	fse.ensureFile(token, err => {
		logUpdate(err);
		jsonFile.writeFile(token, obj, err => {
			logUpdate(err);
		});
	});
}

dns.lookup('github.com', err => {
	if (err) {
		logUpdate(`\n${chalk.red.bold(' ✘')}${chalk.dim('  Can\'t create the repository. Check your internet connection!\n')}`);
		process.exit(1);
	} else {
		jsonFile.readFile(token, (err, keys) => {
			logUpdate(err);
			const key = keys.token;

			const headers = {
				Authorization: `token ${key}`
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
					'Yes',
					'No'
				]
			}, {
				type: 'list',
				name: 'private',
				message: lang.repoMakePrivate,
				choices: [
					'Yes',
					'No'
				]
			}, {
				type: 'list',
				name: 'clone',
				message: lang.repoClone,
				choices: [
					'Yes',
					'No'
				]
			}];

			inquirer.prompt(parameter).then(answers => {
				const data = {
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
					if(answers.clone) {
						spinner.text = ' Cloning';
						logUpdate();
						spinner.start();
						execa('git', ['clone', `${link}`]).then(() => {
							logUpdate(`\n ${chalk.blue.bold('✓')} Done \n\n ${chalk.blue.bold('✓')} Cloned in ~ ${process.cwd()}/${answers.name}\n`);
							spinner.stop();
						});
					} else {
						console.log(`\n ${chalk.blue.bold('✓')} Done \n\n ${chalk.blue.bold('✓')} Repo Created, SSH URL is: ${link}`);
					}
				}).catch(err => {
					if (err) {
						console.log(`\n${chalk.red('✘')} Could not create the repository ${chalk.dim('[Unprocessable Entity]')}\n`);
					}
				});
			});
		});
	}
});
