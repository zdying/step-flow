var Flow = require('../lib/flow');
var assert = require('assert');

describe('# error catch', function () {
  var flow = new Flow();
  var errorInfo = null;

  flow.use(
    'step1',
    function fn1 (ctx, next) {
      ctx.fn1 = true;
      ctx.order.push('fn1');
      next();
    },
    function fn11 (ctx, next) {
      ctx.fn11 = true;
      ctx.order.push('fn11');
      next('fn11 has some error.');
    }
  );

  flow
    .use('step2', function fn2 (ctx, next) {
      ctx.fn2 = true;
      ctx.order.push('fn2');
      next();
    })
    .use(function fn3 (ctx, next) {
      ctx.order.push('fn3');
      ctx.fn3 = true;
    });

  flow.catch(function (err) {
    errorInfo = err;
  });

  var ctx = {order: []};

  flow.run(ctx);

  it('# should catch the error info', function () {
    assert.equal(errorInfo, 'fn11 has some error.');
  });

  it('# should run functions before error occurs', function () {
    assert.equal(ctx.fn1, true);
    assert.equal(ctx.fn11, true);
  });

  it('# should not run functions after error occurs', function () {
    assert.equal(ctx.fn2, undefined);
    assert.equal(ctx.fn3, undefined);
  });
});
