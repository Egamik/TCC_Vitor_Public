// types/express/index.d.ts
import { Contract, Gateway } from 'fabric-network';

declare global {
    namespace Express {
        interface Request {
            contract?: Contract;
            gateway?: Gateway;
        }
    }
}
