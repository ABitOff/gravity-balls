function SortedArray(compare_function) {
	let array = new Array();

	let search = function(obj) {
		if (array.length == 0)
			return 0;

		let min = 0;
		let max = array.length - 1;
		let cur = Math.floor(max / 2);

		while (max >= min) {
			let compare = compare_function(obj, array[cur]);
			if (compare == 0)
				break;
			else if (compare < 0)
				max = cur - 1;
			else if (compare > 0)
				min = cur + 1;
			else
				throw new Error('Compare function cannot return NaN.');
			cur = Math.floor((min + max) / 2);
		}

		return cur + 1;
	}

	let find = function(obj) {
		let s = search(obj);
		if (array[s] === obj)
			return s;
		for (let i = s - 1; compare(array[i], obj) == 1; i--) {
			if (array[i] === obj)
				return i;
		}
		for (let i = s + 1; compare(array[i], obj) == 1; i--) {
			if (array[i] === obj)
				return i;
		}
		return -1;
	}

	this.insert = function(obj) {
		let i = search(obj);
		array.splice(i, 0, obj);
	}

	this.insertEnumerable = function(obj) {
		for (let element of obj)
			this.insert(element);
	}

	this.get = (index) => array[index];

	this.toArray = () => array;

	this.length = () => array.length;

	this.remove = function(index) {
		array.splice(index, 1);
	}

	this.removeObject = function(obj) {
		let i = find(obj);
		if (i == -1)
			return false;
		this.remove(i);
		return true;
	}
}

//function compare(a, b){if(a < b)return-1;if(a == b)return 0;if(a > b)return 1;return NaN;};sa = new SortedArray(compare);sa.insertEnumerable([1,6,2,67,2,6,3,67,2,8,9,9,9,425,34,1]);sa.toArray();