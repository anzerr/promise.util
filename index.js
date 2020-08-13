
const is = require('type.util');

class Util {

	tap(cd) {
		return (res) => {
			const p = cd(res);
			if (p instanceof Promise) {
				return p.then(() => res);
			}
			return res;
		};
	}

	timeout(cd, n, err) {
		let done = false;
		return new Promise((resolve, reject) => {
			const p = cd();
			if (!is.instance(p, Promise)) {
				return p;
			}
			let timeout = setTimeout(() => {
				if (!done) {
					reject(err || new Error(`timeout hit "${n}"ms`));
				}
			}, n || 0);
			p.then((r) => {
				if (!done) {
					clearTimeout(timeout);
					resolve(r);
				}
				done = true;
			}).catch((e) => {
				if (!done) {
					clearTimeout(timeout);
					reject(e);
				}
				done = true;
			});
		});
	}

	delay(n = 100) {
		return new Promise((resolve) => setTimeout(resolve, n));
	}

	sleep(n) {
		return this.delay(n);
	}

	wait(n) {
		return this.wait(n);
	}

	limit(cd, n) {
		let out = null;
		return this.measure(() => {
			return cd().then((res) => (out = res));
		}).then((dur) => {
			const delay = Math.max(0, n - (dur / 1e6));
			return (delay === 0) ? null : this.delay(delay);
		}).then(() => out);
	}

	measure(cd) {
		let start = process.hrtime();
		return cd().then(() => {
			let end = process.hrtime(start);
			return (end[0] * 1e9 + end[1]);
		});
	}

	each(data, cd, max = 5) {
		const p = [];
		let x = 0;
		for (const i in data) {
			((v, k) => {
				if (!p[x % max]) {
					p[x % max] = Promise.resolve();
				}
				p[x % max] = p[x % max].then(() => cd(k.length === 1 ? k[0] : k, v));
				x++;
			})(i, data[i]);
		}
		return Promise.all(p);
	}

	bulk(data, cd, max = 5, size = 1) {
		if (!is.array(data) || size < 1) {
			throw new Error('need a array to build for batches');
		}
		const bulk = [];
		let i = 0;
		while (i < data.length) {
			bulk.push(data.slice(i, i + size));
			i += size;
		}
		return this.each(bulk, cd, max);
	}

}

let u = new Util();
module.exports = u;
module.exports.default = u;
