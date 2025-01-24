interface TestResponse {
  name: string;
  age: number;
}

let endpointTest = async () => {
  let response = await fetch("http://localhost:3000/test");

  let output: TestResponse = await response.json();

  let h1Element = document.querySelector("h1");

  if (h1Element) {
    h1Element.innerText = `Hello, ${output.name}! You are ${output.age} years old.`;
  } else {
    console.error("No <h1> element found in the document.");
  }
};
