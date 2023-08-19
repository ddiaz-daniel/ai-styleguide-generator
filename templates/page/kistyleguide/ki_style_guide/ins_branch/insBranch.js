function checkReqInputValue(input) {
    if (input.value === '') {
        input.classList.add('required-input');
    } else {
        input.classList.remove('required-input');
    }
}