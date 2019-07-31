import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapLoaderService {

  private promise: Promise<any>;
  constructor() { }
  public load(): Promise<any> {
    const browserKey = 'google_key_here';
    const map = {
      URL: 'https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing,places&key=' +
      browserKey + '&callback=__onGoogleLoaded',
    };

    // First time 'load' is called?
    if (!this.promise) {

      // Make promise to load
      this.promise = new Promise(resolve => {
        this.loadScript(map.URL);
        // Set callback for when google maps is loaded.
        // tslint:disable-next-line:no-string-literal
        window['__onGoogleLoaded'] = ($event) => {
          resolve('google maps api loaded');
        };
      });
    }

    // Always return promise. When 'load' is called many times, the promise is already resolved.
    return this.promise;
  }

  // this function will work cross-browser for loading scripts asynchronously
  loadScript(src, callback?): void {
    let s: any;
    let r = false;
    let t;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function() {
      // console.log( this.readyState ); //uncomment this line to see which ready states are called.
      if (!r && (!this.readyState || this.readyState === 'complete')) {
        r = true;
        if (typeof callback === 'function') {
          callback();
        }
      }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  }
}
