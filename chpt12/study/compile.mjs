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

var myScope = Object.create(null);

myScope.true = true;
myScope.false = false;
myScope.defined_words = [];

for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
  myScope[op] = Function("a, b", `return \`(\${a} ${op} \${b})\`;`);
}

myScope.print = (value) => {
  return `console.log(${value});\n`;
};

var specialForms = Object.create(null);

specialForms.define = (args, scope) => {
  if (args.length != 2 || args[0].type != "word") {
    throw new SyntaxError("Incorrect use of define");
  }

  let ret = "";
  let name = args[0].name;
  let value = compile_egg_expression_impl(args[1], scope);

  if (!(value in scope.defined_words)) {
    scope.defined_words.push(name);
  }
  ret += `${name} = ${value};\n`;
  return ret;
};

specialForms.do = (args, scope) => {
  let ret = "";
  for (let arg of args) {
    ret += compile_egg_expression_impl(arg, scope);
  }
  return ret;
};

// console.log(parse("+(a, 10)"));
// {type: apply, operator: {type: word, name: +}, args: [{type: word, name: a}, {type: value, value:10}]}

function run_js_code(code) {
  // console.log("DEBUG", code);
  Function("", code)();
}

function prepend_variable_declarations(scope) {
  let ret = "";
  for (let name of scope.defined_words) {
    ret += `let ${name};\n`;
  }
  return ret;
}

function compile_egg_expression_impl(expr, scope) {
  if (expr.type == "value") {
    return expr.value;
  } else if (expr.type == "word") {
    if (expr.name in scope) {
      return scope[expr.name];
    } else if (scope.defined_words.includes(expr.name)) {
      return expr.name;
    } else {
      throw new ReferenceError(`Undefined binding: ${expr.name}`);
    }
  }

  if (expr.type == "apply") {
    return compile_apply_expr(expr, scope);
  }
}

function compile_egg_expression(expr, scope) {
  let ret = compile_egg_expression_impl(expr, scope);
  return prepend_variable_declarations(scope) + ret;
}

function compile_apply_expr(apply_expr, scope) {
  let [op, args] = [apply_expr.operator, apply_expr.args];

  if (op.type == "word" && op.name in specialForms) {
    return specialForms[op.name](args, scope);
  }

  let compiled_args = args.map((arg) =>
    compile_egg_expression_impl(arg, scope)
  );
  let operator = compile_egg_expression_impl(op, scope);

  return operator(...compiled_args);
}

// let egg_code = "print(+(2, 10))";
// let parsed_code = parse(egg_code, Object.create(topScope));
// let compiled_code = compile_egg_expression(parsed_code, Object.create(myScope));
// run_js_code(compiled_code);

/*
do(define(total, 0),
define(count, 1),
while(<(count, 11),
do(define(total, +(total, count)),
define(count, +(count, 1)))),
print(total))
*/

let egg_code = "do(define(total, 0), define(boh, 2), print(2), print(total))";
let parsed_code = parse(egg_code, Object.create(topScope));
console.log(parsed_code);
let compiled_code = compile_egg_expression(parsed_code, Object.create(myScope));
console.log(compiled_code);
run_js_code(compiled_code);
