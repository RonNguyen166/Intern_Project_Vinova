import { ITag, Tag } from "./../../common/models/tag.model";
import ApiFeatures from "../../utils/apiFeatures";
export default class TagService {
  public async getAllTag() {
    try {
      const tags = await Tag.find();
      return tags;
    } catch (err) {
      throw err;
    }
  }
  public async getTrendingTag() {
    try {
      const apiFeatures = new ApiFeatures(Tag.find(), {
        sortBy: "amount",
        orderBy: "-1",
        page: 1,
        size: 5,
      })
        .filter()
        .sort()
        .paginate();
      const tags = await apiFeatures.query;
      return tags;
    } catch (err) {
      throw err;
    }
  }
  public async createTag(body: object) {
    try {
      const tag = await Tag.create(body);
      return tag;
    } catch (err) {
      throw err;
    }
  }
}
