"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let endpointTest = () => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield fetch("http://localhost:3000/test");
    let output = yield response.json();
    let h1Element = document.querySelector("h1");
    if (h1Element) {
        h1Element.innerText = `Hello, ${output.name}! You are ${output.age} years old.`;
    }
    else {
        console.error("No <h1> element found in the document.");
    }
});
