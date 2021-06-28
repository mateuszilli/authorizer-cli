export default class Account {
    #active_card;
    #available_limit;
    #transactions = [];


    getActiveCard() {
        return this.#active_card;
    }

    setActiveCard(active_card) {
        this.#active_card = active_card;
    }

    getAvailableLimit() {
        return this.#available_limit;
    }

    setAvailableLimit(available_limit) {
        this.#available_limit = available_limit;
    }

    getTransactions() {
        return this.#transactions;
    }

    setTransactions(transactions) {
        this.#transactions = transactions;
    }

    exist() {
        return this.#active_card && this.#available_limit;
    }
}