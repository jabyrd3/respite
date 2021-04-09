#! /usr/bin/node
import RenderRunit from './tools/renderRunit.mjs';
import ParseConfig from './tools/parseConf.mjs';
import fs from 'fs';
console.log('hi from puk!')

new RenderRunit();
// todo: set up server and whatnot
setTimeout(()=>{process.exit(0)}, 500000000)
// ParseConfig();

