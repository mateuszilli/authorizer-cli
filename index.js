#!/usr/bin/env node

import cli from './src/cli.js';

process.stdin.on('data', cli);