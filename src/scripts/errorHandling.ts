/*
 * errorHandling.ts - Modern Message Box System
 *
 * This script serves as an **alternative** to the traditional `alert()`, providing a **modern and stylish** way to display messages.
 *
 * Features:
 * - Supports **two types of messages**: `"error"` and `"success"`, ensuring a clear distinction between different alerts.
 * - Implements a **dynamic styling system**, where colors, icons, and animations adapt based on the message type.
 * - Provides an **animated "grow" effect** to make the message box appear smoothly.
 * - Includes a **click-to-dismiss feature**, allowing users to close the message box by clicking outside or on the button.
 * - Automatically **assigns classes and icons**, ensuring a consistent look across different alerts.
 *
 *
 * The message box is hidden by default and can be shown by calling the `showMessageBox()` function with the message and type.
 * I could have created a new message box element each time, but I decided to reuse the same element for simplicity.
 * One downside of this approach is that the message box have to be added to each html file where it will be used.
 */

// Function to show a message box with a message and an icon
export default function showMessageBox(message: string, type: String) {
  let messageBox = document.querySelector(".message-box") as HTMLElement;

  if (type !== "error" && type !== "success") {
    showMessageBox(
      `Invalid message type. The type should be either 'error' or 'success', showMessageBox("This is an error message", "error")`,
      "error"
    );
    return;
  }
  // im using type assertion here since i know that the element exists
  let messageBoxContent = messageBox.querySelector(
    ".message-box__content"
  ) as HTMLElement;
  let messageBoxIcon = messageBox.querySelector(
    ".message-box__icon"
  ) as HTMLElement;
  let messageBoxTitle = messageBox.querySelector(
    ".message-box__title"
  ) as HTMLElement;
  let messageBoxText = messageBox.querySelector(
    ".message-box__text"
  ) as HTMLElement;
  let messageBoxButton = messageBox.querySelector(
    ".message-box__button"
  ) as HTMLElement;

  // The styles are stored in an object for easy access and to not have to repeat the same values
  const styles = {
    error: {
      icon: "cancel",
      iconClass: "text-red-500",
      title: "Oops!",
      titleClass: "text-red-500",
      buttonClass: ["bg-red-500", "hover:bg-red-600"],
    },
    success: {
      icon: "check_circle",
      iconClass: "text-green-500",
      title: "Success!",
      titleClass: "text-green-500",
      buttonClass: ["bg-green-500", "hover:bg-green-600"],
    },
  };

  // Set the attributes and text content of the message box
  messageBox.ariaHidden = "false";
  const selectedStyle = styles[type.toLowerCase() as "error" | "success"];

  messageBoxIcon.classList.add(selectedStyle.iconClass);
  messageBoxIcon.textContent = selectedStyle.icon;

  messageBoxTitle.classList.add(selectedStyle.titleClass);
  messageBoxTitle.textContent = selectedStyle.title;

  messageBoxText.textContent = message;

  messageBoxButton.classList.add(...selectedStyle.buttonClass);

  messageBox.classList.remove("hidden");

  messageBoxButton.focus();

  //  Event listener to close the message box
  messageBox?.addEventListener("click", (event) => {
    if (event.target === messageBox || event.target === messageBoxButton) {
      messageBox.classList.add("hidden");

      messageBoxContent.classList.remove("grow-animation");

      messageBoxIcon.classList.remove(selectedStyle.iconClass);

      messageBoxTitle.classList.remove(selectedStyle.titleClass);

      messageBoxButton.classList.remove(...selectedStyle.buttonClass);

      messageBox.ariaHidden = "true";
    }
  });

  messageBoxContent.classList.add("grow-animation");
}
