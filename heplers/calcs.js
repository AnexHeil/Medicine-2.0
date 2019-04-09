module.exports = {
    calculateAntrMorphData: function performAntrMorphCalcsAndAnalis(antropology, morphology) {
        let calcs = {
            imt: ((antropology.weight / (antropology.stayHeight * 2)) * 100).toFixed(1),
            svstn: (antropology.sitHeight / (antropology.stayHeight - antropology.sitHeight)).toFixed(1),
            orr: (antropology.handWidth / antropology.stayHeight).toFixed(1),
            odkr: ((morphology.wristLengthRight / antropology.stayHeight) * 100).toFixed(1),
            faceIndex: ((morphology.faceHeight / morphology.cheeckWidth) * 100).toFixed(1),
            pe: (antropology.chestOnBreath / antropology.stayHeight).toFixed(1),
            ri: (antropology.stayHeight - (antropology.stayHeight - antropology.sitHeight)).toFixed(1),
            rp: (antropology.handWidth - antropology.stayHeight).toFixed(1)
        };

        let points = 0, patalogys = "";

        if (calcs.imt >= 18 && calcs.imt <= 25)
            patalogys += 'ИМТ: Норма;';
        else if (calcs.imt < 18)
            patalogys += 'ИМТ: Дефицит массы;';
        else if (calcs.imt > 25 && calcs.imt <= 30)
            patalogys += 'ИМТ: Избыток массы;';
        else if (calcs.imt > 30)
            patalogys += 'ИМТ: Ожирение;';

        if (calcs.svstn < 0.86) {
            points++;
            patalogys += ' СВСТН: Костное отклонение;';
        }
        else
            patalogys += ' СВСТН: Норма;';

        if (calcs.orr < 1.05)
            patalogys += ' ОРР: Норма;';
        else {
            patalogys += ' ОРР: Костное отклониние 2;';
            points += 2;
        }

        if (calcs.odkr > 11) {
            patalogys += ' ОДКР: Костное отклониение 3;';
            points++;
        }
        else
            patalogys += ' ОДКР: Норма;';

        if (morphology.bigFingerTestRight == 1 && morphology.bigFingerTestLeft) {
            points++;
            patalogys += ' Тест большого пальца: Неполная арахнодактелия;';
        }

        if (morphology.wristTestRight == 1 && morphology.wristTestLeft == 1) {
            if (morphology.bigFingerTestLeft == 1 && morphology.bigFingerTestRight == 1) {
                points += 3;
            }
            else {
                points++;
            }
            patalogys += ' Тест запястья: Неполная арахнодактелия;';
        }

        if (calcs.faceIndex < 88)
            patalogys += ' ЛИ: Норма;';
        else {
            points += 2;
            patalogys += ' ЛИ: Узкое лицо;';
        }

        let result = morphology.TMP + morphology.TML + morphology.TBPPR + morphology.TBPLR + morphology.PLS + morphology.LLS + morphology.PKS + morphology.LKS + morphology.TPP;
        console.log(morphology);
        if (result <= 2)
            patalogys += ' СВГС: Вариант нормы;';
        else if (result >= 3 && result <= 5)
            patalogys += ' СВГС: Умеренная гипермобильность;';
        else
            patalogys += ' СВГС: Выраженная гипермобильность;';
        points += result;

        if (calcs.pe <= 50 && calcs.pe >= 55)
            patalogys += ' ПЭ: Нормостеник;';
        else if (calcs.pe < 50)
            patalogys += ' ПЭ: Астеник;';
        else if (calcs.pe > 55)
            patalogys += ' ПЭ: Гиперстеник;';

        if (calcs.ri <= 12)
            patalogys += ' РИ: Пропорциональное телосложение;';
        else
            patalogys += ' РИ: Непропорциональное телосложение;';

        if (calcs.rp >= 7)
            patalogys += ' РП: Непропорциональное телосложение;';
        else
            patalogys += ' РП: Пропорциональное телосложение;';
        calcs.points = points;
        calcs.patalogys = patalogys;
        calcs.research = antropology._id;
        return calcs;
    },  
    calculatePR: function (pr) {
        let ir = ((4 * (pr.p0 + pr.p1 + pr.p2) - 200) / 10).toFixed(1);
        let patalogys;
        if (ir >= 0 && ir <= 5)
            patalogys = 'ИР: Отлично;';
        else if (ir >= 6 <= 10)
            patalogys = 'ИР: Хорошо;';
        else if (ir >= 11 && ir <= 15)
            patalogys = 'ИР: Посредственно;';
        else if (ir > 15)
            patalogys = 'ИР: Слабо;';
        let calcs = {
            ir: ir,
            patalogys: patalogys,
            research: pr._id
        };
        return calcs;
    },
    calculateShG: function (shg) {
        let patalogys;
        if (shg.student.sex == 'Жен') {
            if (shg.shtange >= 40 && shg.shtange <= 50)
                patalogys = 'Проба Штанге: Норма;';
            else if (shg.shtange < 40)
                patalogys = 'Проба Штанге: Плохо;';
            else if (shg.shtange > 50)
                patalogys = 'Проба Штанге: Отлично;';
        }
        else{
            if (shg.shtange >= 50 && shg.shtange <= 60)
                patalogys = 'Проба Штанге: Норма;';
            else if (shg.shtange < 50)
                patalogys = 'Проба Штанге: Плохо;';
            else if (shg.shtange > 60)
                patalogys = 'Проба Штанге: Отлично;';
        }
        if(shg.genchi >= 30 && shg.genchi <= 40)
            patalogys += ' Проба Генчи: Норма;';
        else if(shg.genchi > 40)
            patalogys += ' Проба Генчи: Отлично;';
        else if(shg.genchi < 30)
            patalogys += ' Проба Генчи: Плохо;';
        let calcs = {
            patalogys: patalogys,
            research: shg._id
        }
        return calcs;
    }
}