export type Message = {
  type: MessageType;
  data?: Record<string, any>;
};
export type MessageResponse = {
  retcode?: number;
  body?: {
    message?: string;
    [key: string]: any;
  }
};
export enum MessageType {
  UPDATE_MDAP_COOKIE = 'update-mdap-message',
  UPDATE_PROJECT = 'update-project',
  SEND_REPORT = 'send-report',
}
export enum Projects {
  BRANCH_EMAP = 'branch-emap',
  BRANCH_SERVICE = 'branch-service',
  OPS = 'ops',
  OPS_OPEN_ACCESS = 'ops-open-access',
  THREE_PL_OPEN = 'three-pl-open',
  USER_GUIDE = 'user-guide',
  SPX_OPEN_WEB = 'spx-open-web',
  PARTNER_INTEGRATION_SYSTEM = 'partner-inteagration-system',
  CELESTIAL_FRONTEND = 'celestial-frontend',
  SPX_OPEN_MOBILE = 'spx-open-mobile',
  STAR_FISH = 'starfish',
}

export enum MessageResponseCode {
  ok = 0,
}
