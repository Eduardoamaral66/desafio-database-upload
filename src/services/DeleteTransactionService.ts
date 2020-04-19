import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = new TransactionsRepository();
    const transaction = await transactionRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found!');
    }

    await transactionRepository.delete(transaction.id);
  }
}

export default DeleteTransactionService;
