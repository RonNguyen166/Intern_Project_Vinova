export default class APIFeatures {
  query: any;
  queryString: any;
  constructor(query: any, queryString: object) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedField = ["page", "size", "sortBy", "orderBy", "type"];
    excludedField.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sortBy) {
      let sortBy = this.queryString.sortBy;
      if (this.queryString.orderBy) {
        sortBy = `${this.queryString.orderBy[0]}${sortBy}`;
      }
      this.query.sort(sortBy);
    } else {
      this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1;
    const size = this.queryString.size * 1;
    const skip = (page - 1) * size;
    this.query = this.query.skip(skip).limit(size);
    return this;
  }
}
