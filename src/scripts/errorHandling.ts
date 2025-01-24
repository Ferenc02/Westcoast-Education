// Function to show a message box with a message and an icon
export default function showMessageBox(message: string, type: String) {
  let messageBox = document.querySelector(".message-box");

  if (!messageBox) {
    console.log("Message box not found");
    return;
  }

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

  const selectedStyle = styles[type.toLowerCase() as "error" | "success"];

  messageBoxIcon.classList.add(selectedStyle.iconClass);
  messageBoxIcon.textContent = selectedStyle.icon;

  messageBoxTitle.classList.add(selectedStyle.titleClass);
  messageBoxTitle.textContent = selectedStyle.title;

  messageBoxText.textContent = message;

  messageBoxButton.classList.add(...selectedStyle.buttonClass);

  messageBox.classList.remove("hidden");

  messageBoxButton?.addEventListener(
    "click",
    () => {
      messageBox.classList.add("hidden");

      messageBoxContent.classList.remove("grow-animation");

      messageBoxIcon.classList.remove(selectedStyle.iconClass);

      messageBoxTitle.classList.remove(selectedStyle.titleClass);

      messageBoxButton.classList.remove(...selectedStyle.buttonClass);
    },
    { once: true }
  );

  messageBoxContent.classList.add("grow-animation");
}
