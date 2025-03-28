load("@aspect_rules_js//js:defs.bzl", "js_library", "js_binary")

js_library(
    name = "constants",
    srcs = ["constants.mjs"],
    deps = [":graph"]
)

js_library(
    name = "graph",
    srcs = ["graph.mjs"],
)

js_library(
    name = "robot",
    srcs = ["robot.mjs"],
    deps = [":graph", ":utils"],
)

js_library(
    name = "policies",
    srcs = ["policies.mjs"],
    deps = [":constants", ":utils"],
)

js_library(
    name = "utils",
    srcs = ["utils.mjs"],
)

js_binary(
    name = "es1",
    entry_point = "main.mjs",
    data = [":robot", ":policies"],
)