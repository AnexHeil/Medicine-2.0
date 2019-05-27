const th = document.querySelectorAll('th');
for (let i = 0; i < th.length; i++) {
  th[i].addEventListener('click', item(i));
}
function item(i) {
  return function () {
    sortTable(i);
  }
}
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.querySelector('table');
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (th[n].classList.contains('date-col')) {
          let date = x.textContent.split(/-/g);
          let date1 = y.textContent.split(/-/g);
          let resDate = new Date(date[2], date[1], date[0]);
          let resDate1 = new Date(date1[2], date1[1], date1[0]);
          if (resDate.getTime() > resDate1.getTime()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
        else {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }

      }
      else if (dir == "desc") {
        if (th[n].classList.contains('date-col')) {
          let date = x.textContent.split(/-/g);
          let date1 = y.textContent.split(/-/g);
          let resDate = new Date(date[2], date[1], date[0]);
          let resDate1 = new Date(date1[2], date1[1], date1[0]);
          if (resDate.getTime() < resDate1.getTime()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
        else {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}