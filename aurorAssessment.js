/*
TODO: implement a string interpolation algorithm. It's likely going to be used to format simple messages to be sent to users. It should take a string and a dictionary of values. It will return the input string, but with the dictionary values substituted into the [] delimited tokens, for example:

C#:

  // values from the dictionary get substituted into square brackets
  Assert.Equal("Hello Jim", Interpolate("Hello [name]", new Dictionary<string, string>{{"name", "Jim"}}));
  // escape the square brackets by doubling them:
  Assert.Equal("Hello Jim [author]", Interpolate("Hello [name] [[author]]", new Dictionary<string, string>{{"name", "Jim"}}));

JS:

test('replace a name', () => {
  expect(interpolate('Hello [name]', { 'name': 'Jim' })).toBe('Hello Jim');
});
test('don\'t replace a value when the brackets are escaped', () => {
  expect(interpolate('Hello [name] [[author]]', { 'name': 'Jim' })).toBe('Hello Jim [author]');
});


P
input: string, and object
output: string 
rules: 
-output string should be same as input string, but with any values inside single brackets replaced with
object values where object key corresponds to string located within said single brackets.
-object can contain multiple key value pairs. 
-if a value in the input is located within double square brackets, ignore and leave as is. 

questions: 
-can the dictionary values be anything other than than string type? no 
-are there any other characters that can mean the brackets are escaped? no
-can there be such a situation where there is an empty square bracket in the input string? yes, but I will have this removed in the output string, as my assumption would be that it has no real value in the string. And possibly consider checking for spaces around the empty bracket and accommodating for this in the output.
-can there be a situation where a bracketed 'value' in the input string does not have a matching key/value pair in the dictionary? If so, what should I do with that value in the input string? my thought: leave as bracketed value, similar to escaped value.
-what if bracketed value is located within a word? identify bracketed strings not by use of spaces.
-what if bracketed value is made up of multiple words (separated by spaces)?

E
interpolate('Hello [name]', { 'name': 'Jim' }) // Hello Jim
interpolate('Hello [name] [[author]]', { 'name': 'Jim' })  //Hello Jim [author]
interpolate('Hello [name] [[author]], would you like to eat some [food] with [spread]?', { 'name': 'Jim', 'food': 'toast'}) // Hello Jim [[author]], would you like to eat some toast with [undefined]?
interpolate('Hello [name][], would you like to eat some [food] with [spread]?', { 'name': 'Jim', 'food': 'toast', 'spread': 'marmite', '': ''}) // Hello Jim, would you like to eat some toast with marmite?
interpolate('Hello [name], would you like to [] some [food] with [spread]?', { 'name': 'Jim', 'food': 'toast', 'spread': 'marmite'}) // Hello Jim, would you like to [undefined] some toast with marmite?
interpolate('[name], did you enjoy [action]ing your [food] with [spread]?', { 'name': 'Jim', 'action': 'eat', 'food': 'toast', 'spread': 'marmite'}) // Jim, did you enjoy eating your toast with marmite?


D
string (and object) -> string 

A
Taking into account bracketed input values are not made up of multiple words:

function takes in input string and object
  create empty result string
  create array from splitting string by regex with start '[' and end ']
  for each element in array
    if element doesn't include '['
        add to result string
    if element section has double '[[' or ']]' or ']' at start of string
        remove one bracket from start and
        add rest to result string
    if element has one starting '['
        extract section of string that is not '['
        add cross-referenced dictObj value to result string
  return result string


C 
*/
function interpolate(inputStr, dictObj) {
    let result = '';
    let splitArr = inputStr.split(/(?=\[)(.*?)(?=\])/);
    splitArr.forEach(subStr => {
        if (!(subStr.startsWith("[")) && !(subStr.startsWith("]"))) {
            result += subStr;
        } else if (subStr.startsWith("[[") || subStr.startsWith("]")) {
            result += subStr.substring(1);
        }
        else {  // subStr begins with single '['
            if (dictObj[subStr.substring(1)] !== undefined) {
                result += dictObj[subStr.substring(1)];
            } else result += '[undefined]';
        }
    })

    return result;
}



// interpolate('Hello [name]', { 'name': 'Jim' }) // Hello Jim
// interpolate('Hello [name] [[author]]', { 'name': 'Jim' })  //Hello Jim [author]
// interpolate('Hello [name] [[author]], would you like to eat some [food] with [spread]?', { 'name': 'Jim', 'food': 'toast'}) // Hello Jim [[author]], would you like to eat some toast with [undefined]?
// interpolate('Hello [name][], would you like to eat some [food] with [spread]?', { 'name': 'Jim', 'food': 'toast', 'spread': 'marmite', '': ''}) // Hello Jim, would you like to eat some toast with marmite?
// interpolate('Hello [name], would you like to [] some [food] with [spread]?', { 'name': 'Jim', 'food': 'toast', 'spread': 'marmite'}) // Hello Jim, would you like to [undefined] some toast with marmite?
// interpolate('[name], did you enjoy [action]ing your [food] with [spread]?', { 'name': 'Jim', 'action': 'eat', 'food': 'toast', 'spread': 'marmite'}) // Jim, did you enjoy eating your toast with marmite?
// interpolate('[name], did you enjoy [action and food] with [spread]?', { 'name': 'Jim', 'action and food': 'eating your toast', 'spread': 'marmite'}) // Jim, did you enjoy eating your toast with marmite?



test('replace a name', () => {
    expect(interpolate('Hello [name]', { 'name': 'Jim' })).toBe('Hello Jim');
});
test('don\'t replace a value when the brackets are escaped', () => {
    expect(interpolate('Hello [name] [[author]]', { 'name': 'Jim' })).toBe('Hello Jim [author]');
});
test("if a value in the input string doesn't have a corresponding key/value in the dictionary, replace that value with [undefined]", () => {
    expect(interpolate('Hello [name] [[author]], would you like to eat some [food] with [spread]?', { 'name': 'Jim', 'food': 'toast'})).toBe('Hello Jim [[author]], would you like to eat some toast with [undefined]?');
});
test('if there is an empty pair of square brackets in the input string, and there is a corresponding empty string key in the dictionary, replace empty square brackets with corresponding dictionary value', () => {
    expect(interpolate('Hello [name][], would you like to eat some [food] with [spread]?', { 'name': 'Jim', 'food': 'toast', 'spread': 'marmite', '': ''})).toBe('Hello Jim, would you like to eat some toast with marmite?');
});
test('if there is an empty pair of square brackets in the input string, and there is not a corresponding empty string key in the dictionary, replace empty square brackets with [undefined]', () => {
    expect(interpolate('Hello [name], would you like to [] some [food] with [spread]?', { 'name': 'Jim', 'food': 'toast', 'spread': 'marmite'})).toBe('Hello Jim, would you like to [undefined] some toast with marmite?');
});
test('if there is a bracket value in the input string that is located inside a word, replace this bracket value with corresponding dictionary key value', () => {
    expect(interpolate('[name], did you enjoy [action]ing your [food] with [spread]?', { 'name': 'Jim', 'action': 'eat', 'food': 'toast', 'spread': 'marmite'})).toBe('Jim, did you enjoy eating your toast with marmite?');
});
test('if there is a bracketed value in the input string that includes multiple words(i.e. spaces), replace this bracketed value with corresponding dictionary key value', () => {
    expect(interpolate('[name], did you enjoy [action and noun] with [spread]?', { 'name': 'Jim', 'action and food': 'eating your toast', 'spread': 'marmite'})).toBe('Jim, did you enjoy eating your toast with marmite?');
});
