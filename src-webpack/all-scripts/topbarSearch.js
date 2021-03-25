const elements = require("../views/elements");

const search = (position, element, placeholder = 'Search for...', value = '', form) => {

    // If serach bar was already there:-
    if (document.getElementById('searchYear-form')) {
        return false;
    };
    
    form = `
    <form id="searchYear-form" class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
        <div class="input-group">
            <input id="searched-year" value="${value}" type="number" class="form-control bg-light border-0 small" placeholder="${placeholder}" aria-label="Search" aria-describedby="basic-addon2">
            <div class="input-group-append" id="search-button">
                <button class="btn btn-primary" type="button">
                    <i class="fas fa-search fa-sm"></i>
                </button>
            </div>
        </div>
    </form>`;

    document.getElementById(element).insertAdjacentHTML(position, form);
};

module.exports = search;