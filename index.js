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
            } 

            if (!violations.length) {
                const timeTransaction = new Date(transaction['time']);
                let transactions = objectAccount.getTransactions();

                let highFrequencySmallInterval = false;
                let countHighFrequencySmallInterval = 0;
                let lengthTimeTransaction = transactions.length - 1;
                for (var i = lengthTimeTransaction; i >= 0; i--) {
                    const time = new Date(transactions[i]['time']);
                    const diff = ((((timeTransaction - time) % 86400000) % 3600000) / 60000);

                    if (diff <= 2) {
                        countHighFrequencySmallInterval++;

                        if (countHighFrequencySmallInterval > 2) {
                            highFrequencySmallInterval = true;
                        }
                    }
                }

                if (highFrequencySmallInterval) {
                    violations.push('high-frequency-small-interval');
                } else if (1 == 2) {
                    violations.push('double-transaction');
                } else {
                    transactions.push(transaction);
                    objectAccount.setTransactions(transactions);

                    const newAvailableLimit = objectAccount.getAvailableLimit() - transaction['amount'];
                    objectAccount.setAvailableLimit(newAvailableLimit);
                }
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