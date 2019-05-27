let select = document.querySelector('.report-select');
if (select) {
    select.addEventListener('change', function () {
        let value = this.value;
        let form = this.parentElement.parentElement;
        form.action += `/${value}`;
        form.submit();
    })
}
