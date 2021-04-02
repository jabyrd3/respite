#! /usr/bin/node
import RenderRunit from './tools/renderRunit.mjs';
import ParseConfig from './tools/parseConf.mjs';
import fs from 'fs';
console.log('hi from puk!')

new RenderRunit();
setTimeout(()=>{process.exit(0)}, 500000)
// ParseConfig();

