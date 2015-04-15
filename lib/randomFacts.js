var facts = [
    "Graduated Rutgers University with Computer Science and Economics.",
    "Loves art.",
    "Took Japanese course at local community college while in high school.",
    "Avid learner.",
    "Passionate about doing."
];

exports.getFact = function() {
    var index = Math.floor(Math.random() * facts.length);
    return facts[index];
};