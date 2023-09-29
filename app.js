const http = require("http");

const Utils = require("./utils/utils");
const ee = require("./utils/events");
const mdFruit = require("./models/Fruit");
const mdUser = require("./models/User");

const Store = new Utils("./store/store.json");
const Users = new Utils("./store/users.json");

const bodyParser = (request) => {
  return new Promise((resolve, reject) => {
    try {
      request.on("data", (chunk) => {
        resolve(JSON.parse(chunk));
      });
    } catch (error) {
      reject();
    }
  });
};

const io = async (request, response) => {
  if (request.url === "/add/product" && request.method === "POST") {
    const { name, price, kilo } = await bodyParser(request);
    const allStore = await Store.read();
    const allStoreCount = allStore.length;
    const newFruit = new mdFruit(
      allStoreCount + 1,
      name,
      price,
      kilo,
      new Date()
    );
    Store.write([...allStore, newFruit]);

    response.writeHead(201, {
      "Content-Type": "Application/json",
    });
    response.end(JSON.stringify({ message: "muvaffaqiyatli qo`shildi." }));
  } else if (
    request.url === `/add/product/${urlID}` &&
    request.method === "PUT"
  ) {
    const { name } = await bodyParser(request);
    const allStore = await Store.read();
    const changeName = allStore.find((element) => element.id == urlID);
    changeName.name = name;
    write("store", [...allStore]);
    response.end(JSON.stringify({ message: "muvaffaqiyatli o`zgartirildi." }));

  } else if (
    request.url === `/add/product/${urlID}` &&
    request.method === "DELETE"
  ) {
    const allStore = await Store.read();
    const deleteFruit = allStore.filter((element) => element.id != urlID);
    write("store", [...deleteFruit]);
    response.end(JSON.stringify({ message: "muvaffaqiyatli o`chirildi." }));

  } else if (request.url === "/add/user" && request.method === "POST") {
    const { name, budget, product } = await bodyParser(request);
    const allUsers = await Users.read();
    const allUsersCount = allUsers.length;
    const newUser = new mdUser(
      allUsersCount + 1,
      name,
      budget,
      product,
      new Date()
    );
    Users.write([...allUsers, newUser]);

    response.writeHead(201, {
      "Content-Type": "Application/json",
    });
    response.end(JSON.stringify({ message: "muvaffaqiyatli qo`shildi." }));
  } else if (request.url === "/storeToUser" && request.method === "POST") {
    const { fromStore, toUser, amount } = await bodyParser(request);
    const allStore = await Store.read();
    const allUsers = await Users.read();

    const findFruit = allStore.find((element) => {
      return element.id === fromStore;
    });

    const findUser = allUsers.find((user) => {
      return user.id === toUser;
    });

    if (findFruit.kilo < amount) {
      response.writeHead(200, {
        "Content-Type": "Application/json",
      });
      return response.end(JSON.stringify({ message: "Mablag` yetarli emas." }));
    }

    ee.emit(
      "pay",
      { fromId: findFruit.id, toId: findUser.id, amount },
      allStore,
      allUsers
    );

    response.writeHead(200, {
      "Content-Type": "Application/json",
    });
    response.end(JSON.stringify({ message: "Muvaffaqiyatli o`kazildi." }));
  } else if (request.url === "/get/users" && request.method === "GET") {
    const allUsers = await Users.read();
    const allReadUsers = allUsers.filter((users) => {
      return users;
    });

    response.writeHead(200, {
      "Content-Type": "Application/json",
    });
    response.end(JSON.stringify(allReadUsers));
  } else if (request.url === "/get/products" && request.method === "GET") {
    const allStore = await Store.read();
    const allReadStore = allStore.filter((products) => {
      return products;
    });

    response.writeHead(200, {
      "Content-Type": "Application/json",
    });
    response.end(JSON.stringify(allReadStore));
  }
};

http.createServer(io).listen(5555, () => {
  console.log("Ishlamoqda.");
});
