const selects = document.querySelectorAll('select');

selects.forEach(select => {
    select.addEventListener('change', function (e) {
        var option = select.options[select.selectedIndex];
        const input = document.getElementsByName(e.target.getAttribute('data-name'))[0];
        if (option.value !== 'header' && input.value.indexOf(option.value) == -1) {
            if (input.value == '') {
                input.value = option.value;
            }
            else {
                input.value = input.value + ' ' + option.value;
            }
        }
    })
});
