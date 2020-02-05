
const promise = require('./index.js'),
	is = require('type.util'),
	assert = require('assert');

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});

promise.timeout(() => {
	return promise.delay(1000);
}, 100).then(() => {
	throw new Error('failed');
}).catch((err) => {
	assert.equal(err.toString(), 'Error: timeout hit "100"ms');
});

Promise.resolve('cat').then(promise.tap(() => {
	return Promise.resolve('dog');
})).then((res) => {
	assert.equal(res, 'cat');
});

promise.measure(() => {
	return promise.limit(() => {
		return Promise.resolve('dog');
	}, 500).then((res) => {
		assert.equal(res, 'dog');
	});
}).then((res) => {
	assert.equal(Math.round(res / 1e8), 5);
});

promise.measure(() => {
	return promise.limit(() => {
		return promise.delay(1000).then(() => 'dog');
	}, 500).then((res) => {
		assert.equal(res, 'dog');
	});
}).then((res) => {
	assert.equal(Math.round(res / 1e8), 10);
});

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

promise.measure(() => {
	return promise.each(data, () => promise.delay(1000));
}).then((res) => {
	assert.equal(Math.round(res / 1e9), 2);
});

promise.measure(() => {
	return promise.each(data, () => promise.delay(100), 1);
}).then((res) => {
	assert.equal(Math.round(res / 1e9), 1);
});

promise.measure(() => {
	return promise.bulk(data, (res) => {
		assert.equal(is.number(res), true);
		return promise.delay(1000);
	});
}).then((res) => {
	assert.equal(Math.round(res / 1e9), 2);
});

promise.measure(() => {
	return promise.bulk(data, (res) => {
		assert.equal((is.array(res) && res.length === 5), true);
		return promise.delay(1000);
	}, 1, 5);
}).then((res) => {
	assert.equal(Math.round(res / 1e9), 2);
});
