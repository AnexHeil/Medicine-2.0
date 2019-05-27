let table = document.querySelector('.report-table');
if (table) {
    let ths = document.querySelectorAll('th');
    ths[ths.length - 2].click();
    let newTH;
    for (let i = 0; i < ths.length; i++) {
        newTH = ths[i].cloneNode(true);
        ths[i].parentNode.replaceChild(newTH, ths[i]);
    }
    let tds = document.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
        tds[i].addEventListener('click', function () {
            let index = this.cellIndex;
            if (index != ths.length && index != ths.length - 1 && index != ths.length - 2) {
                let rows = table.rows;
                let dynamicData = [], dates = [];
                let date;
                for (let j = 1; j < rows.length; j++) {
                    dynamicData.push(parseInt(rows[j].cells[index].innerText));
                    date = rows[j].cells[ths.length - 2].innerText.split(/-/g);
                    dates.push(new Date(date[2], date[1], date[0]));
                    rows[j].cells[index].style.backgroundColor = 'lightgray';
                }
                let Max = Math.max.apply(null, dynamicData);
                let Min = Math.min.apply(null, dynamicData);
                let dataPoints = [];
                for (let j = 0; j < dynamicData.length; j++) {
                    dataPoints.push({ y: dynamicData[j], x: dates[j] });
                    if (dynamicData[j] == Max) {
                        dataPoints[j].indexLabel = "highest";
                        dataPoints[j].markerColor = "red";
                        dataPoints[j].markerType = "cross";
                    }
                    else if (dynamicData[j] == Min) {
                        dataPoints[j].indexLabel = "lowest";
                        dataPoints[j].markerColor = "red";
                        dataPoints[j].markerType = "cross";
                    }
                }
                var chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,
                    theme: "light2",
                    title: {
                        text: `Динамика показателя ${rows[0].cells[index].innerText}`
                    },
                    axisY: {
                        title: 'Результаты обследования',
                        maximum: Max * 1.5,
                        minimum: 0
                    },
                    axisX: {
                        title: 'Дата обследования',
                        inteval: 6,
                        intervalType: 'month'
                    },
                    data: [{
                        type: "line",
                        dataPoints: dataPoints
                    }]
                });
                chart.render();
            }
        });
    }
}