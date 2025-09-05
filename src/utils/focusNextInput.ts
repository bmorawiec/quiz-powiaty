export function focusNextInput() {
    const allInputs = document.querySelectorAll("input");
    if (document.activeElement) {
        const currentIndex = Array.prototype.indexOf.call(allInputs, document.activeElement);
        const nextIndex = (currentIndex + 1 < allInputs.length) ? currentIndex + 1 : 0;
        allInputs[nextIndex].focus();
    } else {
        allInputs[0].focus();
    }
}
