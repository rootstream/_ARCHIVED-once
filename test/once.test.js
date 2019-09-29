"use strict";

const once = require("../once");
const chai = require("chai");
const sinon = require("sinon");
const chaiAP = require("chai-as-promised");
const Promise = require("bluebird");

chai.use(chaiAP);

describe("Monologue client tests", () => {
  it("should always pass", () => {
    chai.assert.isTrue(true);
  });

  it("should call an async function only once", async () => {
    const callback = sinon.fake();
    const returns = { test: "data" };
    const error = new Error("test");
    const thisObj = { id: "test" };

    async function incrementor() {
      chai.assert.deepEqual(this, thisObj);
      await Promise.delay(50);
      callback();
      // to check returns
      if (callback.calledTwice) return returns;
      if (callback.calledThrice) throw error;
    }

    const incrementOnce = once(incrementor).bind(thisObj);
    // firing two of these at the same time should only call one of them
    await chai.assert.isFulfilled(
      Promise.all([incrementOnce(), incrementOnce()])
    );
    chai.assert.isTrue(callback.calledOnce);
    // calling it again should not work since it's not marked reentrant
    await chai.assert.isFulfilled(incrementOnce());
    chai.assert.isTrue(callback.calledOnce);
    callback.resetHistory();

    const incrementOnceRE = once(incrementor, { reentrant: true }).bind(thisObj);
    // firing two of these at the same time should only call one of them
    await chai.assert.isFulfilled(
      Promise.all([incrementOnceRE(), incrementOnceRE()])
    );
    chai.assert.isTrue(callback.calledOnce);
    // calling it again should work since it's marked reentrant
    const data = await chai.assert.isFulfilled(incrementOnceRE());
    chai.assert.isTrue(callback.calledTwice);
    chai.assert.deepEqual(data, returns);
    // test error propagation
    await chai.assert.isRejected(incrementOnceRE());
    chai.assert.isTrue(callback.calledThrice);
    callback.resetHistory();
  });
});
