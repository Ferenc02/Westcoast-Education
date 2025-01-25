var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import showMessageBox from "./errorHandling.js";
export function validateUser() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let authToken = (_a = document.cookie
            .split(";")
            .find((row) => row.startsWith("authToken="))) === null || _a === void 0 ? void 0 : _a.split("=")[1];
        if (!authToken) {
            showMessageBox("No token found", "error");
            setCookie();
            return {};
        }
        let response = yield fetch("http://localhost:3000/users");
        let users = yield response.json();
        console.log(users);
        showMessageBox("Token found :D", "success");
        return {};
    });
}
export let setCookie = () => {
    createRandomUUID();
    //   document.cookie = `authToken=`;
};
// There is a function called crypto.randomUUID that can be used but, I thought it was fun create my own version of it.
// The chance of two UUIDs from this function colliding? So small that you’d have better odds of finding a needle in a galaxy-sized haystack.
// The chance of having a collision is 1 in 36^36, which equals
// 1 in 4738381338321616896029870078505969039016966697471150738910363830999392
// or approximately 0.00000000000000000000000000000000000000134%.
export let createRandomUUID = () => {
    // Not my proudest way to get the alphabet in javascript but works
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let amountOfCharactersToGenerate = 36;
    let currentTimeStamp = Date.now().toString().split(""); //Turns the current timestamp to an array instead, each item is a string which is fine since it's only used for the uuid.
    let uuid = new Array(amountOfCharactersToGenerate).fill(0);
    let usedIndices = new Set();
    // Sets the hyphens in the uuid by specific indices
    [8, 13, 18, 23].forEach((index) => {
        uuid[index] = "-";
    });
    //   Sets the current timestamp in the uuid by random indices
    currentTimeStamp.forEach((item) => {
        let index = Math.floor(Math.random() * 36);
        while (usedIndices.has(index) || uuid[index] === "-") {
            index = Math.floor(Math.random() * uuid.length);
        }
        uuid[index] = item;
        usedIndices.add(index);
    });
    //   Sets the rest of the uuid to random letters
    uuid.forEach((item, index) => {
        if (item === 0) {
            let randomIndex = Math.floor(Math.random() * 26);
            uuid[index] = alphabet[randomIndex];
        }
    });
    return uuid.join("");
};
