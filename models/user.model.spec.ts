import { User } from './user.model';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User('1', 1, 'Jean', 'Dupont', 'jdoe')).toBeTruthy();
  });
});
