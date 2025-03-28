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
myScope.binary_ops = Object.create(null);

for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
  myScope.binary_ops[op + "r"] = Function(
    "a, b",
    `return \`return \${a} ${op} \${b};\`;`
  );
  myScope.binary_ops[op + "c"] = Function(
    "a, b",
    `return \`\${a} ${op} \${b}\`;`
  );
  myScope.binary_ops[op] = (rc_flag) => myScope.binary_ops[op + rc_flag];
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
  if (!scope.defined_words.includes(name)) {
    scope.defined_words.push(name);
  }

  let value = compile_egg_expression_impl(args[1], scope);

  ret += `${name} = ${value};\n`;
  return ret;
};

specialForms.do = (args, scope) => {
  let ret = "";
  for (let arg of args) {
    ret += compile_egg_expression_impl(arg, scope, "r");
  }
  return ret;
};

specialForms.while = (args, scope) => {
  if (args.length != 2) {
    throw new SyntaxError("Wrong number of args to while");
  }
  let [condition, body] = args;
  condition = compile_egg_expression_impl(condition, scope);
  body = compile_egg_expression_impl(body, scope, "r");

  let ret = "while(";
  ret += condition;
  ret += ") {\n";
  ret += body;
  ret += "}\n";
  return ret;
};

specialForms.fun = (args, scope) => {
  if (!args.length) {
    throw new SyntaxError("Functions need a body");
  }
  let body = args[args.length - 1];
  let params = args.slice(0, args.length - 1).map((expr) => {
    if (expr.type != "word") {
      throw new SyntaxError("Parameter names must be words");
    }
    return expr.name;
  });

  let local_scope = createLocalScope(scope);
  for (let i = 0; i < params.length; i++) {
    local_scope.defined_words.push(params[i]);
  }

  let ret = "(";
  ret += params.join(", ");
  ret += ") => {\n";
  ret += compile_egg_expression_impl(body, local_scope, "r");
  ret += "}";

  return ret;
};

// specialForms.if = (args, scope) => {
//   if (args.length != 3) {
//     throw new SyntaxError("Wrong number of args to if");
//   }
//   let condition = compile_egg_expression_impl(args[0], scope, "c");
//   let true_case = compile_egg_expression_impl(args[1], scope, "r");
//   let false_case = compile_egg_expression_impl(args[2], scope, "r");

//   let ret = "if (";
//   ret += condition;
//   ret += ") {\n";
//   ret += true_case;
//   ret += "} else {\n";
//   ret += false_case;
//   ret += "}\n";

//   return ret;
// };

specialForms.if = (args, scope) => {
  if (args.length != 3) {
    throw new SyntaxError("Wrong number of args to if");
  }
  let condition = compile_egg_expression_impl(args[0], scope, "c");
  let true_case = compile_egg_expression_impl(args[1], scope, "c");
  let false_case = compile_egg_expression_impl(args[2], scope, "c");

  let ret = "return ";
  ret += condition;
  ret += " ? ";
  ret += true_case;
  ret += " : ";
  ret += false_case;
  ret += ";\n";

  return ret;
};

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

function compile_egg_expression_impl(expr, scope, rc_flag = "c") {
  if (expr.type == "value") {
    return expr.value;
  } else if (expr.type == "word") {
    if (scope.defined_words.includes(expr.name)) {
      return expr.name;
    } else if (expr.name in scope) {
      return scope[expr.name];
    } else if (expr.name in scope.binary_ops) {
      return scope.binary_ops[expr.name](rc_flag);
    } else {
      throw new ReferenceError(`Undefined binding: ${expr.name}`);
    }
  }

  if (expr.type == "apply") {
    return compile_apply_expr(expr, scope, rc_flag);
  }
}

function compile_egg_expression(expr, scope) {
  let ret = compile_egg_expression_impl(expr, scope);
  return prepend_variable_declarations(scope) + ret;
}

function compile_apply_expr(apply_expr, scope, rc_flag) {
  let [op, args] = [apply_expr.operator, apply_expr.args];

  if (op.type == "word" && op.name in specialForms) {
    return specialForms[op.name](args, scope);
  }

  let compiled_args = args.map((arg) =>
    compile_egg_expression_impl(arg, scope)
  );
  let operator = compile_egg_expression_impl(op, scope, rc_flag);

  if (scope.defined_words.includes(operator)) {
    let tmp_name = operator;
    operator = (...args) => {
      let argsList = args.join(", ");
      return `${tmp_name}(${argsList})`;
    };
  }

  return operator(...compiled_args);
}

function createLocalScope(parent) {
  const scope = Object.create(parent);
  scope.defined_words = parent.defined_words;
  return scope;
}

function run_egg_code(egg_code, verbose = false) {
  let parsed_code = parse(egg_code, Object.create(topScope));

  if (verbose) {
    console.log(egg_code);
    console.log(parsed_code);
  }

  let compiled_code = compile_egg_expression(
    parsed_code,
    createLocalScope(myScope)
  );

  if (verbose) {
    console.log(compiled_code);
  }

  run_js_code(compiled_code);
}

let egg_code;
egg_code = "print(+(2, 10))";
run_egg_code(egg_code, true);

egg_code = "do(define(total, 0), define(boh, 2), print(2), print(total))";
run_egg_code(egg_code, true);

egg_code = `do(define(total, 0),
            define(count, 1),
            while(<(count, 11),
            do(define(total, +(total, count)),
            define(count, +(count, 1)))),
            print(total))`;
run_egg_code(egg_code, true);

egg_code = `do(define(plusOne, fun(a, +(a, 1))),
            print(plusOne(10)))`;
run_egg_code(egg_code, true);

egg_code = `do(define(pow, fun(base, exp,
            if(==(exp, 0),
            1,
            *(base, pow(base, -(exp, 1)))))),
            print(pow(2, 10)))`;
run_egg_code(egg_code, true);
