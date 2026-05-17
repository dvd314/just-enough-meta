### Basic display

```meta
title: Morning Routine
duration: 25
completed: false

_config:
  display: true
```

### Using `include`

```meta
name: Green Tea
temperature: 80
brew_time: 3
tags:
  - drink
  - relaxing
  - evening

_config:
  display: true
  include:
    - name
    - tags
```

### Using `exclude`

```meta
planet: Europa
population: 0
station:
  name: Borealis
  active: true
coordinates:
  x: -184
  y: 92

_config:
  display: true
  exclude:
    - population
```

### Nested and edge-case values

```meta
plain_object:
  a: 1
  b: true
  c: null
empty_object: {}
empty_array: []
integer: 42
negative_integer: -7
float: 3.1415
zero: 0
boolean_true: true
boolean_false: false
null_value: null
string: hello
quoted_string: "hello: world"
multiline_literal: |
  line 1
  line 2
  line 3
multiline_folded: >
  line 1
  line 2
  line 3
date_value: 2026-04-06T12:34:56Z
nan_value: .nan
positive_infinity: .inf
negative_infinity: -.inf
nested_array:
  - 1
  - true
  - null
  - {}
  - []
  - key: value
    inner:
      - 10
      - 20
      - 30
nested_object:
  list:
    - first
    - second
    - third
  object:
    x: 10
    y: 20
    z:
      - alpha
      - beta
      - gamma
array_of_objects:
  - name: item1
    enabled: true
    data:
      - 1
      - 2
  - name: item2
    enabled: false
    data: []
  - name: item3
    enabled: true
    data:
      nested: yes
empty_string: ""
space_string: " "
escaped_string: "line1\nline2\tindent"
```
