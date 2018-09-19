const en = [
    'Enhancing group productivity',
];

const ro = [
    'Îmbunătățirea productivității grupului',
];

const prefix = "skills";
const keyficate = text => text.toLowerCase().replace(/[\s^\W]+$/g, "").replace(/[\s^\W]+/g, "-");
const resultEn = en.map(item => `\"${prefix}.${keyficate(item)}\": \"${item}\",`);
const resultRo = ro.map((item, i) => `\"${prefix}.${keyficate(en[i])}\": \"${item}\",`);

console.log(resultEn.join("\r\n"));
console.log();
console.log(resultRo.join("\r\n"));