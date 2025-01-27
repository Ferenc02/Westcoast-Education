// Function to show a message box with a message and an icon
export default function showMessageBox(message, type) {
    let messageBox = document.querySelector(".message-box");
    if (!messageBox) {
        console.log("Message box not found");
        return;
    }
    if (type !== "error" && type !== "success") {
        showMessageBox(`Invalid message type. The type should be either 'error' or 'success', showMessageBox("This is an error message", "error")`, "error");
        return;
    }
    // im using type assertion here since i know that the element exists
    let messageBoxContent = messageBox.querySelector(".message-box__content");
    let messageBoxIcon = messageBox.querySelector(".message-box__icon");
    let messageBoxTitle = messageBox.querySelector(".message-box__title");
    let messageBoxText = messageBox.querySelector(".message-box__text");
    let messageBoxButton = messageBox.querySelector(".message-box__button");
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
    const selectedStyle = styles[type.toLowerCase()];
    messageBoxIcon.classList.add(selectedStyle.iconClass);
    messageBoxIcon.textContent = selectedStyle.icon;
    messageBoxTitle.classList.add(selectedStyle.titleClass);
    messageBoxTitle.textContent = selectedStyle.title;
    messageBoxText.textContent = message;
    messageBoxButton.classList.add(...selectedStyle.buttonClass);
    messageBox.classList.remove("hidden");
    messageBoxButton.focus();
    //  Event listener to close the message box
    messageBox === null || messageBox === void 0 ? void 0 : messageBox.addEventListener("click", (event) => {
        if (event.target === messageBox || event.target === messageBoxButton) {
            messageBox.classList.add("hidden");
            messageBoxContent.classList.remove("grow-animation");
            messageBoxIcon.classList.remove(selectedStyle.iconClass);
            messageBoxTitle.classList.remove(selectedStyle.titleClass);
            messageBoxButton.classList.remove(...selectedStyle.buttonClass);
        }
    });
    messageBoxContent.classList.add("grow-animation");
}
