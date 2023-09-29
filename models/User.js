class User {
  id;
  name;
  budget;
  product;
  date;
  constructor(id, name, budget, product, date) {
    this.id = id;
    this.name = name;
    this.budget = budget;
    this.product = product;
    this.date = date;
  }
}

module.exports = User;
