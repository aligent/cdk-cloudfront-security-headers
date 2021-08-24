import { Bundling } from '@aws-cdk/aws-lambda-nodejs/lib/bundling';
import { Runtime } from '@aws-cdk/aws-lambda';
import { experimental } from '@aws-cdk/aws-cloudfront';
import { EdgeFunction } from "@aws-cdk/aws-cloudfront/lib/experimental";
import * as cdk from '@aws-cdk/core';

export class SecurityHeaderFunction extends cdk.Construct {
  readonly edgeFunction: EdgeFunction;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);
    this.edgeFunction = new experimental.EdgeFunction(
      this,
      'SecurityHeaderFunction',
      {
        code: Bundling.bundle({
          entry: `${__dirname}/handlers/security-header.ts`,
          runtime: Runtime.NODEJS_14_X,
          sourceMap: true,
          projectRoot: `${__dirname}/handlers/`,
          depsLockFilePath: `${__dirname}/handlers/package-lock.json`
        }),
        runtime: Runtime.NODEJS_14_X,
        handler: 'index.handler',
      }
    );

    new cdk.CfnOutput(this, 'SecurityHeaderVersionARN', {
      description: 'SecurityHeaderVersionARN',
      value: this.edgeFunction.currentVersion.edgeArn,
    });
  }
}
