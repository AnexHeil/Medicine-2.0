const express = require('express');
const mongoose = require('mongoose');
require('../models/Student');
const Student = mongoose.model('students');
module.exports = {
    searchResearches: function (researches, params) {
        if (params.studentSearch != '' || params.groupSearch != '' || params.dateSearch) {
            for (let i = 0; i < researches.length; i++) {
                if (params.studentSearch != '' && params.studentSearch.indexOf(researches[i].student.studentNumber) == -1) {
                    researches.splice(i, 1)
                }
                else if (params.groupSearch != '' && params.groupSearch.indexOf(researches[i].student.group) == -1) {
                    researches.splice(i, 1);
                }
                else if (params.dateSearch && researches[i].researchDate.getTime() != new Date(params.dateSearch).getTime()) {
                    researches.splice(i, 1);
                }
            }
        }
        return researches;
    },
    searchAnalysis: function (researches, params) {
        if (params.studentSearch != '' || params.groupSearch != '' || params.dateSearch) {
            for (let i = 0; i < researches.length; i++) {
                if (params.studentSearch != '' && params.studentSearch.indexOf(researches[i].research.student.studentNumber) == -1) {
                    researches.splice(i, 1)
                }
                else if (params.groupSearch != '' && params.groupSearch.indexOf(researches[i].research.student.group) == -1) {
                    researches.splice(i, 1);
                }
                else if (params.dateSearch && researches[i].research.researchDate.getTime() != new Date(params.dateSearch).getTime()) {
                    researches.splice(i, 1);
                }
            }
        }
        return researches;
    },
    formGroups: function(students){
        let groups = [];
        for(let i = 0; i < students.length; i++){
            let group = students[i].group;
            if(groups.indexOf(group) == -1){
                groups.push(group);
            }
        }
        for(let i = 0; i < groups.length; i++){
            let group = {title: groups[i]};
            groups[i] = group;
        }
        return groups;
    },
    formForStudent: function(username, researches){
        for(let i = 0; i < researches.length; i++){
            if(researches[i].student.studentNumber != username){
                researches.splice(i, 1);
            }
        }
        return researches;
    },
    formAnalysisForStudent: function(username, data){
        for(let i = 0; i < data.length; i++){
            if(data[i].research.student.studentNumber != username){
                data.splice(i, 1);
            }
        }
        return data;
    },
}