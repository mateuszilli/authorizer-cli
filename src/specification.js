export default function specification(account_data) {
    const all_validations = {
        account: [
            account_already_initialize
        ],
        transaction: [
            account_not_initialized,
            card_not_active,
            insufficient_limit,
            high_frequency_small_interval,
            double_transaction
        ]
    };

    return {
        is_valid_account,
        is_valid_transaction
    }

    function is_valid_account(account) {
        const validation = isValid(all_validations.account, account);

        if (!validation) {
            account_data.active_card = account['active-card'];
            account_data.available_limit = account['available-limit'];
        }

        return validation;
    }

    function is_valid_transaction(transaction) {
        const validation = isValid(all_validations.transaction, transaction);

        if (!validation) {
            account_data.transactions.push(transaction);
            account_data.available_limit -= transaction['amount'];
        }

        return validation;
    }

    function isValid(validations, operation) {
        let violation;
        const { length }  = validations;

        for (let i = 0; i < length; i++) {
            const func = validations[i];

            const invalid = func(operation);
            if (invalid) {
                violation = func.name.replace(/_/g, '-');
                break;
            }
        }

        return violation;
    }

    function account_already_initialize() {
        return account_data.active_card && account_data.available_limit;
    }

    function account_not_initialized() {
        return !(account_data.active_card && account_data.available_limit);
    }

    function card_not_active() {
        return !account_data.active_card;
    }

    function insufficient_limit(transaction) {
        return transaction['amount'] > account_data.available_limit;
    }

    function high_frequency_small_interval(transaction) {
        let is_high_frequency_small_interval = false;

        const max_diff_time_seconds = 120;

        const time_new_transaction = new Date(transaction['time']);

        let count = 0;
        const { transactions } = account_data;
        const length = transactions.length - 1;
        for (var i = length; i >= 0; i--) {
            const time_old_transaction = new Date(transactions[i]['time']);
            const diff_time_seconds = (time_new_transaction.getTime() - time_old_transaction.getTime()) / 1000;

            if (diff_time_seconds <= max_diff_time_seconds) {
                count++;

                if (count > 2) {
                    is_high_frequency_small_interval = true;
                    break;
                }
            }
        }

        return is_high_frequency_small_interval;
    }

    function double_transaction(transaction) {
        let is_double_transaction = false;

        const max_diff_time_seconds = 120;

        const time_new_transaction = new Date(transaction['time']);
        const merchant_new_transaction = transaction['merchant'];
        const amount_new_transaction = transaction['amount'];

        const { transactions } = account_data;
        const length = transactions.length - 1;
        for (var i = length; i >= 0; i--) {
            const time_old_transaction = new Date(transactions[i]['time']);
            const merchant_old_transaction = transactions[i]['merchant'];
            const amount_old_transaction = transactions[i]['amount'];
            const diff_time_seconds = (time_new_transaction.getTime() - time_old_transaction.getTime()) / 1000;            

            if (
                diff_time_seconds <= max_diff_time_seconds &&
                merchant_new_transaction == merchant_old_transaction &&
                amount_new_transaction == amount_old_transaction
            ) {
                is_double_transaction = true;
                break;
            }
        }

        return is_double_transaction;
    }
}