#!/usr/bin/env node

'use strict';

process.env.NODE_PATH = __dirname+'/../node_modules/';
const program = require('commander');

program
    .version(require('../package').version)
    .usage('<command> [options]')

program.command('create <projectName>')
    .option('--remote','clone remote git project')
    .description('create a new project, the options [--remote] is clone git')
    .action((programName,cmd)=>require('../command/init')(programName,cmd.remote));
program.parse(process.argv);
if(!program.args.length){
    program.help()
}
