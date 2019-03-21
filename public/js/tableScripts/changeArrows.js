const ths = document.querySelectorAll('th');
function setSort(target) {
    ths.forEach(th => {
        if (th.childNodes[1]) {
            if (!th.childNodes[1].classList.contains('active'))
                th.childNodes[1].className = 'arrow fa fa-sort';
            else {
                th.childNodes[1].classList.remove('active');
            }
        }
    })
}
ths.forEach(th => {
    th.addEventListener('click', function (e) {
        var icon = th.childNodes[1];
        if (icon.classList.contains('fa-sort') || icon.classList.contains('fa-sort-up')) {
            icon.className = 'active arrow fa fa-sort-down';
        }
        else if (icon.classList.contains('fa-sort-down')) {
            icon.className = 'active arrow fa fa-sort-up';
        }
        setSort(e);
    });
});
