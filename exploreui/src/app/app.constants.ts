import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public static Server: String = 'http://localhost:3000';
    public static ApiUrl: String = 'api/';
    public static ServerWithApiUrl: String = `${Configuration.Server}/${Configuration.ApiUrl}`;
}
