#!/usr/bin/env node

import Account from './lib/account.js';

process.stdin.on('data', (stdin) => {
    let results = [];
    let objectAccount = new Account();
    const operations = JSON.parse(stdin);

    const { length } = operations;
    for (let index = 0; index < length; index++) {
        let violations = []
        let operation = operations[index];
        const { account, transaction } = operation; 

        if (account) {
            if (objectAccount.exist()) {
                violations.push('account-already-initialized')
            } else {
                objectAccount.setActiveCard(account['active-card']);
                objectAccount.setAvailableLimit(account['available-limit']);
            }
        } else if (transaction) {
            if (!objectAccount.exist()) {
                violations.push('account-not-initialized');
            } else if (!objectAccount.getActiveCard()) {
                violations.push('card-not-active');
            } else if (transaction['amount'] > objectAccount.getAvailableLimit()) {
                violations.push('insufficient-limit');
            } else if (1 == 2) {
                violations.push('high-frequency-small-interval');
            } else if (1 == 2) {
                violations.push('double-transaction');
            } else {
                const newAvailableLimit = objectAccount.getAvailableLimit() - transaction['amount'];
                objectAccount.setAvailableLimit(newAvailableLimit);
            }
        }

        results.push({
            'account': { 
                'active-card': objectAccount.getActiveCard(), 
                'available-limit': objectAccount.getAvailableLimit()
            },
            'violations': violations
        });
    }

    const stdout = JSON.stringify(results);
    process.stdout.write(`${stdout}\n`);
});