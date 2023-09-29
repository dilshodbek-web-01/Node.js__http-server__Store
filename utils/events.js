const { EventEmitter } = require("events");
const ee = new EventEmitter();

const Utils = require("./utils");
const Store = new Utils("./store/store.json");
const Users = new Utils("./store/users.json");

ee.on("pay", async ({ fromId, toId, amount }, allStore, allUsers) => {
  allStore[fromId - 1].kilo -= amount;
  allUsers[toId - 1].product += amount;

  Store.write([...allStore]);
  Users.write([...allUsers]);
});

module.exports = ee;
