import { Injectable } from '@nestjs/common';
import { LinearRegressionOutput } from './dto/slr.dto';

@Injectable()
export class SlrService {
  public calculateLinearRegression(
    x: number[],
    y: number[],
  ): LinearRegressionOutput {
    const n = x.length;
    const sumX = x.reduce((acc, xi) => acc + xi, 0);
    const sumY = y.reduce((acc, yi) => acc + yi, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi ** 2, 0);
    const angularCoefficient =
      (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const intercept = (sumY - angularCoefficient * sumX) / n;
    return { intercept, angularCoefficient };
  }

  public predict(
    x: number,
    linearRegressionData: LinearRegressionOutput,
  ): number {
    return (
      linearRegressionData.intercept +
      linearRegressionData.angularCoefficient * x
    );
  }
}
