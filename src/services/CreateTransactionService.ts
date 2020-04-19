import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = new CategoriesRepository();
    const transactionRepository = new TransactionsRepository();

    if (type === 'outcome') {
      await this.validateHaveBalance(value);
    }

    const categoryEnt = await categoriesRepository.getOrCreateCategory(
      category,
    );

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryEnt.id,
    });
    transactionRepository.save(transaction);

    return transaction;
  }

  private async validateHaveBalance(value: number): Promise<boolean> {
    const transactionRepository = new TransactionsRepository();
    const balance = await transactionRepository.getBalance();

    if (balance.total - value < 0) {
      throw new AppError('Balance error');
    }
    return true;
  }
}

export default CreateTransactionService;
