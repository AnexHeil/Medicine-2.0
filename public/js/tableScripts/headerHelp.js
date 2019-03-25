let headers = document.querySelectorAll('.helper');
let showingTooltip;
headers.forEach(function(header) {
    header.addEventListener('mouseover', function(e) {
        const tooltip = e.target.getAttribute('data-tooltip');
        let tooltipDiv = document.createElement('div');
        tooltipDiv.className = 'tooltipes';
        tooltipDiv.innerHTML = tooltip;
        document.body.appendChild(tooltipDiv);
        var coords = e.target.getBoundingClientRect();
        var left = coords.left + (e.target.offsetWidth - tooltipDiv.offsetWidth) / 2;
        if (left < 0) left = 0; // не вылезать за левую границу окна

        var top = coords.top - tooltipDiv.offsetHeight - 5;
        if (top < 0) { // не вылезать за верхнюю границу окна
            top = coords.top + e.target.offsetHeight + 5;
        }

        tooltipDiv.style.left = left + 'px';
        tooltipDiv.style.top = top + 'px';

        showingTooltip = tooltipDiv;
    });
    header.addEventListener('mouseout', function(e){
        if (showingTooltip) {
        document.body.removeChild(showingTooltip);
        showingTooltip = null;
      }
    })
});