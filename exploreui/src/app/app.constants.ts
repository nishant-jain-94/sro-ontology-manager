import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public static Server: String = 'https://concept-engine-dev.stackroute.in';
    public static ApiUrl: String = 'api/';
    public static ServerWithApiUrl: String = `${Configuration.Server}/${Configuration.ApiUrl}`;
}
