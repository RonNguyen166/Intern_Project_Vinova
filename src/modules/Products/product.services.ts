import { IProduct, Product } from "./../../common/models/product.model";
import ApiFeature from "../../utils/apiFeatures";
export default class ProductService {
  public async getAllProduct(queryString: object): Promise<IProduct[]> {
    try {
      const apiFeature: ApiFeature = await new ApiFeature(
        Product.find({ status: true }),
        queryString
      )
        .filter()
        .sort()
        .paginate();

      const products: IProduct[] = await apiFeature.query.populate(
        "user",
        "fullName alias"
      );
      if (!products) {
        throw "Cannot get products";
      }
      return products;
    } catch (err) {
      throw err;
    }
  }

  public async getAllProductByBranchId(branchid: string): Promise<IProduct[]> {
    try {
      const products = await Product.find({ branch_id: branchid });
      if (!products) throw "Cannot get products with that branch id";
      return products;
    } catch (err) {
      throw err;
    }
  }

  public async getProduct(id: string): Promise<IProduct> {
    try {
      const product = await Product.findOne({ _id: id, status: true }).populate(
        "user",
        "fullName alias"
      );
      if (!product) {
        throw "Cannot get product";
      }
      return product;
    } catch (err) {
      throw err;
    }
  }

  public async createProduct(body: object): Promise<IProduct> {
    try {
      const product = await Product.create(body);
      if (!product) {
        throw "Cannot create product";
      }
      return product;
    } catch (err) {
      throw err;
    }
  }
  public async updateProduct(id: string, body: object): Promise<IProduct> {
    try {
      const product = await Product.findOneAndUpdate({ _id: id }, body);
      if (!product) {
        throw "Cannot update product";
      }
      return product;
    } catch (err) {
      throw err;
    }
  }
  public async deleteProduct(id: string): Promise<void> {
    try {
      await Product.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }
}
