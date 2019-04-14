document.querySelector('body').addEventListener('click', function (e) {
    if (!e.target.classList.contains('report')) {
        if (e.target.classList.contains('blockWindow')) {
            document.querySelector('.blockWindow').remove();
        }
        else {
            return null;
        }
    }
    else {
        let target = e.target;
        let report = target.getAttribute('data-report');
        report = report.split(/;/gi);
        let blockWindow = document.createElement('div');
        blockWindow.className = 'blockWindow';
        let reportWindow = document.createElement('div');
        blockWindow.appendChild(reportWindow);
        reportWindow.className = 'reportWindow';
        let tds = e.target.parentElement.parentElement.cells;
        let reportString = `<h5>${tds[0].innerHTML} ${tds[1].innerHTML} ${tds[2].innerHTML} ${tds[3].innerHTML}</h5>`;
        report.forEach(rep => {
            reportString += `<li>${rep}</li>`;
        });
        
        
        reportWindow.innerHTML = '<ul>' + reportString + '</ul>';
        document.body.appendChild(blockWindow);
    }
});