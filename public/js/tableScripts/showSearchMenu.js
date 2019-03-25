let dashboard = document.querySelector('.dashboard');
document.querySelector('.search-button').addEventListener('click', function(e){
    document.querySelector('.dashboard').classList.toggle('active-search');
    e.preventDefault();
});