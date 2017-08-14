import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public static Server: string = 'http://localhost:3000';
    public static ApiUrl: string = 'api/';
    public static ServerWithApiUrl: string = `${Configuration.Server}/${Configuration.ApiUrl}`;
}