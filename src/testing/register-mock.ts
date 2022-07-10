/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyContainer, InjectionToken } from "tsyringe";

export function registerMock<T>(dc: DependencyContainer, t: InjectionToken<T>, a: any) {
    dc.register<T>(t, a as any);
}