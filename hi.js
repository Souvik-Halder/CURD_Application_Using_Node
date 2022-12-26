
  function json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key) {
        result.push(json[key]);
        console.log(json[key])
    });
    console.log(result+"result")
    return result;
}
const pssubmitarray = json2array({
    _id:"639dddcc4ac183a3147cc95b",
    teamId: "6394c51ac11eabb10c18936e",
    psid: 'fsdfds',
    idea: 'dsfds',
    ideadesc: 'gffdVDS',
    __v: 0
  });

console.log(pssubmitarray)