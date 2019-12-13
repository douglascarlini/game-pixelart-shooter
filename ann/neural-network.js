class NeuralNetwork {

    constructor(nInp, nHid, nOut) {

        this.inputs = [];
        this.hidden = [];
        this.numInputs = nInp;
        this.numHidden = nHid;
        this.numOutput = nOut;
        this.bias1 = new Matrix(1, this.numHidden);
        this.bias2 = new Matrix(1, this.numOutput);
        this.weig1 = new Matrix(this.numInputs, this.numHidden);
        this.weig2 = new Matrix(this.numHidden, this.numOutput);

        this.bias1.randomize();
        this.bias2.randomize();
        this.weig1.randomize();
        this.weig2.randomize();

        this.logFreq = 1000;
        this.logCount = 0;

    }

    activate(arr) {

        this.inputs = Matrix.arrToMtrx(arr);

        this.hidden = Matrix.dot(this.inputs, this.weig1);
        this.hidden = Matrix.add(this.hidden, this.bias1);
        this.hidden = Matrix.map(this.hidden, x => sigmoid(x));

        let output = Matrix.dot(this.hidden, this.weig2);
        output = Matrix.add(output, this.bias2); // ...
        output = Matrix.map(output, x => sigmoid(x));

        return output;

    }

    train(inp, out) {

        let output = this.activate(inp);

        let target = Matrix.arrToMtrx(out);
        let outputErrors = Matrix.subtract(target, output);

        this.logCount++;
        if (this.logCount > this.logFreq) {
            console.log(`error = ${outputErrors.data[0][0]}`);
            this.logCount = 0;
        }

        let outputDerivs = Matrix.map(output, x => sigmoid(x, true));
        let outputDeltas = Matrix.multiply(outputErrors, outputDerivs);

        let weig2T = Matrix.transpose(this.weig2);
        let hiddenErrors = Matrix.dot(outputDeltas, weig2T);

        let hiddenDerivs = Matrix.map(this.hidden, x => sigmoid(x, true));
        let hiddenDeltas = Matrix.multiply(hiddenErrors, hiddenDerivs);

        let hiddenT = Matrix.transpose(this.hidden);
        this.weig2 = Matrix.add(this.weig2, Matrix.dot(hiddenT, outputDeltas));

        let inputsT = Matrix.transpose(this.inputs);
        this.weig1 = Matrix.add(this.weig1, Matrix.dot(inputsT, hiddenDeltas));

        this.bias2 = Matrix.add(this.bias2, outputDeltas);
        this.bias1 = Matrix.add(this.bias1, hiddenDeltas);

    }

}

let data = { i: [[0, 0], [0, 1], [0, 1], [1, 1]], o: [[0], [1], [1], [0]] };
let nn = new NeuralNetwork(2, 10, 1);

for (let i = 0; i < 100; i++) {

    let idx = Math.floor(Math.random() * (data.i.length - 1));
    nn.train(data.i[idx], data.o[idx]);

}

let o = nn.activate([0, 1]);
console.log(o.data[0]);