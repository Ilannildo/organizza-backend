export interface App {
  title: string;
  description: string;
  keywords: string;
  googleAnalyticsTrackingID: string;
}

export interface Secure {
  ssl: boolean;
  privateKey: string;
  certificate: string;
  caBundle: string;
}

export interface Files {
  allJS: string[];
  models: string[];
  routes: string[];
  configs: string[];
  policies: string[];
  sockets: string[];
  typedefs: string[];
  resolvers: string[];
  validations: [string];
  i18n: string;
}

export type Elasticsearch = {
  host: string;
  indices: {
    products: {
      index: string;
      type: string;
    };
    stores: {
      index: string;
      type: string;
    };
  };
  retrySync: {
    maxRetries: number;
    retryInterval: number;
  };
};

export interface ConfigEnvsObject {
  elasticsearch: Elasticsearch;
  extension: string;
  outDir: string;
  app: App;
  sessionSecret: string;
  db: {
    promise: Promise<any>;
    uri: string;
    type: any;
    replication: any;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    debug: boolean;
    synchronize: boolean;
    logging: boolean;
    options?: {
      ssl?: boolean;
      sslValidate?: boolean;
      checkServerIdentity?: boolean;
      sslCA?: string;
      sslCert?: string;
      sslKey?: string;
      sslPass?: string;
    };
  };
  port: number;
  host: string;
  domain: string;
  illegalUsernames: string[];
  files: Files;
  secure: Secure;
  gMaps: { apiKey?: string };
  utils: {
    getGlobbedPaths: Function;
    validateSessionSecret: Function;
  };
  log: {
    format: string;
    fileLogger: {
      directoryPath: string;
      fileName: string;
      maxsize: number;
      maxFiles: number;
      json: boolean;
    };
  };
  jwt: {
    secret: string;
    prefix: string;
  };
  transformer: {
    key: string;
    iv: string;
  };
  facebook: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  };
  google: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  };
  multer: {
    userImagePath: string;
    tutorialImagePath: string;
    variantImagePath: string;
    storeImagePath: string;
  };
}