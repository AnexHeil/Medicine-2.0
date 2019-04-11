document.querySelector('tbody').addEventListener('click', function(e){
    if(!e.target.classList.contains('report')){
        return null;
    }
    else{
        let target = e.target;
        let report = target.getAttribute('data-report');
        report = report.split(/; /gi);
        let reportWindow = document.createElement('div');
        reportWindow.className = 'reportWindow';
        reportWindow.innerHTML = '<ul>';
        report.forEach(rep =>{
            reportWindow.innerHTML += rep;
        });
        reportWindow.innerHTML += '</ul>';
        document.body.appendChild(reportWindow);
    }
});