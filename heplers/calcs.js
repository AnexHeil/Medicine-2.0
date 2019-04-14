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
            patalogys += ' РИ: Пропорциональное телосложение';
        else
            patalogys += ' РИ: Непропорциональное телосложение';

        if (calcs.rp >= 7)
            patalogys += ' РП: Непропорциональное телосложение';
        else
            patalogys += ' РП: Пропорциональное телосложение';
        calcs.points = points;
        calcs.patalogys = patalogys;
        calcs.research = antropology._id;
        return calcs;
    },
    calculatePR: function (pr) {
        let ir = ((4 * (pr.p0 + pr.p1 + pr.p2) - 200) / 10).toFixed(1);
        let patalogys;
        if (ir >= 0 && ir <= 5)
            patalogys = 'ИР: Отлично';
        else if (ir >= 6 <= 10)
            patalogys = 'ИР: Хорошо';
        else if (ir >= 11 && ir <= 15)
            patalogys = 'ИР: Посредственно';
        else if (ir > 15)
            patalogys = 'ИР: Слабо';
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
        else {
            if (shg.shtange >= 50 && shg.shtange <= 60)
                patalogys = 'Проба Штанге: Норма;';
            else if (shg.shtange < 50)
                patalogys = 'Проба Штанге: Плохо;';
            else if (shg.shtange > 60)
                patalogys = 'Проба Штанге: Отлично;';
        }
        if (shg.genchi >= 30 && shg.genchi <= 40)
            patalogys += ' Проба Генчи: Норма';
        else if (shg.genchi > 40)
            patalogys += ' Проба Генчи: Отлично';
        else if (shg.genchi < 30)
            patalogys += ' Проба Генчи: Плохо';
        let calcs = {
            patalogys: patalogys,
            research: shg._id
        }
        return calcs;
    },
    calculateOP: function (op, student, antropology) {
        let birthDate = student.birthDate;
        let diff = (new Date(Date.now()).getTime() - new Date(birthDate).getTime()) / 1000;
        diff /= (60 * 60 * 24);
        age = Math.round(diff / 365.25);
        console.log(age);
        let calcs = {
            css1Change: op.p1 - op.p0,
            sad1Change: op.sad1 - op.sad0,
            dad1Change: op.dad1 - op.dad0,
            css2Change: op.p2 - op.p1,
            sad2Change: op.sad2 - op.sad1,
            dad2Change: op.dad2 - op.dad1,
            ap: (0.11 * op.p0 + 0.014 * op.sad0 + 0.014 * age + 0.009 * antropology.weight - 0.009 * antropology.stayHeight - 0.27).toFixed(2),
            ik: ((1 - (op.dad2 / op.p2)) * 100).toFixed(2),
            tsk: ((op.dad0 / op.p0) * 100).toFixed(2),
            pdp: ((op.p0 * op.sad0) / 100).toFixed(2)
        };
        let patalogys;
        let points = 0;

        if (calcs.css1Change < 5)
            patalogys = 'Изменение ЧСС 1: Неудовл. реакция по типу "парасимпатикотония";';
        else if (calcs.css1Change >= 5 && calcs.css1Change <= 16)
            patalogys = 'Изменение ЧСС 1: Хорошая рекация;';
        else if (calcs.css1Change >= 17 && calcs.css1Change <= 22)
            patalogys = 'Изменение ЧСС 1: Удовлетворительная рекация;';
        else
            patalogys = 'Изменение ЧСС 1: Неудовл. реакция по типу "симпатикотония";';

        if (calcs.sad1Change >= -5 && calcs.sad1Change <= 0)
            patalogys += ' Изменение САД 1: Физиологическая реакция АД;'
        else
            patalogys += ' Изменение САД 1: Патофизиологическая реакция;'

        if (calcs.dad1Change >= 5 && calcs.dad1Change <= 10)
            patalogys += ' Изменение ДАД 1: Физиологическая реакция;'
        else
            patalogys += ' Изменение ДАД 1: Патофизиологическая реакция;'



        if (calcs.css2Change < 5)
            patalogys += ' Изменение ЧСС 2: Неудовл. реакция по типу "парасимпатикотония";';
        else if (calcs.css2Change >= 5 && calcs.css2Change <= 16)
            patalogys += ' Изменение ЧСС 2: Хорошая рекация;';
        else if (calcs.css2Change >= 17 && calcs.css2Change <= 22)
            patalogys += ' Изменение ЧСС 2: Удовлетворительная рекация;';
        else
            patalogys += ' Изменение ЧСС 2: Неудовл. реакция по типу "симпатикотония";';

        if (calcs.sad2Change >= -5 && calcs.sad2Change <= 0)
            patalogys += ' Изменение САД 2: Физиологическая реакция АД;';
        else
            patalogys += ' Изменение САД 2: Патофизиологическая реакция;';

        if (calcs.dad2Change >= 5 && calcs.dad2Change <= 10)
            patalogys += ' Изменение ДАД 2: Физиологическая реакция;';
        else
            patalogys += ' Изменение ДАД 2: Патофизиологическая реакция;';

        if (calcs.ap <= 2.1)
            patalogys += ' АП: Удовлетворительная адаптация;';
        else if (calcs.ap > 2.1 && calcs.ap <= 3.2)
            patalogys += ' АП: Напряжённая адаптация;';
        if (calcs.ap > 3.2 && calcs.ap <= 4.3)
            patalogys += ' АП: Неудовлетворительная адаптация;';
        else
            patalogys += ' АП: Срыв адаптации;';

        if (calcs.ik >= 24) {
            patalogys += ' ВИК: Выраженное преобладание тонуса симпатической нервыной системы;'
            points += 2;
        }
        else if (calcs.ik >= 16 && calcs.ik < 24) {
            patalogys += ' ВИК: Значит. преобладание тонуса симпатической нервыной системы;'
            points += 3;
        }
        else if (calcs.ik >= 0 && calcs.ik < 16) {
            patalogys += ' ВИК: Баланс симпатического и парасимпатического отделов вегетативной нервной системы;'
            points += 5;
        }
        else if (calcs.ik < 0) {
            patalogys += ' ВИК: Выраженное. преобладание тонуса парасимпатического нервыной системы;'
            points += 3;
        }

        if (calcs.tsk >= 90 && calcs.tsk <= 110)
            patalogys += ' ТСК: Сердечно-сосудистый тип кровообращения;';
        else if (calcs.tsk > 110)
            patalogys += ' ТСК: Cосудистый тип кровообращения;';
        else
            patalogys += ' ТСК: Сердечный тип кровообращения;';

        if (calcs.pdp > 75 && calcs.pdp < 90)
            patalogys += ' ПДП: Среднее значение';
        else if (calcs.pdp <= 75)
            patalogys += ' ПДП: Выше среднего значения';

        else
            patalogys += ' ПДП: Ниже среднего значение';

        calcs.points = points;
        calcs.patalogys = patalogys;
        calcs.research = op._id;
        return calcs;
    },
    calculateSpyro: function (weight, spyro, sex) {
        let calcs = {
            gi: (spyro.jel / weight).toFixed(2),
            pomsmt1: ((spyro.wristPower / weight) * 100).toFixed(2),
            pomsmt2: ((spyro.stanPower / weight) * 100).toFixed(2)
        };
        let patalogys;
        if (sex == 'Жен') {
            if (calcs.gi >= 50 && calcs.gi <= 60)
                patalogys = 'ЖИ: Норма;'
            else if (calcs.gi > 60)
                patalogys = 'ЖИ: Отлично;'
            else
                patalogys = 'ЖИ: Неудовлетворительно;'

            if (calcs.pomsmt1 >= 48 && calcs.pomsmt1 <= 50)
                patalogys += ' ПОМСМТ 1: Норма;'
            else
                patalogys += ' ПОМСМТ 1: Отклонение от нормы;'

            if (calcs.pomsmt2 >= 135 && calcs.pomsmt1 <= 150)
                patalogys += ' ПОМСМТ 2: Норма'
            else
                patalogys += ' ПОМСМТ 2: Отклонение от нормы'
        }
        else {
            if (calcs.gi >= 60 && calcs.gi <= 70)
                patalogys = 'ЖИ: Норма;'
            else if (calcs.gi > 70)
                patalogys = 'ЖИ: Отлично;'
            else
                patalogys = 'ЖИ: Неудовлетворительно;'

            if (calcs.pomsmt1 >= 65 && calcs.pomsmt1 <= 80)
                patalogys += ' ПОМСМТ 1: Норма;'
            else
                patalogys += ' ПОМСМТ 1: Отклонение от нормы;'

            if (calcs.pomsmt2 >= 200 && calcs.pomsmt1 <= 220)
                patalogys += ' ПОМСМТ 2: Норма'
            else
                patalogys += ' ПОМСМТ 2: Отклонение от нормы'
        }

        calcs.research = spyro._id;
        calcs.patalogys = patalogys;
        return calcs;
    },
    calculateECG: function (ecg) {
        let patalogys;
        if (ecg.CSS < 60)
            patalogys = 'ЧСС: Брадикардия;'
        else if (ecg.CSS > 90)
            patalogys = 'ЧСС: Тахикардия;'
        else
            patalogys = 'ЧСС: Нормальный синусовый рим;'

        if (ecg.PR < 120)
            patalogys += ' PR: Укорочение интервала PR (феномен CLC);'
        else if (ecg.PR > 200)
            patalogys += ' PR: AB блокада 1-ой степени;'
        else
            patalogys += ' PR: Норма;'

        if (ecg.QRS <= 100)
            patalogys += ' QRC: Норма;'
        if (ecg.QRS >= 120)
            patalogys += ' QRC: Полная блокада ножек пучка Гиса;'
        else
            patalogys += ' QRC: Неполная блокада ножек пучка Гиса;'

        if (ecg.QTcor >= 350 && ecg.QTcor <= 350)
            patalogys += ' QTкор.: Норма;'
        if (ecg.QTcor < 350)
            patalogys += ' QTкор.: Укорочение интервала QT;'
        else
            patalogys += ' QTкор.: Синдром удлинённого интервала QT;'

        if (ecg.RS >= 3.5)
            patalogys += ' R+S: Признаки гипертрофии левого желудочка'
        else
            patalogys += ' R+S: Норма'
        let calcs = {
            research: ecg._id,
            patalogys: patalogys
        }
        return calcs;
    }
}