const path = require('path');
const co = require('co');
const prompt = require('co-prompt');
const fs = require('fs-extra');
const exec = require('child_process').exec;
const inquirer = require('inquirer');
const getConfig= require('../template');


module.exports = (projectName,remote)=>{
    co(function* () {
        const templateName = yield prompt('template name(test):')
        const projectPath = path.resolve(process.cwd(),projectName);
        fs.emptyDir(projectPath,function (error) {
            handleError(error);
            console.log('\n finish clear dir');
            const fn = function () {
                console.log(`\n cd ${projectName} && npm install`);
                addPlugins(projectName).then(r => {
                    console.log('\n npm install  completed');
                });
            }
            clone(projectPath,templateName,fn)

        })
    })
    function handleError(error) {
        if(!error){ return false}
        console.log(error)
        process.exit();
    }
    function clone(projectPath,templateName,callback) {
        co(function* () {
                const config = getConfig[templateName];
                const url = config.url;
                const branch = config.branch;

                const cmdStr = `git clone -b ${branch} ${url} ${projectPath}`;
            console.log('\n git clone start ...');
                exec(cmdStr,(error)=>{
                    handleError(error);
                    console.log('\n git clone completed');
                    callback();
                })
        })

    }
    async function addPlugins(projectName) {

        const options =  await  inquirer.prompt([{
            name: 'plugins',
            type: 'checkbox',
            message: `install vue vue-router vuex? `,
            choices: ['vue','vue-router','vuex']
        }])
        const pluginsString = options.plugins.join(' ');
        if(options.plugins.length !=0){
            console.log(`\n ${pluginsString} install start ...`);
            const cmdStr =`cd ${projectName} && npm install ${pluginsString}`
            exec(cmdStr,(error)=>{
                handleError(error);
                console.log(`\n ${pluginsString} install completed`);
                process.exit();
            })
        }

    }

}
