var logule = require('../')
  , test   = require('tap').test
  , levels = ['trace', 'debug', 'info', 'warn', 'error', 'zalgo', 'line']
  , l = logule.sub('suppressed').suppress.apply({}, levels)
  , log = logule.sub('LOGULE').get('info')
  , privates = ['internal', 'log', 'namespaces', 'size', 'removed']
  , pubs = [
    'get'
  , 'suppress'
  , 'sub'
  , 'pad'
  , 'verify'
  , 'data'
  , 'allow'
  ];

test("chaining", function (t) {
  levels.forEach(function (lvl) {
    var sub = l.sub('wee')
      , single = sub.get(lvl);
    t.equal(l, l[lvl](1), 'l.' + lvl + " chains");
    t.equal(l.get(lvl)(1), undefined, "l.get('" + lvl + "') does not chain");
    t.equal(sub.info('wat'), sub, "sub chains");
    t.equal(single('wat'), undefined, "sub single returns undefined");
  });
  t.end();
});



test("encapsulation", function (t) {
  privates.forEach(function (p) {
    t.equal(l[p], undefined, 'l.' + p + ' is encapsulated');
  });
  t.end();
});


test("exports", function (t) {
  var expectedExports = levels.concat(pubs);

  pubs.forEach(function (p) {
    if (p === 'data') {
      return;
    }
    t.ok(!!l[p], "l." + p + " is exported");
    t.type(l[p], 'function', "l." + p + " is function");
  });

  t.ok(l.data !== undefined, "l.data is exported");
  t.ok(l.data.version !== undefined, "l.data.version is exported");
  t.ok(l.data.namespaces !== undefined, "l.data.namespaces is exported");

  levels.forEach(function (lvl) {
    var fn = l.get(lvl);
    t.type(fn, 'function', "l.get('" + lvl + "') returns a function");
    t.ok(fn() === undefined, "l.get('" + lvl + "')() returns undefined");
  });

  Object.keys(l).forEach(function (exprt) {
    var val = l[exprt];
    t.ok(expectedExports.indexOf(exprt) >= 0, "l exported key " + exprt + " is either a log convenience or one of the public functions");
  });
  t.end();
});

test("verify", function (t) {
  t.ok(logule.verify(logule), "logule.verify(logule) is logule");
  t.ok(!(logule.verify(logule.get('info'))), "logule.verify(logule.get('info')) is false");
  t.ok(logule.sub('arst').verify(logule), "logule.sub('arst').verify(logule) is true");
  t.ok(logule.verify(logule.sub('arst')), "logule.verify(logule.sub('arst')) is true");
  t.ok(logule.verify(l), "logule.verify(l)");
  t.ok(logule.verify(l.sub('arst')), "logule.verify(l.sub('arst'))");
  t.ok(l.verify(logule), "l.verify(logule)");
  t.ok(l.sub('arst').verify(logule), "l.sub('arst').verify(logule)");
  t.ok(!l.verify(), "!l.verify()");
  t.ok(!l.verify(null), "!l.verify(null)");
  t.ok(!l.verify({}), "!l.verify({})");
  t.ok(!l.verify({data:{version:null}}), "!l.verify(fakeObj)");

  levels.forEach(function (lvl) {
    t.ok(l.get(lvl) instanceof Function, "l.get('" + lvl + "') returns a function");
  });
  t.end();
});

test("subs", function (t) {
  t.ok(logule === logule, "obvious test");
  t.ok(logule !== logule.sub(), "logule.sub() does not return this");
  t.end();
});

