import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

import { AuthService } from './auth-service.service';

describe('AuthService', () => {
  let service: AuthService;
  let api: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    localStorage.clear();
    api = jasmine.createSpyObj('ApiService', ['refreshToken', 'getMe']);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: api }],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('considère connecté si le refresh token est encore valide', () => {
    localStorage.setItem('access_token', 'expired');
    localStorage.setItem('expires_at', String(Date.now() - 60_000));
    localStorage.setItem('refresh_token', 'valid');
    localStorage.setItem('refresh_expires_at', String(Date.now() + 3600_000));

    expect(service.authenticated).toBeTrue();
  });

  it('restaure le profil depuis me_snapshot sans appeler le refresh', (done) => {
    localStorage.setItem('access_token', 'valid');
    localStorage.setItem('expires_at', String(Date.now() + 3600_000));
    localStorage.setItem(
      'me_snapshot',
      JSON.stringify({
        profile: {
          keycloak_sub: 'sub-1',
          first_name: 'Jean',
          last_name: 'Dupont',
          username: 'jean',
          email: 'jean@example.com',
          is_super_admin: false,
        },
        is_app_admin: false,
      })
    );

    service.restoreSession().subscribe((ok) => {
      expect(ok).toBeTrue();
      expect(service.getCurrentUser()?.prenom_role).toBe('Jean');
      expect(api.refreshToken).not.toHaveBeenCalled();
      done();
    });
  });

  it('rafraîchit silencieusement un access token expiré', (done) => {
    localStorage.setItem('access_token', 'expired');
    localStorage.setItem('expires_at', String(Date.now() - 60_000));
    localStorage.setItem('refresh_token', 'refresh');
    localStorage.setItem('refresh_expires_at', String(Date.now() + 3600_000));
    api.refreshToken.and.returnValue(
      of({
        access_token: 'new-access',
        expires_in: 3600,
      })
    );

    service.restoreSession().subscribe((ok) => {
      expect(ok).toBeTrue();
      expect(localStorage.getItem('access_token')).toBe('new-access');
      expect(api.refreshToken).toHaveBeenCalledWith('refresh');
      done();
    });
  });
});
