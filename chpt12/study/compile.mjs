function parseExpression(program) {
  program = skipSpace(program);
  let match, expr;
  if ((match = /^"([^"]*)"/.exec(program))) {
    // start with ", any character not ", another ".
    expr = { type: "value", value: match[1] }; // match[1] represent what is iniside the () group. no "".
  } else if ((match = /^\d+\b/.exec(program))) {
    // start with at least one digit. no character after digits.
    expr = { type: "value", value: Number(match[0]) };
  } else if ((match = /^[^\s(),#"]+/.exec(program))) {
    // match starting from beginning character that don't contain space, (), , , #.
    expr = { type: "word", name: match[0] };
  } else {
    throw new SyntaxError("Unexpected syntax: " + program);
  }

  return parseApply(expr, program.slice(match[0].length)); // expr and the rest of the program
}

function skipSpace(string) {
  let first = string.search(/\S/); // find first inex not being a space
  if (first == -1) return ""; // if nothing found means no characters
  return string.slice(first); // return from first index to end
}

function parseApply(expr, program) {
  program = skipSpace(program);
  // if first character is not "(", you return the input expr, program in a struct {expr, rest}
  if (program[0] != "(") {
    return { expr: expr, rest: program };
  }

  program = skipSpace(program.slice(1)); // skip "("
  expr = { type: "apply", operator: expr, args: [] }; // initialize expression
  while (program[0] != ")") {
    let arg = parseExpression(program); // this will return something like {expr, rest} as above
    expr.args.push(arg.expr); // the expr is the arg of the operator
    program = skipSpace(arg.rest);
    if (program[0] == ",") {
      program = skipSpace(program.slice(1)); // skip comma
    } else if (program[0] != ")") {
      // if not found comma, you expect ")"
      throw new SyntaxError("Expected ',' or ')'");
    }
  }
  return parseApply(expr, program.slice(1)); // for the case like multiplier(2)(1)
}

function parse(program) {
  let { expr, rest } = parseExpression(program);
  if (skipSpace(rest).length > 0) {
    throw new SyntaxError("Unexpected text after program");
  }
  return expr;
}

// console.log(parse("+(a, 10)"));
/*
  initially matches + and we get expr = {type: word, name: +} and we return expr, (a, 10).
  Then we have "(", so 
  expr = {type: apply, operator: {type: word, name: +}, args: }
  the first parse expression will get a expression and push it to args,
  rest is now ,10).
  then there is comma, so we skip and go  back at top of the whle.
  then porogram is 10), so we parse 10 and push it to args. now program is ).
  Since program[0] is == ")" we can escape while.
  Now we call parse apply with expression and emptyness because we skip the ")".
  we return {expr, rest:""}.
  in the of parse we return expr.
  {type: apply, operator: {type: word, name: +}, args: [{type: word, name: a}, {type: value, value:10}]}
*/

var specialForms = Object.create(null);
var topScope = Object.create(null);

topScope.true = true;
topScope.false = false;

for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
  topScope[op] = Function("a, b", `return a ${op} b;`);
}

function compile_value(expr, program) {
  console.log(expr);
  if (expr.type == "value") {
    program += expr.value;
  }
  console.log(program);
}

function compile_word(expr, program, scope) {
  console.log(expr);
  if (expr.type == "word") {
    if (expr.name in scope) {
      program += `${scope[expr.name]}`;
    }
  }
  console.log(program);
  return program;
}

function run(program) {
  return compile(parse(program), "");
}

function test_word(program) {
  return compile_word(parse(program), "", Object.create(topScope));
}

let code = "+";
test_word(code);
let output =
  `let result = (` + test_word(code) + `(2, 1)); console.log(result)`;
let main = Function("", output);
console.log(output);
main();

// let code = '"7"';
// run(code);

// code = '"ciao"';
// run(code);

// code = "+(3, 4)";
// run(code);
