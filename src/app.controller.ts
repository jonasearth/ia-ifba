import { Controller, Get } from '@nestjs/common';
import {
  ActivationFunctionEnum,
  NeuralNetwork,
} from './neural-network/implementation/neural-network';

@Controller()
export class AppController {
  @Get('/health')
  health(): string {
    return 'OK';
    const entradas = [
      [1, 1],
      [2, 0],
      [0, 2],
      [3, -1],
      [-1, 3],
      [0, 0],
      [0, 1],
      [1, 0],
      [1, -1],
      [-1, 1],
      [3, 0],
      [0, 3],
    ];
    const type: number = 2;
    const expected = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];

    if (type === 1) {
      throw new Error('Not implemented');
      // const numNetworks = 100;
      // const maxIterations = 100000;
      // const mutateFactor = 0.01;
      // const errorThreshold = 0.01;
      // const errorStagnationThreshold = 10;
      // let lastError = Infinity;
      // let lastErrorCount = 0;
      // let lastBestNeuralNetwork: NeuralNetwork;

      // const neuralNetworks: NeuralNetwork[] = [];
      // const responses: number[][] = [];

      // for (let j = 0; j < numNetworks; j++) {
      //   const neuralNetwork = new NeuralNetwork(
      //     ActivationFunctionEnum.SIGMOID,
      //     2,
      //     10,
      //     1,
      //     1,
      //   );
      //   neuralNetworks.push(neuralNetwork);
      //   responses.push(
      //     entradas.map((entrada) => neuralNetwork.feedforward2(entrada)[0]),
      //   );
      // }

      // for (let i = 0; i < maxIterations; i++) {
      //   const errors = responses.map((response, i) => {
      //     const diffs = response.map((value, j) =>
      //       Math.abs(value - expected[j]),
      //     );
      //     const error = Math.max(...diffs);
      //     const soma = diffs.reduce((acc, curr) => acc + curr, 0);
      //     return { error: error > 0.8 ? Infinity : soma, i };
      //   });

      //   const best = errors.reduce((prev, curr) =>
      //     curr.error < prev.error ? curr : prev,
      //   );

      //   if (best.error === lastError) {
      //     lastErrorCount++;
      //   } else {
      //     lastErrorCount = 0;
      //     lastError = best.error;
      //   }

      //   const bestNeuralNetwork = neuralNetworks[best.i];

      //   if (best.error < errorThreshold) {
      //     lastBestNeuralNetwork = bestNeuralNetwork;
      //     console.log('Best neural network found');
      //     entradas.forEach((entrada) =>
      //       console.log(
      //         lastBestNeuralNetwork.feedforward2(entrada)[0].toFixed(20),
      //       ),
      //     );

      //     console.log(
      //       'Expected(near): 0 ',
      //       lastBestNeuralNetwork.feedforward2([3, 55])[0].toFixed(20),
      //     );
      //     console.log(
      //       'Expected(near): 1 ',
      //       lastBestNeuralNetwork
      //         .feedforward2([-555555555, 555555557])[0]
      //         .toFixed(20),
      //     );

      //     return;
      //   }

      //   neuralNetworks.length = 0;
      //   responses.length = 0;

      //   if (lastErrorCount < errorStagnationThreshold) {
      //     neuralNetworks.push(bestNeuralNetwork);
      //     responses.push(
      //       entradas.map(
      //         (entrada) => bestNeuralNetwork.feedforward2(entrada)[0],
      //       ),
      //     );
      //   } else {
      //     const newNetwork = new NeuralNetwork(
      //       ActivationFunctionEnum.SIGMOID,
      //       2,
      //       10,
      //       1,
      //       1,
      //     );
      //     neuralNetworks.push(newNetwork);
      //     responses.push(
      //       entradas.map((entrada) => newNetwork.feedforward2(entrada)[0]),
      //     );
      //   }

      //   for (let j = 1; j < numNetworks; j++) {
      //     let newNeuralNetwork: NeuralNetwork;

      //     if (
      //       j <= numNetworks * 0.8 &&
      //       lastErrorCount < errorStagnationThreshold
      //     ) {
      //       newNeuralNetwork = bestNeuralNetwork.clone();
      //       newNeuralNetwork.mutate(mutateFactor * i);
      //     } else {
      //       newNeuralNetwork = new NeuralNetwork(
      //         ActivationFunctionEnum.SIGMOID,
      //         2,
      //         10,
      //         1,
      //         1,
      //       );
      //     }

      //     neuralNetworks.push(newNeuralNetwork);
      //     responses.push(
      //       entradas.map((entrada) => newNeuralNetwork.feedforward2(entrada)[0]),
      //     );
      //   }
      //   lastBestNeuralNetwork = bestNeuralNetwork;
      // }

      // console.log('Last Best neural network found');
      // console.log(lastBestNeuralNetwork.outputLayer.getNeurons());
      // entradas.forEach((entrada) =>
      //   console.log(lastBestNeuralNetwork.feedforward2(entrada)[0].toFixed(20)),
      // );
    } else {
      const neuralNetwork = new NeuralNetwork(
        ActivationFunctionEnum.SIGMOID,
        2,
        30,
        1,
        1,
      );
      neuralNetwork.train(entradas, expected);
    }
  }
}
