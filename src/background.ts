import { checkMdapCookie, sendReport, updateMdapCookie, updateProject } from './core';
import { MessageResponse, MessageType } from './types';

checkMdapCookie();
setInterval(checkMdapCookie, 24 * 3600 * 1000);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === MessageType.UPDATE_MDAP_COOKIE) {
    updateMdapCookie().then(() => {
      sendResponse({ retcode: 0 } as MessageResponse);
    }).catch(e => {
      sendResponse({ retcode: -1, body: { message: e.toString(), detail: JSON.stringify(e, null, 2) } } as MessageResponse);
    });
  }
  if (message?.type === MessageType.UPDATE_PROJECT) {
    updateProject(message?.data?.project).then(() => {
      sendResponse({ retcode: 0 } as MessageResponse);
    }).catch(e => {
      sendResponse({ retcode: -1, body: { message: e.toString(), detail: JSON.stringify(e, null, 2) } } as MessageResponse);
    });
  }
  if (message?.type === MessageType.SEND_REPORT) {
    sendReport().then((res) => {
      sendResponse({ retcode: 0, body: { web_url: res?.web_url } } as MessageResponse);
    }).catch(e => {
      sendResponse({ retcode: -1, body: { message: e.toString(), detail: JSON.stringify(e, null, 2) } } as MessageResponse);
    });
  }
  return true;
});
