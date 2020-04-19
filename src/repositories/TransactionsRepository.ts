import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const totalIncome = allTransactions.reduce((sum, transaction) => {
      return transaction.type === 'income' ? sum + transaction.value : sum;
    }, 0);

    const totalOutcome = allTransactions.reduce((sum, transaction) => {
      return transaction.type === 'outcome' ? sum + transaction.value : sum;
    }, 0);

    const balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
