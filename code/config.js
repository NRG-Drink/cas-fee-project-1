import path from 'path';

const __dirname = import.meta.dirname;

export const ROOT = path.resolve("code");
export const ConfigRoot = path.resolve(__dirname);

const jwtSecret = "aklsdjfklöasjdcma8sd90mcklasdföasdf$ädasöfü pi340qkrlöam,dflöäasf"
export const CONFIG = {
    root: ROOT,
    data: (dbName) => path.join(ROOT, 'data', dbName),
    public: path.join(ROOT, 'public'),
    publicCombined: (dbName) => path.join(ROOT, 'data', dbName),

    publicDefault: path.join(ConfigRoot, 'public'),
    views: path.join(ROOT, 'views'),
    viewsDefault: path.join(ConfigRoot, 'views'),
    jwt_secret : jwtSecret,
    jwt_sign : {expiresIn: "1d", audience: "self", issuer: "pizza"},
    jwt_validate :  {secret: jwtSecret, audience: "self", issuer: "pizza", algorithms: ["HS256"]},
};