import account_data from './account_data.js';
import specification from './specification.js';

export default function cli(stdin) {
    const operations = JSON.parse(stdin);
    let operations_results = [];

    const { length } = operations;
    for (let i = 0; i < length; i++) {
        const operation = operations[i];
        const { account, transaction } = operation;

        let violation;

        if (account) {
            violation = specification(account_data).is_valid_account(account);
        }

        if (transaction) {
            violation = specification(account_data).is_valid_transaction(transaction);
        }

        operations_results.push({
            'account': { 
                'active-card': account_data.active_card, 
                'available-limit': account_data.available_limit
            },
            'violations': violation ? [violation] : []
        });
    }

    const stdout = JSON.stringify(operations_results);
    process.stdout.write(`${stdout}\n`);
}