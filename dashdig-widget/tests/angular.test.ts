/**
 * Angular Integration Tests
 * Tests for the Angular component and service
 */

import { TestBed, ComponentFixture, fakeAsync, tick, flush } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DashdigComponent } from '../src/integrations/angular/dashdig.component';
import { DashdigService } from '../src/integrations/angular/dashdig.service';
import { DashdigModule } from '../src/integrations/angular/dashdig.module';

describe('Angular Integration', () => {
  const mockConfig = {
    apiKey: 'ddg_test_key_12345',
    position: 'bottom-right' as const,
    theme: 'light' as const,
    autoShow: true
  };

  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
      status: 200
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('DashdigComponent', () => {
    let component: DashdigComponent;
    let fixture: ComponentFixture<DashdigComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DashdigComponent]
      });

      fixture = TestBed.createComponent(DashdigComponent);
      component = fixture.componentInstance;
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with required apiKey', fakeAsync(() => {
      component.apiKey = mockConfig.apiKey;
      fixture.detectChanges();
      tick(100);

      expect(component).toBeTruthy();
      flush();
    }));

    it('should initialize with all config options', fakeAsync(() => {
      component.apiKey = mockConfig.apiKey;
      component.position = mockConfig.position;
      component.theme = mockConfig.theme;
      component.autoShow = mockConfig.autoShow;
      
      fixture.detectChanges();
      tick(100);

      expect(component).toBeTruthy();
      flush();
    }));

    it('should emit load event when widget loads', fakeAsync(() => {
      const loadSpy = jest.fn();
      component.load.subscribe(loadSpy);
      
      component.apiKey = mockConfig.apiKey;
      fixture.detectChanges();
      tick(100);

      expect(loadSpy).toHaveBeenCalled();
      flush();
    }));

    it('should emit error event on initialization error', fakeAsync(() => {
      const errorSpy = jest.fn();
      component.error.subscribe(errorSpy);
      
      component.apiKey = 'invalid_key';
      fixture.detectChanges();
      tick(100);

      expect(errorSpy).toHaveBeenCalled();
      flush();
    }));

    it('should cleanup widget on destroy', fakeAsync(() => {
      component.apiKey = mockConfig.apiKey;
      fixture.detectChanges();
      tick(100);

      fixture.destroy();

      // Widget should be cleaned up
      expect(document.querySelector('[data-dashdig-widget]')).toBeNull();
      flush();
    }));

    it('should support all position options', fakeAsync(() => {
      const positions: Array<'bottom-right' | 'bottom-left'> = ['bottom-right', 'bottom-left'];
      
      positions.forEach(position => {
        const testFixture = TestBed.createComponent(DashdigComponent);
        const testComponent = testFixture.componentInstance;
        
        testComponent.apiKey = mockConfig.apiKey;
        testComponent.position = position;
        testFixture.detectChanges();
        tick(100);

        expect(testComponent).toBeTruthy();
        testFixture.destroy();
      });
      
      flush();
    }));

    it('should support both theme options', fakeAsync(() => {
      const themes: Array<'light' | 'dark'> = ['light', 'dark'];
      
      themes.forEach(theme => {
        const testFixture = TestBed.createComponent(DashdigComponent);
        const testComponent = testFixture.componentInstance;
        
        testComponent.apiKey = mockConfig.apiKey;
        testComponent.theme = theme;
        testFixture.detectChanges();
        tick(100);

        expect(testComponent).toBeTruthy();
        testFixture.destroy();
      });
      
      flush();
    }));

    it('should handle custom apiUrl', fakeAsync(() => {
      component.apiKey = mockConfig.apiKey;
      component.apiUrl = 'https://custom-api.example.com';
      
      fixture.detectChanges();
      tick(100);

      expect(component).toBeTruthy();
      flush();
    }));

    it('should update when inputs change', fakeAsync(() => {
      component.apiKey = mockConfig.apiKey;
      component.theme = 'light';
      fixture.detectChanges();
      tick(100);

      component.theme = 'dark';
      fixture.detectChanges();
      tick(100);

      expect(component.theme).toBe('dark');
      flush();
    }));

    it('should provide show method', fakeAsync(() => {
      component.apiKey = mockConfig.apiKey;
      fixture.detectChanges();
      tick(100);

      expect(() => component.show()).not.toThrow();
      flush();
    }));

    it('should provide hide method', fakeAsync(() => {
      component.apiKey = mockConfig.apiKey;
      fixture.detectChanges();
      tick(100);

      expect(() => component.hide()).not.toThrow();
      flush();
    }));

    it('should provide track method', fakeAsync(() => {
      component.apiKey = mockConfig.apiKey;
      fixture.detectChanges();
      tick(100);

      expect(() => component.track('test_event')).not.toThrow();
      flush();
    }));
  });

  describe('DashdigService', () => {
    let service: DashdigService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [DashdigService]
      });

      service = TestBed.inject(DashdigService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with config', fakeAsync(() => {
      service.initializeWith(mockConfig);
      tick(100);

      expect(service.isInitialized()).toBe(true);
      flush();
    }));

    it('should throw error if not initialized', () => {
      expect(() => service.show()).toThrow();
    });

    it('should provide show method after initialization', fakeAsync(() => {
      service.initializeWith(mockConfig);
      tick(100);

      expect(() => service.show()).not.toThrow();
      flush();
    }));

    it('should provide hide method after initialization', fakeAsync(() => {
      service.initializeWith(mockConfig);
      tick(100);

      expect(() => service.hide()).not.toThrow();
      flush();
    }));

    it('should provide track method after initialization', fakeAsync(() => {
      service.initializeWith(mockConfig);
      tick(100);

      expect(() => service.track('test_event')).not.toThrow();
      flush();
    }));

    it('should get widget instance', fakeAsync(() => {
      service.initializeWith(mockConfig);
      tick(100);

      const instance = service.getInstance();
      expect(instance).toBeDefined();
      flush();
    }));

    it('should cleanup on destroy', fakeAsync(() => {
      service.initializeWith(mockConfig);
      tick(100);

      service.destroy();

      expect(service.isInitialized()).toBe(false);
      flush();
    }));

    it('should handle track with data', fakeAsync(() => {
      service.initializeWith(mockConfig);
      tick(100);

      const eventData = { button: 'signup', page: 'homepage' };
      expect(() => service.track('button_click', eventData)).not.toThrow();
      
      flush();
    }));
  });

  describe('DashdigModule', () => {
    it('should provide forRoot method', () => {
      const module = DashdigModule.forRoot(mockConfig);
      expect(module).toBeDefined();
      expect(module.ngModule).toBe(DashdigModule);
    });

    it('should configure providers with forRoot', () => {
      const module = DashdigModule.forRoot(mockConfig);
      expect(module.providers).toBeDefined();
      expect(module.providers?.length).toBeGreaterThan(0);
    });
  });

  describe('Integration with Host Component', () => {
    @Component({
      selector: 'test-host',
      template: `
        <dashdig-widget 
          [apiKey]="apiKey"
          [position]="position"
          [theme]="theme"
          (load)="onLoad()"
          (error)="onError($event)">
        </dashdig-widget>
      `,
      standalone: true,
      imports: [DashdigComponent]
    })
    class TestHostComponent {
      apiKey = mockConfig.apiKey;
      position = mockConfig.position;
      theme = mockConfig.theme;
      loadCalled = false;
      errorCalled = false;

      onLoad() {
        this.loadCalled = true;
      }

      onError(error: Error) {
        this.errorCalled = true;
      }
    }

    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent]
      });

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should render in host component', fakeAsync(() => {
      hostFixture.detectChanges();
      tick(100);

      const widgetElement = hostFixture.debugElement.query(By.directive(DashdigComponent));
      expect(widgetElement).toBeTruthy();
      flush();
    }));

    it('should call load callback', fakeAsync(() => {
      hostFixture.detectChanges();
      tick(100);

      expect(hostComponent.loadCalled).toBe(true);
      flush();
    }));

    it('should pass inputs correctly', fakeAsync(() => {
      hostFixture.detectChanges();
      tick(100);

      const widgetElement = hostFixture.debugElement.query(By.directive(DashdigComponent));
      const widgetComponent = widgetElement.componentInstance as DashdigComponent;

      expect(widgetComponent.apiKey).toBe(mockConfig.apiKey);
      expect(widgetComponent.position).toBe(mockConfig.position);
      expect(widgetComponent.theme).toBe(mockConfig.theme);
      flush();
    }));

    it('should update when host inputs change', fakeAsync(() => {
      hostFixture.detectChanges();
      tick(100);

      hostComponent.theme = 'dark';
      hostFixture.detectChanges();
      tick(100);

      const widgetElement = hostFixture.debugElement.query(By.directive(DashdigComponent));
      const widgetComponent = widgetElement.componentInstance as DashdigComponent;

      expect(widgetComponent.theme).toBe('dark');
      flush();
    }));
  });

  describe('Multiple Instances', () => {
    @Component({
      selector: 'test-multi',
      template: `
        <dashdig-widget [apiKey]="'ddg_key_1'"></dashdig-widget>
        <dashdig-widget [apiKey]="'ddg_key_2'"></dashdig-widget>
      `,
      standalone: true,
      imports: [DashdigComponent]
    })
    class TestMultiComponent {}

    it('should handle multiple widget components', fakeAsync(() => {
      const testFixture = TestBed.createComponent(TestMultiComponent);
      testFixture.detectChanges();
      tick(100);

      const widgets = testFixture.debugElement.queryAll(By.directive(DashdigComponent));
      expect(widgets.length).toBe(2);
      flush();
    }));
  });

  describe('TypeScript Types', () => {
    it('should accept valid DashdigConfig', fakeAsync(() => {
      const testFixture = TestBed.createComponent(DashdigComponent);
      const component = testFixture.componentInstance;
      
      component.apiKey = 'ddg_test_key';
      component.position = 'bottom-right';
      component.theme = 'light';
      component.autoShow = true;
      component.apiUrl = 'https://api.example.com';
      
      testFixture.detectChanges();
      tick(100);

      expect(component).toBeTruthy();
      flush();
    }));

    it('should work with minimal config', fakeAsync(() => {
      const testFixture = TestBed.createComponent(DashdigComponent);
      const component = testFixture.componentInstance;
      
      component.apiKey = 'ddg_test_key';
      testFixture.detectChanges();
      tick(100);

      expect(component).toBeTruthy();
      flush();
    }));
  });
});

