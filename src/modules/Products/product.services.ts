import { IProduct, Product } from "./../../common/models/product.model";
import ApiFeature from "../../utils/apiFeatures";
export default class ProductService {
  public async getAllProduct(queryString: object) {
    try {
      const apiFeature = await new ApiFeature(Product.find(), queryString)
        .filter()
        .sort()
        .paginate();

      const products = await apiFeature.query.populate(
        "user",
        "fullName alias"
      );
      return products;
    } catch (err) {
      throw err;
    }
  }
  public async getProduct(id: string) {
    try {
      const product = await Product.findById(id).populate(
        "user",
        "fullName alias"
      );
      return product;
    } catch (err) {
      throw err;
    }
  }
  public async createProduct(body: object) {
    try {
      const product = await Product.create(body);
      return product;
    } catch (err) {
      throw err;
    }
  }
  public async updateProduct(id: string, body: object) {
    try {
      const product = await Product.findOneAndUpdate({ _id: id }, body);
      return product;
    } catch (err) {
      throw err;
    }
  }
  public async deleteProduct(id: string) {
    try {
      await Product.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }
}
