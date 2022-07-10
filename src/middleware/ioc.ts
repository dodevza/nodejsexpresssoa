// src/lib/tsyringeTsoaIocContainer.ts
// Target this file in your tsoa.json's "iocModule" property

import { IocContainer } from '@tsoa/runtime';
import { container, DependencyContainer } from 'tsyringe';
import { HttpContextService } from './http-context';

// Included iocPipeline to intercept the creation of containers when running super tests
export const iocPipeline = {
  afterCreation: (container: DependencyContainer): DependencyContainer => {
    return container;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function iocContainer(request: any): IocContainer {
  // Allow for scoped per request scenarios when createChildContainer
  const child = iocPipeline.afterCreation(container.createChildContainer());
  
  const httpContextService = child.resolve<HttpContextService>(HttpContextService);
  httpContextService.setContext(request);
  return {
    get: <T>(controller: { prototype: T }): T => {
      
      return child.resolve<T>(controller as never);
    },
  }
}

