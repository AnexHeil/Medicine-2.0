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
    },
    checkStatus: function (status) {
        if (status != 'admin')
            return `hidden`;
        else
            return "";
    },
    selectResearch: function (current, selected){
        if(current == selected)
            return 'selected';
        else
            return "";
    },
    reportTable: function (report){
        if(report){
            return 'report-table';
        }
    }
};