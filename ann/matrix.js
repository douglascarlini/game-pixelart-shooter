function sigmoid(x, d = false) { return d ? x * (1 - x) : 1 / (1 + Math.exp(-x)); }

class Matrix {

    constructor(rows, cols, data = []) {

        this.rows = rows;
        this.cols = cols;
        this.data = data;

        if (!data || data.length == 0) {
            for (let i = 0; i < this.rows; i++) {
                let arr = [];
                for (let j = 0; j < this.cols; j++)
                    arr.push(0);
                this.data.push(arr);
            }
        }

        if (data.length != rows || data[0].length != cols)
            throw new Error("Incorrect data dimensions");

    }

    print() { console.table(this.data); }

    randomize() { this.map((elm, i, j) => Math.random() * 2 - 1); }

    map(func) { this.data = this.data.map((arr, i) => arr.map((num, j) => func(num, i, j))); }

    static map(m1, func) {
        let m0 = new Matrix(m1.rows, m1.cols);
        //m0.data = m0.map((num, i, j) => func(num));
        m0.data = m0.data.map((arr, i) => arr.map((num, j) => func(num, i, j)));
        if (!m0.data) console.log(m0);
        return m0;
    }

    static check(m1, m2) { if (m1.rows != m2.rows || m1.cols != m2.cols) { throw new Error(`Incompatibles`); } }

    static arrToMtrx(arr) { return new Matrix(1, arr.length, [arr]) }

    static dot(m1, m2) {

        if (m1.cols != m2.rows) throw new Error(`Incompatibles for 'dot'`);

        let m0 = new Matrix(m1.rows, m2.cols);

        for (let i = 0; i < m0.rows; i++) {
            for (let j = 0; j < m0.cols; j++) {
                let sum = 0;
                for (let k = 0; k < m1.cols; k++) {
                    sum += m1.data[i][k]
                        * m2.data[k][j];
                }
                m0.data[i][j] = sum;
            }
        }

        /* m0.map((num, i, j) => {
            let sum = 0;
            for (let k = 0; k < m1.cols; k++)
                sum += m1.data[i][k] * m2.data[k][j];
            return sum;
        }); */

        return m0;

    }

    static add(m1, m2) {

        Matrix.check(m1, m2);
        let m0 = new Matrix(m1.rows, m1.cols);
        m0.map((num, i, j) => m1.data[i][j] + m2.data[i][j]);
        return m0;

    }

    static scalar(m1, n) {

        let m0 = new Matrix(m1.rows, m1.cols);
        m0.map((num, i, j) => m1.data[i][j] * n);
        return m0;

    }

    static multiply(m1, m2) {

        Matrix.check(m1, m2);
        let m0 = new Matrix(m1.rows, m1.cols);
        m0.map((num, i, j) => m1.data[i][j] * m2.data[i][j]);
        return m0;

    }

    static subtract(m1, m2) {

        Matrix.check(m1, m2);
        let m0 = new Matrix(m1.rows, m1.cols);
        m0.map((num, i, j) => m1.data[i][j] - m2.data[i][j]);
        return m0;

    }

    static transpose(m1) {

        let m0 = new Matrix(m1.cols, m1.rows);
        m0.map((num, i, j) => m1.data[j][i]);
        return m0;

    }

}