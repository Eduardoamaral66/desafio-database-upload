import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async getOrCreateCategory(categoryTitle: string): Promise<Category> {
    const categoryFound = await this.findOne({
      title: categoryTitle,
    });
    if (categoryFound) {
      return categoryFound;
    }

    const category = this.create({ title: categoryTitle });

    await this.save(category);

    return category;
  }
}

export default CategoriesRepository;
