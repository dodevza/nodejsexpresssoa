/* eslint-disable max-lines-per-function */
import request from 'supertest'
import {Express} from 'express-serve-static-core'
import { createServer } from '../../middleware/server'
import { Logger } from '../../shared/logging/logger'
import { iocPipeline } from '../../middleware/ioc'
import { DependencyContainer } from 'tsyringe'
import { UserRepository } from '../../users/user.repository'
import { UserMockRepository } from '../../testing/__mocks__/user-mock.repository'
import { registerMock } from '../../testing/register-mock'


let server: Express
beforeAll(async () => {
  server = await createServer()
  iocPipeline.afterCreation = (container: DependencyContainer): DependencyContainer => {
    registerMock(container, UserRepository, UserMockRepository);
    return container;
  };
})

afterAll(async () => {
    Logger.info('Close All Connections')
})

describe('POST /api/v1/auth', () => {
  it('should return 200 & valid response for a valid login request', done => {
    request(server)
      .post(`/api/v1/auth`)
      .send({
        userName: 'mike@example.com',
        password: 'Pass123',
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body).toEqual({
          token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        })
        done()
      })
  })

  it('should return 422 & valid response for a non-existing user', done => {
    request(server)
      .post(`/api/v1/auth`)
      .send({
        userName: 'noemail@example.com',
        password: '2133'
      })
      .expect(422)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body.message).toBeTruthy()
        expect(res.body.context).toBeTruthy()
        done()
      })
  })

  it('should return 422 & valid response for invalid request', done => {
    request(server)
      .post(`/api/v1/auth`)
      .send({
        userName: 'mike@example.com',
        password: 123
      })
      .expect(422)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body.message).toBeTruthy();
        expect(res.body.context).toBeTruthy();
        expect(res.body.reason).toBe("invalid");
        done()
      })
  })
})