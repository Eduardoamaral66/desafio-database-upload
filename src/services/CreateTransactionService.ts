import { getCustomRepository } from 'typeorm';
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
    const categoriesRepository = getCustomRepository(CategoriesRepository);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      await this.validateHaveBalance(value);
    }

    const categoryEnt = await categoriesRepository.getOrCreateCategory(
      category,
    );
    console.log(`title:${title};  category:${categoryEnt}`);
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryEnt.id,
    });
    await transactionRepository.save(transaction);

    return transaction;
  }

  private async validateHaveBalance(value: number): Promise<boolean> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionRepository.getBalance();
    if (balance.total - value < 0) {
      throw new AppError('Balance error');
    }
    return true;
  }
}

export default CreateTransactionService;
