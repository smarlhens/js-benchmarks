var Benchmark = require('benchmark');
var faker = require('faker');

var suite = new Benchmark.Suite;
const billion = 100000;

const idArr = new Array(billion);
const arr = new Array(billion);
for (let i = 0, iMax = billion; i < iMax; i++) {
    const id = faker.datatype.number();
    idArr[i] = id
    arr[i] = {id, foo: faker.random.word()}
}

const elements = new Array(billion);
for (let i = 0, iMax = billion; i < iMax; i++) {
    elements[i] = {id: faker.datatype.number(), bar: idArr[Math.floor(Math.random() * billion)]}
}

suite.add('Arr + Arr.map + new Map & Arr.map + Map.get', function () {
    const map = new Map(arr.map(e => [e.id, e.foo]));

    elements.map(e => ({...e, bar: map.get(e.bar)}));
})
    .add('Arr & Arr.map + Arr.find', function () {
        elements.map(e => ({...e, bar: arr.find(a => a.id === e.bar)}));
    })
    // add listeners
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({'async': true});
