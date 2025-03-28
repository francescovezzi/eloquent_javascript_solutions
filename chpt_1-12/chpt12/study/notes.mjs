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

// evaluator
function evaluate(expr, scope) {
  if (expr.type == "value") {
    return expr.value;
  } else if (expr.type == "word") {
    if (expr.name in scope) {
      return scope[expr.name];
    } else {
      throw new ReferenceError(`Undefined binding: ${expr.name}`);
    }
  } else if (expr.type == "apply") {
    let { operator, args } = expr;
    if (operator.type == "word" && operator.name in specialForms) {
      return specialForms[operator.name](expr.args, scope);
    } else {
      let op = evaluate(operator, scope);
      if (typeof op == "function") {
        return op(...args.map((arg) => evaluate(arg, scope)));
      } else {
        throw new TypeError("Applying a non-function.");
      }
    }
  }
}
/*
  {type: apply, operator: {type: word, name: +}, args: [{type: word, name: a}, {type: value, value:10}]}
function(a, b) return evaluate(a) + evaluate(b)
*/

specialForms.if = (args, scope) => {
  if (args.length != 3) {
    throw new SyntaxError("Wrong number of args to if");
  } else if (evaluate(args[0], scope) !== false) {
    return evaluate(args[1], scope);
  } else {
    return evaluate(args[2], scope);
  }
};

specialForms.while = (args, scope) => {
  if (args.length != 2) {
    throw new SyntaxError("Wrong number of args to while");
  }
  while (evaluate(args[0], scope) !== false) {
    evaluate(args[1], scope);
  }

  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result
  return false;
};

specialForms.do = (args, scope) => {
  let value = false;
  for (let arg of args) {
    value = evaluate(arg, scope);
  }
  return value;
};

specialForms.define = (args, scope) => {
  if (args.length != 2 || args[0].type != "word") {
    throw new SyntaxError("Incorrect use of define");
  }
  let value = evaluate(args[1], scope);
  scope[args[0].name] = value;
  return value;
};

var topScope = Object.create(null);

topScope.true = true;
topScope.false = false;

for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
  topScope[op] = Function("a, b", `return a ${op} b;`);
}

topScope.print = (value) => {
  console.log(value);
  return value;
};

specialForms.fun = (args, scope) => {
  if (!args.length) {
    throw new SyntaxError("Functions need a body");
  } // easy
  let body = args[args.length - 1]; // last param is function body
  let params = args.slice(0, args.length - 1).map((expr) => {
    if (expr.type != "word") {
      // other params must be words. ì
      throw new SyntaxError("Parameter names must be words");
    }
    return expr.name; // params will contain their name
  });

  return function (...args) {
    // args local to the callback, different from top one.
    if (args.length != params.length) {
      throw new TypeError("Wrong number of arguments"); // check same number of arguments.
    }
    let localScope = Object.create(scope); // create local scope starting from top one.
    for (let i = 0; i < args.length; i++) {
      localScope[params[i]] = args[i]; // add to local scope function params local_scope[name] = arg
    }
    return evaluate(body, localScope); // evaluate function body with local scope.
  };
};

/*
run(`
do(define(plusOne, fun(a, +(a, 1))),
print(plusOne(10)))
`);
// → 11
PlusOne(10)
evaluate(+(a, 1), local_scope)
local_scope[a] = {type: value, value: 10}
return evaluate(a) + evaluate(1) where a and 1 are word and value parsed.
  */
