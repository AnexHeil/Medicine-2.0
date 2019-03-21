const moment = require('moment');

module.exports = {
    formatDate: function (date, format) {
        if (date) {
            return moment(date).format(format);
        }
    },
    checkSex: function (sex, value) {
        if (sex == value) {
            return "checked";
        }
        else {
            return "";
        }
    }
};