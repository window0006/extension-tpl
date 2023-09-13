import { Message, MessageResponse, MessageType } from './types';

setTimeout(() => {
  chrome.runtime.sendMessage<Message, MessageResponse>({
    type: MessageType.UPDATE_MDAP_COOKIE,
  }, response => {
    if (response?.retcode !== 0) {
      console.log('update cookie in content script:', response?.body?.message || 'somthing wrong');
      return;
    }
    console.log('✅ update cookie in content script success!');
  });
}, 5000);
