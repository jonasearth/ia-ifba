import { LayerData, NeuralNetworkData } from '../dto/neural-network.dto';

/**
 * Represents a neural network.
 */
export class NeuralNetwork {
  public inputLayer: Layer;
  public hiddenLayers: Layer[] = [];
  public outputLayer: Layer;
  /**
   * Creates a new instance of NeuralNetwork with the given configuration.
   *
   * @param activationFunction The activation function to use for the neurons.
   * @param inputLength The number of neurons in the input layer.
   * @param hiddenNeuronsLength The number of neurons in each hidden layer.
   * @param hiddenLayersLength The number of hidden layers.
   * @param outputLength The number of neurons in the output layer.
   */
  constructor(
    private activationFunction: string | ActivationFunctionEnum,
    inputLength: number,
    hiddenNeuronsLength: number,
    hiddenLayersLength: number,
    outputLength: number,
  ) {
    this.inputLayer = this.buildLayer(LayerType.INPUT, inputLength, 0);
    for (let i = 0; i < hiddenLayersLength; i++) {
      this.hiddenLayers.push(
        this.buildLayer(
          LayerType.HIDDEN,
          hiddenNeuronsLength,
          i === 0 ? inputLength : this.hiddenLayers[i - 1].getNeurons().length,
        ),
      );
    }
    this.outputLayer = this.buildLayer(
      LayerType.OUTPUT,
      outputLength,
      this.hiddenLayers[hiddenLayersLength - 1].getNeurons().length,
    );
  }

  /**
   * Creates a new instance of NeuralNetwork from a JSON object.
   */
  static fromObject(data: any): NeuralNetwork {
    const neuralNetwork = new NeuralNetwork(
      data.activationFunction,
      data.inputLayer.neurons.length,
      data.hiddenLayers[0].neurons.length,
      data.hiddenLayers.length,
      data.outputLayer.neurons.length,
    );
    neuralNetwork.inputLayer.getNeurons().forEach((neuron, index) => {
      neuron.setBias(data.inputLayer.neurons[index].bias);
      neuron.setWeights(data.inputLayer.neurons[index].weights);
      neuron.setValue(data.inputLayer.neurons[index].value);
      neuron.setDelta(data.inputLayer.neurons[index].delta);
    });

    neuralNetwork.hiddenLayers.forEach((layer, indexLayer) => {
      layer.getNeurons().forEach((neuron, index) => {
        neuron.setBias(data.hiddenLayers[indexLayer].neurons[index].bias);
        neuron.setWeights(data.hiddenLayers[indexLayer].neurons[index].weights);
        neuron.setValue(data.hiddenLayers[indexLayer].neurons[index].value);
        neuron.setDelta(data.hiddenLayers[indexLayer].neurons[index].delta);
      });
    });

    neuralNetwork.outputLayer.getNeurons().forEach((neuron, index) => {
      neuron.setBias(data.outputLayer.neurons[index].bias);
      neuron.setWeights(data.outputLayer.neurons[index].weights);
      neuron.setValue(data.outputLayer.neurons[index].value);
      neuron.setDelta(data.outputLayer.neurons[index].delta);
    });
    return neuralNetwork;
  }
  toObject(): NeuralNetworkData {
    return {
      activationFunction: this.activationFunction,
      inputLayer: this.inputLayer.toObject(),
      hiddenLayers: this.hiddenLayers.map((layer) => layer.toObject()),
      outputLayer: this.outputLayer.toObject(),
    };
  }
  /**
   * Creates a deep copy of the current neural network.
   *
   * The cloned neural network has the same architecture and weights as the current neural network.
   * The activation function is also the same.
   *
   * @returns A deep copy of the current neural network.
   */
  clone(): NeuralNetwork {
    const cloneNetwork = new NeuralNetwork(
      this.activationFunction,
      this.inputLayer.getNeurons().length,
      this.hiddenLayers[0].getNeurons().length,
      this.hiddenLayers.length,
      this.outputLayer.getNeurons().length,
    );

    cloneNetwork.inputLayer = this.inputLayer.clone();
    cloneNetwork.hiddenLayers = this.hiddenLayers.map((layer) => layer.clone());
    cloneNetwork.outputLayer = this.outputLayer.clone();

    return cloneNetwork;
  }

  /**
   * Train the neural network with a given input and a target.
   *
   * This method will update the weights and biases of the neural network
   * using backpropagation.
   *
   * @param inputs The input vector for the neural network.
   * @param targets The target vector for the neural network. If not provided,
   * the method will assume that the targets are the same as the inputs.
   * @param learningRate The learning rate for the backpropagation algorithm.
   * If not provided, the method will use the default learning rate.
   */

  subtractMatrix(m1: number[][], m2: number[][]): number[][] {
    return m1.map((v1, linha) =>
      v1.map((x, coluna) => m1[linha][coluna] - m2[linha][coluna]),
    );
  }
  productScalar(a: number[][], b: number[][]): number[][] {
    return a.map((x) =>
      this.transpose(b).map((y) =>
        x.map((c, index) => x[index] * y[index]).reduce((m, n) => m + n),
      ),
    );
  }
  multiplyMatrix(m1: number[][], m2: number[][]): number[][] {
    return m1.map((v1, linha) =>
      v1.map((x, coluna) => m1[linha][coluna] * m2[linha][coluna]),
    );
  }
  applyActivationFunctionMatrix(m: number[][]): number[][] {
    return m.map((v) =>
      v.map((x) => {
        const a = this.applyActivationFunction(x);
        return a;
      }),
    );
  }
  derivateMatrix(a: number[][]): number[][] {
    return this.multiplyMatrix(
      a,
      a.map((v) => v.map((x) => this.derivateActivationFunction(x))),
    );
  }

  applyActivationFunction(n: number): number {
    switch (this.activationFunction) {
      case ActivationFunctionEnum.SIGMOID:
        return ActivationFunctions.sigmoid(n);
      case ActivationFunctionEnum.TANH:
        return ActivationFunctions.tanh(n);
      case ActivationFunctionEnum.LINEAR:
        return ActivationFunctions.linear(n);
      case ActivationFunctionEnum.RELU:
        return ActivationFunctions.relu(n);
      default:
        throw new Error('Função de ativação desconhecida!');
    }
  }

  derivateActivationFunction(n: number) {
    switch (this.activationFunction) {
      case ActivationFunctionEnum.SIGMOID:
        return ActivationFunctions.dsigmoid(n);
      case ActivationFunctionEnum.TANH:
        return ActivationFunctions.dtanh(n);
      case ActivationFunctionEnum.LINEAR:
        return ActivationFunctions.dlinear();
      case ActivationFunctionEnum.RELU:
        return ActivationFunctions.drelu(n);
      default:
        throw new Error('Função de ativação desconhecida!');
    }
  }
  predict(inputs: number[][]): number[][] {
    return this.feedforward(inputs).response;
  }
  feedforward(inputs: number[][]): {
    response: number[][];
    hiddenResponse: number[][];
    hiddenWeights: number[][];
    outputWeights: number[][];
  } {
    const hiddenWeights = this.transpose(
      this.hiddenLayers[0].getNeurons().map((neuron) => neuron.getWeights()),
    );
    const outputWeights = this.transpose(
      this.outputLayer.getNeurons().map((neuron) => neuron.getWeights()),
    );
    const hiddenResponse = this.applyActivationFunctionMatrix(
      this.productScalar(inputs, hiddenWeights),
    );

    const response = this.applyActivationFunctionMatrix(
      this.productScalar(hiddenResponse, outputWeights),
    );
    return {
      response,
      hiddenResponse,
      hiddenWeights,
      outputWeights,
    };
  }
  train(
    inputs: number[][],
    targets?: number[],
    interations: number = 10000,
  ): {
    response: number[][];
    err: number[][];
  } {
    const expected = this.transpose([targets]);
    // obtendo os pesos da camada escondida
    let hiddenWeights = this.transpose(
      this.hiddenLayers[0].getNeurons().map((neuron) => neuron.getWeights()),
    );
    let response = null;
    // obtendo os pesos da camada de saida
    let outputWeights = this.transpose(
      this.outputLayer.getNeurons().map((neuron) => neuron.getWeights()),
    );
    let hiddenResponse: number[][];
    for (let index = 0; index < interations; index++) {
      // Propaga os valores de entrada para as camadas escondidas
      hiddenResponse = this.applyActivationFunctionMatrix(
        this.productScalar(inputs, hiddenWeights),
      );
      // Propaga os valores da camada escondida para a camada de saida
      response = this.applyActivationFunctionMatrix(
        this.productScalar(hiddenResponse, outputWeights),
      );
      // Calcula o erro
      const error = this.subtractMatrix(response, expected);
      // Calcula a derivada da resposta
      const derivativeResponse = this.derivateMatrix(response);
      // Calcula a derivada da camada escondida
      const derivadaHiddenResponse = this.derivateMatrix(hiddenResponse);
      // Calcula o delta dos pesos da camada de saida
      const deltaPesosOut = this.productScalar(
        this.transpose(hiddenResponse),
        this.multiplyMatrix(error, derivativeResponse),
      );
      // Calcula o delta dos pesos da camada escondida
      const deltaPesosHidden = this.productScalar(
        this.transpose(inputs),
        this.multiplyMatrix(
          this.productScalar(
            this.multiplyMatrix(error, derivativeResponse),
            this.transpose(outputWeights),
          ),
          derivadaHiddenResponse,
        ),
      );
      // Atualiza os pesos da camada de saida
      outputWeights = this.subtractMatrix(outputWeights, deltaPesosOut);
      // Atualiza os pesos da camada escondida
      hiddenWeights = this.subtractMatrix(hiddenWeights, deltaPesosHidden);
    }

    const transposedResponse = this.transpose(response);
    // Atualiza os pesos e valores dos neuronios da camada escondida
    this.transpose(hiddenWeights).forEach((neuron, index) => {
      this.hiddenLayers[0].getNeuron(index).setWeights(neuron);
    });
    hiddenResponse[hiddenResponse.length - 1].forEach((v, i) =>
      this.hiddenLayers[0].getNeuron(i).setValue(v),
    );

    // Atualiza os pesos e valores dos neuronios da camada de saida
    this.outputLayer
      .getNeuron(0)
      .setValue(transposedResponse[0][transposedResponse[0].length - 1]);
    this.transpose(outputWeights).forEach((neuron, index) => {
      this.outputLayer.getNeuron(index).setWeights(neuron);
    });

    return {
      response,
      err: this.subtractMatrix(response, expected),
    };
  }

  /**
   * Adjusts the weights and bias of all layers and neurons randomly based on the learning rate.
   * @param learningRate The value of adjustment for each weight and bias.
   */
  mutate(learningRate?: number): void {
    // Ajusta pesos e bias de todas camadas e neuronios aleatoriamente a partir do learningRate
    const sumOrSubtract = Math.random() > 0.5 ? 1 : -1;
    this.outputLayer.getNeurons().forEach((neuron) => {
      if (sumOrSubtract === 1) {
        neuron.setBias(neuron.getBias() + (Math.random() / 10) * learningRate);
        neuron.getWeights().forEach((weight, index) => {
          neuron.setWeight(weight + (Math.random() / 10) * learningRate, index);
        });
      } else {
        neuron.setBias(neuron.getBias() - (Math.random() / 10) * learningRate);
        neuron.getWeights().forEach((weight, index) => {
          neuron.setWeight(weight - (Math.random() / 10) * learningRate, index);
        });
      }
    });

    this.hiddenLayers.forEach((layer) => {
      layer.getNeurons().forEach((neuron) => {
        if (sumOrSubtract === 1) {
          neuron.setBias(neuron.getBias() + Math.random() * learningRate);
          neuron.getWeights().forEach((weight, index) => {
            neuron.setWeight(weight + Math.random() * learningRate, index);
          });
        } else {
          neuron.setBias(neuron.getBias() - Math.random() * learningRate);
          neuron.getWeights().forEach((weight, index) => {
            neuron.setWeight(weight - Math.random() * learningRate, index);
          });
        }
      });
    });
  }

  /**
   * Performs the forward propagation of the neural network based on the input values.
   * @param inputs Input values.
   * @returns Output values of the neural network.
   */
  feedforward2(inputs: number[]): number[] {
    this.inputLayer.setNeuronsValues(inputs);

    // Propaga os valores de entrada para as camadas escondidas
    for (let i = 0; i < this.hiddenLayers.length; i++) {
      // Multiplica os valores de entrada pelos pesos da camada escondida
      this.multiplyLayers(
        i === 0 ? this.inputLayer : this.hiddenLayers[i - 1],
        this.hiddenLayers[i],
      );
      // Aplica o bias na camada escondida
      this.hiddenLayers[i].applyBias();
      // Aplica a funcção de ativação na camada escondida
      this.hiddenLayers[i].applyActivationFunction(this.activationFunction);
    }
    // Multiplica os valores de entrada pelos pesos da camada de saida
    this.multiplyLayers(
      this.hiddenLayers[this.hiddenLayers.length - 1],
      this.outputLayer,
    );
    // Aplica o bias na camada de saida
    this.outputLayer.applyBias();
    // Aplica a funcção de ativação na camada de saida
    this.outputLayer.applyActivationFunction(this.activationFunction);
    //console.log('OUTPUT LAYER: ', this.outputLayer.getNeurons()[0].getValue());
    return this.outputLayer.getNeurons().map((neuron) => neuron.getValue());
  }
  /**
   * Calculates the output layer's delta and stores it in each neuron.
   * @param targets Desired output values.
   */
  calculateOutputLayerDelta(targets: number[]): void {
    for (let j = 0; j < this.outputLayer.getNeurons().length; j++) {
      const neuron = this.outputLayer.getNeuron(j);
      const outputValue = neuron.getValue();
      const targetValue = targets[j];

      // Calcula o erro (o_j - y_j)
      const error = outputValue - targetValue;

      // Derivada da função de ativação
      let derivative: number;
      switch (this.activationFunction) {
        case ActivationFunctionEnum.SIGMOID:
          derivative = ActivationFunctions.dsigmoid(outputValue);
          break;
        case ActivationFunctionEnum.TANH:
          derivative = ActivationFunctions.dtanh(outputValue);
          break;
        case ActivationFunctionEnum.LINEAR:
          derivative = 1;
          break;
        default:
          throw new Error('Função de ativação desconhecida!');
      }

      // Calcula o delta
      const delta = error * derivative;
      const deltaOutput =
        // Guarda o delta para uso posterior na atualização dos pesos
        this.outputLayer.getNeurons()[j].setDelta(delta);
    }
  }

  transpose(a: number[][]): number[][] {
    return a[0].map((x, i) => a.map((y) => y[i]));
  }
  /**
   * Multiplies the output values of one layer with the input weights of another
   * layer and sums the results. The result is stored in each neuron of the second
   * layer as its input value.
   * @param layer1 Input layer.
   * @param layer2 Output layer.
   */
  multiplyLayers(layer1: Layer, layer2: Layer): void {
    if (
      layer1.getNeurons().length !== layer2.getNeurons()[0].getWeights().length
    ) {
      throw new Error(
        'Layer1 neurons and Layer2 neuron weights must have the same length!',
      );
    }
    for (
      let layer1NeuronIndex = 0;
      layer1NeuronIndex < layer1.getNeurons().length;
      layer1NeuronIndex++
    ) {
      for (
        let layer2NeuronWeightsIndex = 0;
        layer2NeuronWeightsIndex < layer2.getNeurons()[0].getWeights().length;
        layer2NeuronWeightsIndex++
      ) {
        for (
          let layer2NeuronIndex = 0;
          layer2NeuronIndex < layer2.getNeurons().length;
          layer2NeuronIndex++
        ) {
          layer2.setNeuronValue(
            layer2.getNeuron(layer2NeuronIndex).getValue() +
              layer1.getNeuron(layer1NeuronIndex).getValue() *
                layer2.getNeuron(layer2NeuronIndex).getWeights()[
                  layer2NeuronWeightsIndex
                ],
            layer2NeuronIndex,
          );
        }
      }
    }
  }

  /**
   * Builds a layer.
   * @param type Layer type.
   * @param neuronsLength Number of neurons in the layer.
   * @param previousLayerNeuronsLength Number of neurons in the previous layer.
   * @param values Optional initial values for neurons.
   * @param neuronWeights Optional weights for neurons.
   * @param bias Optional bias values for neurons.
   * @returns The built layer.
   */
  private buildLayer(
    type: LayerType,
    neuronsLength: number,
    previousLayerNeuronsLength: number,
    values?: number[],
    neuronWeights?: number[][],
    bias?: number[],
  ): Layer {
    return new Layer(
      type,
      neuronsLength,
      previousLayerNeuronsLength,
      values,
      neuronWeights,
      bias,
    );
  }
}
export class ActivationFunctions {
  static sigmoid(x: number): number {
    return 1 / (1 + Math.pow(Math.E, -x));
  }
  // Derivada da função sigmoide
  static dsigmoid(y: number): number {
    return y * (1 - y);
  }
  // Função de ativação tanh
  static tanh(x: number): number {
    return Math.tanh(x);
  }

  // Derivada da função tanh
  static dtanh(y: number): number {
    return 1 - y * y;
  }

  // Função de ativação linear
  static linear(x: number): number {
    return x;
  }

  // Derivada da função linear
  static dlinear(): number {
    return 1;
  }
  static relu(x: number): number {
    return Math.max(0, x);
  }
  static drelu(x: number): number {
    return x > 0 ? 1 : 0;
  }
}
export enum ActivationFunctionEnum {
  TANH = 'TANH',
  SIGMOID = 'SIGMOID',
  LINEAR = 'LINEAR',
  RELU = 'RELU',
}
export class Layer {
  private neurons: Neuron[];
  private errors: number[] = [];
  constructor(
    private type: LayerType,
    neuronsLength: number,
    previousLayerNeuronsLength: number,
    values?: number[],
    neuronWeights?: number[][],
    bias?: number[],
  ) {
    this.neurons = [];
    for (let i = 0; i < neuronsLength; i++) {
      this.buildNeuron(
        previousLayerNeuronsLength,
        values?.[i],
        neuronWeights?.[i],
        bias?.[i],
      );
    }
  }
  /**
   * Creates a deep copy of the layer.
   * The cloned layer has the same type, neurons length and weights length as the current layer.
   * The cloned layer's neurons are also cloned from the current layer's neurons.
   * The cloned layer also copies the errors from the current layer.
   * @returns A deep copy of the layer.
   */
  clone(): Layer {
    const clonedLayer = new Layer(
      this.type,
      this.neurons.length,
      this.neurons[0].getWeights().length,
    );
    clonedLayer.neurons = this.neurons.map((neuron) => neuron.clone());
    clonedLayer.errors = this.errors;
    return clonedLayer;
  }
  toObject(): LayerData {
    return {
      type: this.type,
      neurons: this.neurons.map((neuron) => ({
        weights: neuron.getWeights(),
        value: neuron.getValue(),
        bias: neuron.getBias(),
        delta: neuron.getDelta(),
      })),
      errors: this.errors,
    };
  }
  /**
   * Applies the bias to each neuron in the layer.
   * This is done by calling the [[Neuron.applyBias]] method on each neuron.
   */
  applyBias() {
    for (let i = 0; i < this.neurons.length; i++) {
      this.neurons[i].applyBias();
    }
  }

  /**
   * Applies the given activation function to each neuron in the layer.
   * This is done by calling the [[Neuron.applyActivationFunction]] method on each neuron.
   * @param activationFunction The activation function to be applied.
   */
  applyActivationFunction(activationFunction: ActivationFunctionEnum | string) {
    for (let i = 0; i < this.neurons.length; i++) {
      this.neurons[i].applyActivationFunction(activationFunction);
    }
  }
  /**
   * Builds a new neuron and adds it to the layer.
   * If the layer is an input layer, the neuron will have a value set to the given value.
   * If the layer is not an input layer, the neuron will be initialized with the given weights and bias.
   * @param previousLayerNeuronsLength The length of the previous layer's neurons.
   * @param value The value of the neuron if the layer is an input layer.
   * @param weights The weights of the neuron if the layer is not an input layer.
   * @param bias The bias of the neuron if the layer is not an input layer.
   */
  buildNeuron(
    previousLayerNeuronsLength: number,
    value?: number,
    weights?: number[],
    bias?: number,
  ) {
    this.neurons.push(
      new Neuron(
        previousLayerNeuronsLength,
        this.type === LayerType.INPUT,
        value,
        weights,
        bias,
      ),
    );
  }
  getNeurons() {
    return this.neurons;
  }
  getNeuron(index: number) {
    return this.neurons[index];
  }
  /**
   * Sets the values of all neurons in the layer.
   * @param values The values to be set.
   * @throws Error if the length of the values array is not equal to the number of neurons in the layer.
   */
  setNeuronsValues(values: number[]) {
    if (values.length !== this.neurons.length) {
      throw new Error('Values must have the same length as the neurons!');
    }
    for (let i = 0; i < this.neurons.length; i++) {
      this.neurons[i].setValue(values[i]);
    }
  }
  setNeuronValue(value: number, index: number) {
    this.neurons[index].setValue(value);
  }
}
export class Neuron {
  private delta: number;
  private bias: number;
  private weights: number[] = [];
  private value: number = 0;
  /**
   * Creates a new neuron.
   * @param weightLength The length of the weights array.
   * @param isInputLayer Whether this neuron is in an input layer.
   * @param value The value of this neuron.
   * @param weights The weights of this neuron.
   * @param bias The bias of this neuron.
   * @param delta The delta of this neuron.
   */
  constructor(
    weightLength: number,
    isInputLayer: boolean,
    value?: number,
    weights?: number[],
    bias?: number,
    delta?: number,
  ) {
    if (value !== undefined) {
      this.setValue(value);
    }
    if (!isInputLayer) {
      this.buildWeights(weightLength, weights);
      this.buildBias(bias);
    }
    if (delta !== undefined) {
      this.delta = delta;
    }
  }
  /**
   * Creates a deep copy of the neuron.
   * @returns A deep copy of the neuron.
   */
  clone(): Neuron {
    const clonedNeuron = new Neuron(
      this.weights.length,
      false, // não é camada de entrada
      this.value,
      [...this.weights],
      this.bias,
      this.delta,
    );
    return clonedNeuron;
  }
  /**
   * Builds the weights of this neuron.
   * If weights are provided, they must have the same length as the weight length.
   * If no weights are provided, they are randomly generated and normalized.
   * @param weightLength The length of the weights.
   * @param weights The weights of this neuron.
   */
  buildWeights(weightLength: number, weights?: number[]) {
    if (weights?.length && weightLength !== weights.length) {
      throw new Error(
        'Weights must have the same length as the weight length!',
      );
    }
    if (weights !== undefined) {
      this.weights = weights;
    } else {
      for (let i = 0; i < weightLength; i++) {
        this.weights.push(Math.random() * 2 - 1);
      }
    }
  }
  /**
   * Applies the given activation function to the value of this neuron.
   * @param activationFunction The activation function to be applied.
   * @remarks
   * Supported activation functions are:
   * - TANH
   * - SIGMOID
   * - LINEAR
   */
  applyActivationFunction(activationFunction: ActivationFunctionEnum | string) {
    switch (activationFunction) {
      case ActivationFunctionEnum.TANH:
        this.value = ActivationFunctions.tanh(this.value);
        break;
      case ActivationFunctionEnum.SIGMOID:
        this.value = ActivationFunctions.sigmoid(this.value);
        break;
      case ActivationFunctionEnum.LINEAR:
        this.value = ActivationFunctions.linear(this.value);
        break;
      case ActivationFunctionEnum.RELU:
        this.value = ActivationFunctions.relu(this.value);
        break;
    }
  }

  /**
   * Builds the bias of this neuron.
   * If bias is provided, it is used. Otherwise, a random value between -1 and 1 is used.
   * @param bias The bias of this neuron.
   */
  buildBias(bias?: number) {
    if (bias !== undefined) {
      this.bias = bias;
    } else {
      this.bias = Math.random() * 2 - 1;
    }
  }
  applyBias() {
    this.value += this.bias;
  }
  setWeights(weights: number[]) {
    this.weights = weights;
  }
  setWeight(weight: number, index: number) {
    this.weights[index] = weight;
  }
  getWeights() {
    return this.weights;
  }
  getWeight(index: number) {
    return this.weights[index];
  }
  setBias(bias: number) {
    this.bias = bias;
  }
  getBias() {
    return this.bias;
  }
  setValue(value: number) {
    this.value = value;
  }
  getValue() {
    return this.value;
  }
  setDelta(delta: number) {
    this.delta = delta;
  }
  getDelta() {
    return this.delta;
  }
}

export enum LayerType {
  INPUT,
  HIDDEN,
  OUTPUT,
}
