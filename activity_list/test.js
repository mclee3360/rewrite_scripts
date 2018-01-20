/**
 * Testing functions.
 */
function testCompareDate()
{
    var d1 = '02/02/2018';
    var d2 = '02/02/2018';
    Logger.log('Test 1: ' + compareDate(d1,d2));
    d2 = '02/02/2017';
    Logger.log('Test 2: ' + compareDate(d1,d2));
    d2 = '02/02/2019';
    Logger.log('Test 3: ' + compareDate(d1,d2));
    d2 = '01/02/2018';
    Logger.log('Test 4: ' + compareDate(d1,d2));
    d2 = '03/02/2018';
    Logger.log('Test 5: ' + compareDate(d1,d2));
    d2 = '02/01/2018';
    Logger.log('Test 6: ' + compareDate(d1,d2));
    d2 = '02/03/2018';
    Logger.log('Test 7: ' + compareDate(d1,d2));
}
