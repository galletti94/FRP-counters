// regular counter
var up = $('#up').asEventStream('click');
var down = $('#down').asEventStream('click');
var reset = $('#reset').asEventStream('click');

var theCounts1 = up.map(+1).merge(down.map(-1)).merge(reset.map(0)).scan(0, function(x, y) {if (y === 0) {return 0} else { return x + y }});
//assign value to counter
theCounts1.assign($('#theCounts1'), 'text');

// factorial counter
var factNext = $('#factNext').asEventStream('click');
var factPrev = $('#factPrev').asEventStream('click');
var reset = $('#resetFact').asEventStream('click');

// need to create an input stream of "consecutive pairs" of integers to build fact and reverse fact
var theCounts2 = factNext.map(1).merge(reset.map(0)).merge(factPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}}).scan(1, function(x, y) {if ( y[0] === 0 ) {return 1} else {if (y[0]>= y[1]) {return x/y[0] } else {return x*y[1]}}});

theCounts2.assign($('#theCounts2'), 'text');

// fib counter
var fibNext = $('#fibNext').asEventStream('click');
var fibPrev = $('#fibPrev').asEventStream('click');
var reset = $('#resetFib').asEventStream('click');

// similar to fact, need to keep in memory the previous value so that reverse fib can work
var  theCounts3 = fibNext.map(1).merge(reset.map(0)).merge(fibPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {if (y < 0) { return [x[1]-x[0], x[0]] } else {return [x[1], x[1] + x[0]]}}}).scan(1, function(x, y) {if ( y[0] === 0 ) {return 0} else {if (y[0]>= y[1]) {return y[0]} else {return y[1]}}});

theCounts3.assign($('#theCounts3'), 'text');

// foldleft counter

// some options for the folding function
function divide(x, y) {
    res = x/y
    return res.toFixed(5)
}

function diff(x, y) {
    return x-y
}

function mult(x, y) {
    return x*y
}

function sum(x, y) {
    return x+y
}

var foldNext = $('#foldNext').asEventStream('click');
var foldPrev = $('#foldPrev').asEventStream('click');
var reset = $('#resetFold').asEventStream('click');

var incr = foldNext.map(1).merge(reset.map(0)).merge(foldPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}});

// higher order function - takes an initial value, a function (and its inverse) and applies a foldleft on the integer stream
function myfunc(init, f, inv) {
    return incr.scan(init, function(x, y) {if ( y[0] === 0 ) {return init} else {if (y[0] >= y[1]) {return inv(x, y[1])} else {return f(x, y[0])}}})
}

var theCounts_sum = myfunc(0, sum, diff);
var theCounts_mult = myfunc(1, mult, divide);
var theCounts_div = myfunc(1, divide, mult);
var theCounts_diff = myfunc(0, diff, sum);
    
theCounts_sum.assign($('#theCounts_sum'), 'text');
theCounts_mult.assign($('#theCounts_mult'), 'text');
theCounts_div.assign($('#theCounts_div'), 'text');
theCounts_diff.assign($('#theCounts_diff'), 'text');


// rolling mean on integers
var rollNext = $('#rollNext_m').asEventStream('click');
var rollPrev = $('#rollPrev_m').asEventStream('click');
var reset = $('#resetRoll_m').asEventStream('click');

var theCounts5 = rollNext.map(1).merge(reset.map(0)).merge(rollPrev.map(-1)).scan([0, 1, 0], function(x,y) {if (y === 0) {return [0, 1, 0]} else {if (y < 0) {return [x[0]+y, x[1]+y, diff(x[2], x[0])]} else {return [x[0] + y, x[1] + y, sum(x[2], x[1])]}}}).scan(0, function(x, y) {return y[2]/y[1]});

theCounts5.assign($('#theCounts5'), 'text');


// square (map) counter on integers
var sqNext = $('#sqNext').asEventStream('click');
var sqPrev = $('#sqPrev').asEventStream('click');
var reset = $('#resetSq').asEventStream('click');

function square(x) {
    return x*x
}

var theCounts6 = sqNext.map(1).merge(reset.map(0)).merge(sqPrev.map(-1)).scan(0, function(x,y) {if (y === 0) {return 0} else {return x + y}}).scan(0, function(x, y) {return square(y)});

theCounts6.assign($('#theCounts6'), 'text');

/*
// foldleft2 counter
var foldNext = $('#fold2Next').asEventStream('click');
var foldPrev = $('#fold2Prev').asEventStream('click');
var reset = $('#resetFold2').asEventStream('click');

var s1 = foldNext.map(1).merge(reset.map(0)).merge(foldPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[0]+y, x[1] + y]}});
var s2 = foldNext.map(1).merge(reset.map(0)).merge(foldPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[0]+y, x[1] + y]}});

// higher order function - takes an initial value, a function (and its inverse) and applies a foldleft on a combination of the 2 integer streams
function myfunc(st1, st2, init, f, inv) {
    return st1.combine(st2, function (x, y) {return [x, y]}).scan(init, function(x, y) {if ( y === 0 ) {return init} else {return y}})
}

var theCounts2_sum = myfunc(s1, s2, 0, sum, diff);
var theCounts2_mult = myfunc(s1, s2, 1, mult, divide);
var theCounts2_div = myfunc(s1, s2, 1, divide, mult);
var theCounts2_diff = myfunc(s1, s2, 0, diff, sum);
    
theCounts2_sum.assign($('#theCounts2_sum'), 'text');
theCounts2_mult.assign($('#theCounts2_mult'), 'text');
theCounts2_div.assign($('#theCounts2_div'), 'text');
theCounts2_diff.assign($('#theCounts2_diff'), 'text');

*/

// rolling variance on integers
var rollNext = $('#rollNext_v').asEventStream('click');
var rollPrev = $('#rollPrev_v').asEventStream('click');
var reset = $('#resetRoll_v').asEventStream('click');

var theCounts7 = rollNext.map(1).merge(reset.map(0)).merge(rollPrev.map(-1)).scan([0, 1, 0], function(x,y) {if (y === 0) {return [0, 1, 0]} else {if (y < 0) {return [x[0]+y, x[1]+y, diff(x[2], x[0])]} else {return [x[0] + y, x[1] + y, sum(x[2], x[1])]}}}).scan(0, function(x, y) {return y[2]/y[1]});;

theCounts7.assign($('#theCounts7'), 'text');

